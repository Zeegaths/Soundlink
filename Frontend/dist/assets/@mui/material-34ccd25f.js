import{r as i,b as E}from"../vendor-f697bdeb.js";import"../@farcaster/auth-kit-625cc98d.js";import{_ as d,T as S}from"../@emotion/react-e7584583.js";const b=typeof window<"u"?i.useLayoutEffect:i.useEffect,w=b;function h(n,s){const e=d({},s);return Object.keys(n).forEach(t=>{if(t.toString().match(/^(components|slots)$/))e[t]=d({},n[t],e[t]);else if(t.toString().match(/^(componentsProps|slotProps)$/)){const c=n[t]||{},o=s[t];e[t]={},!o||!Object.keys(o)?e[t]=c:!c||!Object.keys(c)?e[t]=o:(e[t]=d({},o),Object.keys(c).forEach(u=>{e[t][u]=h(c[u],o[u])}))}else e[t]===void 0&&(e[t]=n[t])}),e}function x(n){const{theme:s,name:e,props:t}=n;return!s||!s.components||!s.components[e]||!s.components[e].defaultProps?t:h(s.components[e].defaultProps,t)}function g(n){return Object.keys(n).length===0}function L(n=null){const s=i.useContext(S);return!s||g(s)?n:s}function O(n,s,e,t,c){const[o,u]=i.useState(()=>c&&e?e(n).matches:t?t(n).matches:s);return w(()=>{let f=!0;if(!e)return;const r=e(n),a=()=>{f&&u(r.matches)};return a(),r.addListener(a),()=>{f=!1,r.removeListener(a)}},[n,e]),o}const y=E["useSyncExternalStore"];function Q(n,s,e,t,c){const o=i.useCallback(()=>s,[s]),u=i.useMemo(()=>{if(c&&e)return()=>e(n).matches;if(t!==null){const{matches:l}=t(n);return()=>l}return o},[o,n,t,c,e]),[f,r]=i.useMemo(()=>{if(e===null)return[o,()=>()=>{}];const l=e(n);return[()=>l.matches,m=>(l.addListener(m),()=>{l.removeListener(m)})]},[o,e,n]);return y(r,f,u)}function T(n,s={}){const e=L(),t=typeof window<"u"&&typeof window.matchMedia<"u",{defaultMatches:c=!1,matchMedia:o=t?window.matchMedia:null,ssrMatchMedia:u=null,noSsr:f=!1}=x({name:"MuiUseMediaQuery",props:s,theme:e});let r=typeof n=="function"?n(e):n;return r=r.replace(/^@media( ?)/m,""),(y!==void 0?Q:O)(r,c,o,u,f)}export{T as u};
