import{g as n,s as d}from"../react-hook-form-5177d574.js";var o=function(r,e,i){if(r&&"reportValidity"in r){var t=n(i,e);r.setCustomValidity(t&&t.message||""),r.reportValidity()}},l=function(r,e){var i=function(f){var a=e.fields[f];a&&a.ref&&"reportValidity"in a.ref?o(a.ref,f,r):a.refs&&a.refs.forEach(function(s){return o(s,f,r)})};for(var t in e.fields)i(t)},v=function(r,e){e.shouldUseNativeValidation&&l(r,e);var i={};for(var t in r){var f=n(e.fields,t);d(i,t,Object.assign(r[t],{ref:f&&f.ref}))}return i};export{v as f,l as t};