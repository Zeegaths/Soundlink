// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Soundlink.sol";

contract RapBattle {
    struct Participant {
        string name;
        address wallet;
        uint votes;
    }

    struct Battle {
        uint id;
        string name;
        uint startDate;       // Start time of the battle
        uint votingEndDate;   // When voting ends
        uint prizePool;
        bool winnerDeclared;
        uint participantCount;
        Participant[] participants;
        uint[] beats;
        mapping(address => bool) hasVoted;
        mapping(address => bool) isRegistered;
    }

    address public owner;
    uint public battleCount;
    Soundlink public soundlink;
    mapping(uint => Battle) public battles;

    // Events
    event BattleCreated(uint id, string name, uint startDate, uint votingEndDate, uint prizePool, uint[] beats);
    event ParticipantRegistered(uint battleId, string name, address wallet);
    event Voted(uint battleId, string name, address voter);
    event WinnerDeclared(uint battleId, string name, uint votes, address winnerAddress);
    event PrizeDistributed(uint battleId, uint prizeAmount, address winner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier validBattle(uint battleId) {
        require(battleId > 0 && battleId <= battleCount, "Invalid battle ID");
        _;
    }

    modifier battleInProgress(uint battleId) {
        Battle storage battle = battles[battleId];
        require(block.timestamp >= battle.startDate, "Battle hasn't started yet");
        require(block.timestamp <= battle.votingEndDate, "Battle has ended");
        _;
    }

    constructor(address soundlinkAddress) {
        owner = msg.sender;
        soundlink = Soundlink(soundlinkAddress);
    }

    function createBattle(
        string memory name,
        uint startDate,
        uint votingDuration,
        uint[] memory beatIds
    ) public payable onlyOwner {
        require(startDate > block.timestamp, "Start date must be in the future");
        require(votingDuration > 0, "Voting duration must be positive");
        require(msg.value > 0, "Initial prize pool required");

        battleCount++;
        Battle storage newBattle = battles[battleCount];
        newBattle.id = battleCount;
        newBattle.name = name;
        newBattle.startDate = startDate;
        newBattle.votingEndDate = startDate + votingDuration;
        newBattle.prizePool = msg.value;
        newBattle.beats = beatIds;

        emit BattleCreated(battleCount, name, startDate, newBattle.votingEndDate, msg.value, beatIds);
    }

    function registerParticipant(uint battleId, string memory name) 
        public 
        validBattle(battleId) 
    {
        Battle storage battle = battles[battleId];
        require(block.timestamp < battle.startDate, "Registration period has ended");
        require(!battle.isRegistered[msg.sender], "Already registered");
        require(bytes(name).length > 0, "Name cannot be empty");

        battle.isRegistered[msg.sender] = true;
        battle.participants.push(Participant({
            name: name,
            wallet: msg.sender,
            votes: 0
        }));
        battle.participantCount++;

        emit ParticipantRegistered(battleId, name, msg.sender);
    }

    function vote(uint battleId, uint participantIndex) 
        public 
        validBattle(battleId)
        battleInProgress(battleId)
    {
        Battle storage battle = battles[battleId];
        require(!battle.hasVoted[msg.sender], "Already voted");
        require(participantIndex < battle.participants.length, "Invalid participant");
        require(battle.participants.length >= 2, "Not enough participants");

        battle.hasVoted[msg.sender] = true;
        battle.participants[participantIndex].votes++;

        emit Voted(battleId, battle.participants[participantIndex].name, msg.sender);

        // Check if voting period has ended and declare winner if needed
        if (block.timestamp >= battle.votingEndDate) {
            _declareWinner(battleId);
        }
    }

    function addPrize(uint battleId) public payable validBattle(battleId) {
        Battle storage battle = battles[battleId];
        require(!battle.winnerDeclared, "Winner already declared");
        require(block.timestamp <= battle.votingEndDate, "Battle has ended");
        require(msg.value > 0, "Prize amount must be greater than 0");

        battle.prizePool += msg.value;
    }

    // Internal function to declare winner and distribute prize
    function _declareWinner(uint battleId) internal {
        Battle storage battle = battles[battleId];
        require(!battle.winnerDeclared, "Winner already declared");
        require(battle.participants.length >= 2, "Not enough participants");
        require(block.timestamp >= battle.votingEndDate, "Voting period not ended");

        uint highestVotes = 0;
        uint winnerIndex = 0;
        bool isTie = false;

        // Find the winner
        for (uint i = 0; i < battle.participants.length; i++) {
            if (battle.participants[i].votes > highestVotes) {
                highestVotes = battle.participants[i].votes;
                winnerIndex = i;
                isTie = false;
            } else if (battle.participants[i].votes == highestVotes) {
                isTie = true;
            }
        }

        require(!isTie, "Tie detected - cannot declare winner");
        require(highestVotes > 0, "No votes cast");

        Participant memory winner = battle.participants[winnerIndex];
        battle.winnerDeclared = true;

        emit WinnerDeclared(battleId, winner.name, winner.votes, winner.wallet);

        // Distribute prize
        if (battle.prizePool > 0) {
            uint prizeAmount = battle.prizePool;
            battle.prizePool = 0; // Set to 0 before transfer to prevent reentrancy
            
            (bool sent, ) = winner.wallet.call{value: prizeAmount}("");
            require(sent, "Failed to send prize");
            
            emit PrizeDistributed(battleId, prizeAmount, winner.wallet);
        }
    }

    // Public function to force winner declaration after voting period
    function finalizeWinner(uint battleId) public validBattle(battleId) {
        Battle storage battle = battles[battleId];
        require(block.timestamp >= battle.votingEndDate, "Voting period not ended");
        require(!battle.winnerDeclared, "Winner already declared");
        
        _declareWinner(battleId);
    }

    // View functions
    function getBattleBeats(uint battleId) 
        public 
        view 
        validBattle(battleId) 
        returns (Soundlink.Beat[] memory) 
    {
        Battle storage battle = battles[battleId];
        uint beatCount = battle.beats.length;

        Soundlink.Beat[] memory battleBeats = new Soundlink.Beat[](beatCount);
        for (uint i = 0; i < beatCount; i++) {
            battleBeats[i] = soundlink.getSingleBeat(battle.beats[i]);
        }
        return battleBeats;
    }

    function getParticipant(uint battleId, uint participantIndex) 
        public 
        view 
        validBattle(battleId) 
        returns (Participant memory) 
    {
        Battle storage battle = battles[battleId];
        require(participantIndex < battle.participants.length, "Invalid participant");
        return battle.participants[participantIndex];
    }

    function getBattleStatus(uint battleId)
        public
        view
        validBattle(battleId)
        returns (
            bool isStarted,
            bool isVotingEnded,
            bool isWinnerDeclared,
            uint currentPrizePool,
            uint participantCount
        )
    {
        Battle storage battle = battles[battleId];
        return (
            block.timestamp >= battle.startDate,
            block.timestamp > battle.votingEndDate,
            battle.winnerDeclared,
            battle.prizePool,
            battle.participantCount
        );
    }
}