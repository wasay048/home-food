function DE(t,e){for(var n=0;n<e.length;n++){const r=e[n];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in t)){const s=Object.getOwnPropertyDescriptor(r,i);s&&Object.defineProperty(t,i,s.get?s:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function LE(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Wy={exports:{}},Fl={},Ky={exports:{}},X={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Po=Symbol.for("react.element"),OE=Symbol.for("react.portal"),VE=Symbol.for("react.fragment"),bE=Symbol.for("react.strict_mode"),ME=Symbol.for("react.profiler"),FE=Symbol.for("react.provider"),jE=Symbol.for("react.context"),UE=Symbol.for("react.forward_ref"),$E=Symbol.for("react.suspense"),BE=Symbol.for("react.memo"),zE=Symbol.for("react.lazy"),Xp=Symbol.iterator;function qE(t){return t===null||typeof t!="object"?null:(t=Xp&&t[Xp]||t["@@iterator"],typeof t=="function"?t:null)}var Gy={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Qy=Object.assign,Yy={};function Yi(t,e,n){this.props=t,this.context=e,this.refs=Yy,this.updater=n||Gy}Yi.prototype.isReactComponent={};Yi.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Yi.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Jy(){}Jy.prototype=Yi.prototype;function nd(t,e,n){this.props=t,this.context=e,this.refs=Yy,this.updater=n||Gy}var rd=nd.prototype=new Jy;rd.constructor=nd;Qy(rd,Yi.prototype);rd.isPureReactComponent=!0;var Zp=Array.isArray,Xy=Object.prototype.hasOwnProperty,id={current:null},Zy={key:!0,ref:!0,__self:!0,__source:!0};function ev(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Xy.call(e,r)&&!Zy.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var u=Array(l),h=0;h<l;h++)u[h]=arguments[h+2];i.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:Po,type:t,key:s,ref:o,props:i,_owner:id.current}}function HE(t,e){return{$$typeof:Po,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function sd(t){return typeof t=="object"&&t!==null&&t.$$typeof===Po}function WE(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var em=/\/+/g;function qu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?WE(""+t.key):e.toString(36)}function xa(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case Po:case OE:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+qu(o,0):r,Zp(i)?(n="",t!=null&&(n=t.replace(em,"$&/")+"/"),xa(i,e,n,"",function(h){return h})):i!=null&&(sd(i)&&(i=HE(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(em,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Zp(t))for(var l=0;l<t.length;l++){s=t[l];var u=r+qu(s,l);o+=xa(s,e,n,u,i)}else if(u=qE(t),typeof u=="function")for(t=u.call(t),l=0;!(s=t.next()).done;)s=s.value,u=r+qu(s,l++),o+=xa(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function la(t,e,n){if(t==null)return t;var r=[],i=0;return xa(t,r,"","",function(s){return e.call(n,s,i++)}),r}function KE(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var ut={current:null},Na={transition:null},GE={ReactCurrentDispatcher:ut,ReactCurrentBatchConfig:Na,ReactCurrentOwner:id};function tv(){throw Error("act(...) is not supported in production builds of React.")}X.Children={map:la,forEach:function(t,e,n){la(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return la(t,function(){e++}),e},toArray:function(t){return la(t,function(e){return e})||[]},only:function(t){if(!sd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};X.Component=Yi;X.Fragment=VE;X.Profiler=ME;X.PureComponent=nd;X.StrictMode=bE;X.Suspense=$E;X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=GE;X.act=tv;X.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=Qy({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=id.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)Xy.call(e,u)&&!Zy.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var h=0;h<u;h++)l[h]=arguments[h+2];r.children=l}return{$$typeof:Po,type:t.type,key:i,ref:s,props:r,_owner:o}};X.createContext=function(t){return t={$$typeof:jE,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:FE,_context:t},t.Consumer=t};X.createElement=ev;X.createFactory=function(t){var e=ev.bind(null,t);return e.type=t,e};X.createRef=function(){return{current:null}};X.forwardRef=function(t){return{$$typeof:UE,render:t}};X.isValidElement=sd;X.lazy=function(t){return{$$typeof:zE,_payload:{_status:-1,_result:t},_init:KE}};X.memo=function(t,e){return{$$typeof:BE,type:t,compare:e===void 0?null:e}};X.startTransition=function(t){var e=Na.transition;Na.transition={};try{t()}finally{Na.transition=e}};X.unstable_act=tv;X.useCallback=function(t,e){return ut.current.useCallback(t,e)};X.useContext=function(t){return ut.current.useContext(t)};X.useDebugValue=function(){};X.useDeferredValue=function(t){return ut.current.useDeferredValue(t)};X.useEffect=function(t,e){return ut.current.useEffect(t,e)};X.useId=function(){return ut.current.useId()};X.useImperativeHandle=function(t,e,n){return ut.current.useImperativeHandle(t,e,n)};X.useInsertionEffect=function(t,e){return ut.current.useInsertionEffect(t,e)};X.useLayoutEffect=function(t,e){return ut.current.useLayoutEffect(t,e)};X.useMemo=function(t,e){return ut.current.useMemo(t,e)};X.useReducer=function(t,e,n){return ut.current.useReducer(t,e,n)};X.useRef=function(t){return ut.current.useRef(t)};X.useState=function(t){return ut.current.useState(t)};X.useSyncExternalStore=function(t,e,n){return ut.current.useSyncExternalStore(t,e,n)};X.useTransition=function(){return ut.current.useTransition()};X.version="18.3.1";Ky.exports=X;var b=Ky.exports;const od=LE(b),QE=DE({__proto__:null,default:od},[b]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var YE=b,JE=Symbol.for("react.element"),XE=Symbol.for("react.fragment"),ZE=Object.prototype.hasOwnProperty,eI=YE.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,tI={key:!0,ref:!0,__self:!0,__source:!0};function nv(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)ZE.call(e,r)&&!tI.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:JE,type:t,key:s,ref:o,props:i,_owner:eI.current}}Fl.Fragment=XE;Fl.jsx=nv;Fl.jsxs=nv;Wy.exports=Fl;var y=Wy.exports,rv={exports:{}},kt={},iv={exports:{}},sv={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(B,G){var J=B.length;B.push(G);e:for(;0<J;){var me=J-1>>>1,ae=B[me];if(0<i(ae,G))B[me]=G,B[J]=ae,J=me;else break e}}function n(B){return B.length===0?null:B[0]}function r(B){if(B.length===0)return null;var G=B[0],J=B.pop();if(J!==G){B[0]=J;e:for(var me=0,ae=B.length,Ie=ae>>>1;me<Ie;){var un=2*(me+1)-1,cn=B[un],hn=un+1,dn=B[hn];if(0>i(cn,J))hn<ae&&0>i(dn,cn)?(B[me]=dn,B[hn]=J,me=hn):(B[me]=cn,B[un]=J,me=un);else if(hn<ae&&0>i(dn,J))B[me]=dn,B[hn]=J,me=hn;else break e}}return G}function i(B,G){var J=B.sortIndex-G.sortIndex;return J!==0?J:B.id-G.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var u=[],h=[],d=1,p=null,g=3,S=!1,A=!1,N=!1,L=typeof setTimeout=="function"?setTimeout:null,I=typeof clearTimeout=="function"?clearTimeout:null,w=typeof setImmediate!="undefined"?setImmediate:null;typeof navigator!="undefined"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function k(B){for(var G=n(h);G!==null;){if(G.callback===null)r(h);else if(G.startTime<=B)r(h),G.sortIndex=G.expirationTime,e(u,G);else break;G=n(h)}}function P(B){if(N=!1,k(B),!A)if(n(u)!==null)A=!0,as(V);else{var G=n(h);G!==null&&ln(P,G.startTime-B)}}function V(B,G){A=!1,N&&(N=!1,I(v),v=-1),S=!0;var J=g;try{for(k(G),p=n(u);p!==null&&(!(p.expirationTime>G)||B&&!R());){var me=p.callback;if(typeof me=="function"){p.callback=null,g=p.priorityLevel;var ae=me(p.expirationTime<=G);G=t.unstable_now(),typeof ae=="function"?p.callback=ae:p===n(u)&&r(u),k(G)}else r(u);p=n(u)}if(p!==null)var Ie=!0;else{var un=n(h);un!==null&&ln(P,un.startTime-G),Ie=!1}return Ie}finally{p=null,g=J,S=!1}}var F=!1,E=null,v=-1,_=5,T=-1;function R(){return!(t.unstable_now()-T<_)}function D(){if(E!==null){var B=t.unstable_now();T=B;var G=!0;try{G=E(!0,B)}finally{G?C():(F=!1,E=null)}}else F=!1}var C;if(typeof w=="function")C=function(){w(D)};else if(typeof MessageChannel!="undefined"){var At=new MessageChannel,Ir=At.port2;At.port1.onmessage=D,C=function(){Ir.postMessage(null)}}else C=function(){L(D,0)};function as(B){E=B,F||(F=!0,C())}function ln(B,G){v=L(function(){B(t.unstable_now())},G)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(B){B.callback=null},t.unstable_continueExecution=function(){A||S||(A=!0,as(V))},t.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):_=0<B?Math.floor(1e3/B):5},t.unstable_getCurrentPriorityLevel=function(){return g},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(B){switch(g){case 1:case 2:case 3:var G=3;break;default:G=g}var J=g;g=G;try{return B()}finally{g=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(B,G){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var J=g;g=B;try{return G()}finally{g=J}},t.unstable_scheduleCallback=function(B,G,J){var me=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?me+J:me):J=me,B){case 1:var ae=-1;break;case 2:ae=250;break;case 5:ae=1073741823;break;case 4:ae=1e4;break;default:ae=5e3}return ae=J+ae,B={id:d++,callback:G,priorityLevel:B,startTime:J,expirationTime:ae,sortIndex:-1},J>me?(B.sortIndex=J,e(h,B),n(u)===null&&B===n(h)&&(N?(I(v),v=-1):N=!0,ln(P,J-me))):(B.sortIndex=ae,e(u,B),A||S||(A=!0,as(V))),B},t.unstable_shouldYield=R,t.unstable_wrapCallback=function(B){var G=g;return function(){var J=g;g=G;try{return B.apply(this,arguments)}finally{g=J}}}})(sv);iv.exports=sv;var nI=iv.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rI=b,St=nI;function j(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var ov=new Set,eo={};function Jr(t,e){bi(t,e),bi(t+"Capture",e)}function bi(t,e){for(eo[t]=e,t=0;t<e.length;t++)ov.add(e[t])}var Sn=!(typeof window=="undefined"||typeof window.document=="undefined"||typeof window.document.createElement=="undefined"),Oc=Object.prototype.hasOwnProperty,iI=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,tm={},nm={};function sI(t){return Oc.call(nm,t)?!0:Oc.call(tm,t)?!1:iI.test(t)?nm[t]=!0:(tm[t]=!0,!1)}function oI(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function aI(t,e,n,r){if(e===null||typeof e=="undefined"||oI(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function ct(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Be={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Be[t]=new ct(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Be[e]=new ct(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Be[t]=new ct(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Be[t]=new ct(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Be[t]=new ct(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Be[t]=new ct(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Be[t]=new ct(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Be[t]=new ct(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Be[t]=new ct(t,5,!1,t.toLowerCase(),null,!1,!1)});var ad=/[\-:]([a-z])/g;function ld(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(ad,ld);Be[e]=new ct(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(ad,ld);Be[e]=new ct(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(ad,ld);Be[e]=new ct(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Be[t]=new ct(t,1,!1,t.toLowerCase(),null,!1,!1)});Be.xlinkHref=new ct("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Be[t]=new ct(t,1,!1,t.toLowerCase(),null,!0,!0)});function ud(t,e,n,r){var i=Be.hasOwnProperty(e)?Be[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(aI(e,n,i,r)&&(n=null),r||i===null?sI(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var Ln=rI.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ua=Symbol.for("react.element"),hi=Symbol.for("react.portal"),di=Symbol.for("react.fragment"),cd=Symbol.for("react.strict_mode"),Vc=Symbol.for("react.profiler"),av=Symbol.for("react.provider"),lv=Symbol.for("react.context"),hd=Symbol.for("react.forward_ref"),bc=Symbol.for("react.suspense"),Mc=Symbol.for("react.suspense_list"),dd=Symbol.for("react.memo"),jn=Symbol.for("react.lazy"),uv=Symbol.for("react.offscreen"),rm=Symbol.iterator;function Es(t){return t===null||typeof t!="object"?null:(t=rm&&t[rm]||t["@@iterator"],typeof t=="function"?t:null)}var ve=Object.assign,Hu;function xs(t){if(Hu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Hu=e&&e[1]||""}return`
`+Hu+t}var Wu=!1;function Ku(t,e){if(!t||Wu)return"";Wu=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var r=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){r=h}t.call(e.prototype)}else{try{throw Error()}catch(h){r=h}t()}}catch(h){if(h&&r&&typeof h.stack=="string"){for(var i=h.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,l=s.length-1;1<=o&&0<=l&&i[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(i[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||i[o]!==s[l]){var u=`
`+i[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=l);break}}}finally{Wu=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?xs(t):""}function lI(t){switch(t.tag){case 5:return xs(t.type);case 16:return xs("Lazy");case 13:return xs("Suspense");case 19:return xs("SuspenseList");case 0:case 2:case 15:return t=Ku(t.type,!1),t;case 11:return t=Ku(t.type.render,!1),t;case 1:return t=Ku(t.type,!0),t;default:return""}}function Fc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case di:return"Fragment";case hi:return"Portal";case Vc:return"Profiler";case cd:return"StrictMode";case bc:return"Suspense";case Mc:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case lv:return(t.displayName||"Context")+".Consumer";case av:return(t._context.displayName||"Context")+".Provider";case hd:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case dd:return e=t.displayName||null,e!==null?e:Fc(t.type)||"Memo";case jn:e=t._payload,t=t._init;try{return Fc(t(e))}catch(n){}}return null}function uI(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Fc(e);case 8:return e===cd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function dr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function cv(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function cI(t){var e=cv(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n!="undefined"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function ca(t){t._valueTracker||(t._valueTracker=cI(t))}function hv(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=cv(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function Xa(t){if(t=t||(typeof document!="undefined"?document:void 0),typeof t=="undefined")return null;try{return t.activeElement||t.body}catch(e){return t.body}}function jc(t,e){var n=e.checked;return ve({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n!=null?n:t._wrapperState.initialChecked})}function im(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=dr(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function dv(t,e){e=e.checked,e!=null&&ud(t,"checked",e,!1)}function Uc(t,e){dv(t,e);var n=dr(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?$c(t,e.type,n):e.hasOwnProperty("defaultValue")&&$c(t,e.type,dr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function sm(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function $c(t,e,n){(e!=="number"||Xa(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ns=Array.isArray;function ki(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+dr(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Bc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(j(91));return ve({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function om(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(j(92));if(Ns(n)){if(1<n.length)throw Error(j(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:dr(n)}}function fv(t,e){var n=dr(e.value),r=dr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function am(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function pv(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function zc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?pv(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var ha,mv=function(t){return typeof MSApp!="undefined"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(ha=ha||document.createElement("div"),ha.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=ha.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function to(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Fs={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},hI=["Webkit","ms","Moz","O"];Object.keys(Fs).forEach(function(t){hI.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Fs[e]=Fs[t]})});function gv(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Fs.hasOwnProperty(t)&&Fs[t]?(""+e).trim():e+"px"}function yv(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=gv(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var dI=ve({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function qc(t,e){if(e){if(dI[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(j(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(j(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(j(61))}if(e.style!=null&&typeof e.style!="object")throw Error(j(62))}}function Hc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Wc=null;function fd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Kc=null,Ci=null,Ai=null;function lm(t){if(t=Do(t)){if(typeof Kc!="function")throw Error(j(280));var e=t.stateNode;e&&(e=zl(e),Kc(t.stateNode,t.type,e))}}function vv(t){Ci?Ai?Ai.push(t):Ai=[t]:Ci=t}function _v(){if(Ci){var t=Ci,e=Ai;if(Ai=Ci=null,lm(t),e)for(t=0;t<e.length;t++)lm(e[t])}}function wv(t,e){return t(e)}function Ev(){}var Gu=!1;function Iv(t,e,n){if(Gu)return t(e,n);Gu=!0;try{return wv(t,e,n)}finally{Gu=!1,(Ci!==null||Ai!==null)&&(Ev(),_v())}}function no(t,e){var n=t.stateNode;if(n===null)return null;var r=zl(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(j(231,e,typeof n));return n}var Gc=!1;if(Sn)try{var Is={};Object.defineProperty(Is,"passive",{get:function(){Gc=!0}}),window.addEventListener("test",Is,Is),window.removeEventListener("test",Is,Is)}catch(t){Gc=!1}function fI(t,e,n,r,i,s,o,l,u){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(d){this.onError(d)}}var js=!1,Za=null,el=!1,Qc=null,pI={onError:function(t){js=!0,Za=t}};function mI(t,e,n,r,i,s,o,l,u){js=!1,Za=null,fI.apply(pI,arguments)}function gI(t,e,n,r,i,s,o,l,u){if(mI.apply(this,arguments),js){if(js){var h=Za;js=!1,Za=null}else throw Error(j(198));el||(el=!0,Qc=h)}}function Xr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Tv(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function um(t){if(Xr(t)!==t)throw Error(j(188))}function yI(t){var e=t.alternate;if(!e){if(e=Xr(t),e===null)throw Error(j(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return um(i),t;if(s===r)return um(i),e;s=s.sibling}throw Error(j(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o)throw Error(j(189))}}if(n.alternate!==r)throw Error(j(190))}if(n.tag!==3)throw Error(j(188));return n.stateNode.current===n?t:e}function Sv(t){return t=yI(t),t!==null?kv(t):null}function kv(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=kv(t);if(e!==null)return e;t=t.sibling}return null}var Cv=St.unstable_scheduleCallback,cm=St.unstable_cancelCallback,vI=St.unstable_shouldYield,_I=St.unstable_requestPaint,Se=St.unstable_now,wI=St.unstable_getCurrentPriorityLevel,pd=St.unstable_ImmediatePriority,Av=St.unstable_UserBlockingPriority,tl=St.unstable_NormalPriority,EI=St.unstable_LowPriority,Rv=St.unstable_IdlePriority,jl=null,Zt=null;function II(t){if(Zt&&typeof Zt.onCommitFiberRoot=="function")try{Zt.onCommitFiberRoot(jl,t,void 0,(t.current.flags&128)===128)}catch(e){}}var zt=Math.clz32?Math.clz32:kI,TI=Math.log,SI=Math.LN2;function kI(t){return t>>>=0,t===0?32:31-(TI(t)/SI|0)|0}var da=64,fa=4194304;function Ds(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function nl(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~i;l!==0?r=Ds(l):(s&=o,s!==0&&(r=Ds(s)))}else o=n&~i,o!==0?r=Ds(o):s!==0&&(r=Ds(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-zt(e),i=1<<n,r|=t[n],e&=~i;return r}function CI(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function AI(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-zt(s),l=1<<o,u=i[o];u===-1?(!(l&n)||l&r)&&(i[o]=CI(l,e)):u<=e&&(t.expiredLanes|=l),s&=~l}}function Yc(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Pv(){var t=da;return da<<=1,!(da&4194240)&&(da=64),t}function Qu(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function xo(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-zt(e),t[e]=n}function RI(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-zt(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function md(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-zt(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var oe=0;function xv(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Nv,gd,Dv,Lv,Ov,Jc=!1,pa=[],Xn=null,Zn=null,er=null,ro=new Map,io=new Map,$n=[],PI="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function hm(t,e){switch(t){case"focusin":case"focusout":Xn=null;break;case"dragenter":case"dragleave":Zn=null;break;case"mouseover":case"mouseout":er=null;break;case"pointerover":case"pointerout":ro.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":io.delete(e.pointerId)}}function Ts(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=Do(e),e!==null&&gd(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function xI(t,e,n,r,i){switch(e){case"focusin":return Xn=Ts(Xn,t,e,n,r,i),!0;case"dragenter":return Zn=Ts(Zn,t,e,n,r,i),!0;case"mouseover":return er=Ts(er,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return ro.set(s,Ts(ro.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,io.set(s,Ts(io.get(s)||null,t,e,n,r,i)),!0}return!1}function Vv(t){var e=xr(t.target);if(e!==null){var n=Xr(e);if(n!==null){if(e=n.tag,e===13){if(e=Tv(n),e!==null){t.blockedOn=e,Ov(t.priority,function(){Dv(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Da(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Xc(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);Wc=r,n.target.dispatchEvent(r),Wc=null}else return e=Do(n),e!==null&&gd(e),t.blockedOn=n,!1;e.shift()}return!0}function dm(t,e,n){Da(t)&&n.delete(e)}function NI(){Jc=!1,Xn!==null&&Da(Xn)&&(Xn=null),Zn!==null&&Da(Zn)&&(Zn=null),er!==null&&Da(er)&&(er=null),ro.forEach(dm),io.forEach(dm)}function Ss(t,e){t.blockedOn===e&&(t.blockedOn=null,Jc||(Jc=!0,St.unstable_scheduleCallback(St.unstable_NormalPriority,NI)))}function so(t){function e(i){return Ss(i,t)}if(0<pa.length){Ss(pa[0],t);for(var n=1;n<pa.length;n++){var r=pa[n];r.blockedOn===t&&(r.blockedOn=null)}}for(Xn!==null&&Ss(Xn,t),Zn!==null&&Ss(Zn,t),er!==null&&Ss(er,t),ro.forEach(e),io.forEach(e),n=0;n<$n.length;n++)r=$n[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<$n.length&&(n=$n[0],n.blockedOn===null);)Vv(n),n.blockedOn===null&&$n.shift()}var Ri=Ln.ReactCurrentBatchConfig,rl=!0;function DI(t,e,n,r){var i=oe,s=Ri.transition;Ri.transition=null;try{oe=1,yd(t,e,n,r)}finally{oe=i,Ri.transition=s}}function LI(t,e,n,r){var i=oe,s=Ri.transition;Ri.transition=null;try{oe=4,yd(t,e,n,r)}finally{oe=i,Ri.transition=s}}function yd(t,e,n,r){if(rl){var i=Xc(t,e,n,r);if(i===null)sc(t,e,r,il,n),hm(t,r);else if(xI(i,t,e,n,r))r.stopPropagation();else if(hm(t,r),e&4&&-1<PI.indexOf(t)){for(;i!==null;){var s=Do(i);if(s!==null&&Nv(s),s=Xc(t,e,n,r),s===null&&sc(t,e,r,il,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else sc(t,e,r,null,n)}}var il=null;function Xc(t,e,n,r){if(il=null,t=fd(r),t=xr(t),t!==null)if(e=Xr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Tv(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return il=t,null}function bv(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(wI()){case pd:return 1;case Av:return 4;case tl:case EI:return 16;case Rv:return 536870912;default:return 16}default:return 16}}var Kn=null,vd=null,La=null;function Mv(){if(La)return La;var t,e=vd,n=e.length,r,i="value"in Kn?Kn.value:Kn.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return La=i.slice(t,1<r?1-r:void 0)}function Oa(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ma(){return!0}function fm(){return!1}function Ct(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ma:fm,this.isPropagationStopped=fm,this}return ve(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ma)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ma)},persist:function(){},isPersistent:ma}),e}var Ji={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},_d=Ct(Ji),No=ve({},Ji,{view:0,detail:0}),OI=Ct(No),Yu,Ju,ks,Ul=ve({},No,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:wd,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==ks&&(ks&&t.type==="mousemove"?(Yu=t.screenX-ks.screenX,Ju=t.screenY-ks.screenY):Ju=Yu=0,ks=t),Yu)},movementY:function(t){return"movementY"in t?t.movementY:Ju}}),pm=Ct(Ul),VI=ve({},Ul,{dataTransfer:0}),bI=Ct(VI),MI=ve({},No,{relatedTarget:0}),Xu=Ct(MI),FI=ve({},Ji,{animationName:0,elapsedTime:0,pseudoElement:0}),jI=Ct(FI),UI=ve({},Ji,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),$I=Ct(UI),BI=ve({},Ji,{data:0}),mm=Ct(BI),zI={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},qI={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},HI={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function WI(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=HI[t])?!!e[t]:!1}function wd(){return WI}var KI=ve({},No,{key:function(t){if(t.key){var e=zI[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Oa(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?qI[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:wd,charCode:function(t){return t.type==="keypress"?Oa(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Oa(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),GI=Ct(KI),QI=ve({},Ul,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),gm=Ct(QI),YI=ve({},No,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:wd}),JI=Ct(YI),XI=ve({},Ji,{propertyName:0,elapsedTime:0,pseudoElement:0}),ZI=Ct(XI),eT=ve({},Ul,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),tT=Ct(eT),nT=[9,13,27,32],Ed=Sn&&"CompositionEvent"in window,Us=null;Sn&&"documentMode"in document&&(Us=document.documentMode);var rT=Sn&&"TextEvent"in window&&!Us,Fv=Sn&&(!Ed||Us&&8<Us&&11>=Us),ym=" ",vm=!1;function jv(t,e){switch(t){case"keyup":return nT.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Uv(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var fi=!1;function iT(t,e){switch(t){case"compositionend":return Uv(e);case"keypress":return e.which!==32?null:(vm=!0,ym);case"textInput":return t=e.data,t===ym&&vm?null:t;default:return null}}function sT(t,e){if(fi)return t==="compositionend"||!Ed&&jv(t,e)?(t=Mv(),La=vd=Kn=null,fi=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Fv&&e.locale!=="ko"?null:e.data;default:return null}}var oT={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function _m(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!oT[t.type]:e==="textarea"}function $v(t,e,n,r){vv(r),e=sl(e,"onChange"),0<e.length&&(n=new _d("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var $s=null,oo=null;function aT(t){Xv(t,0)}function $l(t){var e=gi(t);if(hv(e))return t}function lT(t,e){if(t==="change")return e}var Bv=!1;if(Sn){var Zu;if(Sn){var ec="oninput"in document;if(!ec){var wm=document.createElement("div");wm.setAttribute("oninput","return;"),ec=typeof wm.oninput=="function"}Zu=ec}else Zu=!1;Bv=Zu&&(!document.documentMode||9<document.documentMode)}function Em(){$s&&($s.detachEvent("onpropertychange",zv),oo=$s=null)}function zv(t){if(t.propertyName==="value"&&$l(oo)){var e=[];$v(e,oo,t,fd(t)),Iv(aT,e)}}function uT(t,e,n){t==="focusin"?(Em(),$s=e,oo=n,$s.attachEvent("onpropertychange",zv)):t==="focusout"&&Em()}function cT(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return $l(oo)}function hT(t,e){if(t==="click")return $l(e)}function dT(t,e){if(t==="input"||t==="change")return $l(e)}function fT(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Ht=typeof Object.is=="function"?Object.is:fT;function ao(t,e){if(Ht(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Oc.call(e,i)||!Ht(t[i],e[i]))return!1}return!0}function Im(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Tm(t,e){var n=Im(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Im(n)}}function qv(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?qv(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Hv(){for(var t=window,e=Xa();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch(r){n=!1}if(n)t=e.contentWindow;else break;e=Xa(t.document)}return e}function Id(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function pT(t){var e=Hv(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&qv(n.ownerDocument.documentElement,n)){if(r!==null&&Id(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=Tm(n,s);var o=Tm(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var mT=Sn&&"documentMode"in document&&11>=document.documentMode,pi=null,Zc=null,Bs=null,eh=!1;function Sm(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;eh||pi==null||pi!==Xa(r)||(r=pi,"selectionStart"in r&&Id(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Bs&&ao(Bs,r)||(Bs=r,r=sl(Zc,"onSelect"),0<r.length&&(e=new _d("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=pi)))}function ga(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var mi={animationend:ga("Animation","AnimationEnd"),animationiteration:ga("Animation","AnimationIteration"),animationstart:ga("Animation","AnimationStart"),transitionend:ga("Transition","TransitionEnd")},tc={},Wv={};Sn&&(Wv=document.createElement("div").style,"AnimationEvent"in window||(delete mi.animationend.animation,delete mi.animationiteration.animation,delete mi.animationstart.animation),"TransitionEvent"in window||delete mi.transitionend.transition);function Bl(t){if(tc[t])return tc[t];if(!mi[t])return t;var e=mi[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Wv)return tc[t]=e[n];return t}var Kv=Bl("animationend"),Gv=Bl("animationiteration"),Qv=Bl("animationstart"),Yv=Bl("transitionend"),Jv=new Map,km="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function vr(t,e){Jv.set(t,e),Jr(e,[t])}for(var nc=0;nc<km.length;nc++){var rc=km[nc],gT=rc.toLowerCase(),yT=rc[0].toUpperCase()+rc.slice(1);vr(gT,"on"+yT)}vr(Kv,"onAnimationEnd");vr(Gv,"onAnimationIteration");vr(Qv,"onAnimationStart");vr("dblclick","onDoubleClick");vr("focusin","onFocus");vr("focusout","onBlur");vr(Yv,"onTransitionEnd");bi("onMouseEnter",["mouseout","mouseover"]);bi("onMouseLeave",["mouseout","mouseover"]);bi("onPointerEnter",["pointerout","pointerover"]);bi("onPointerLeave",["pointerout","pointerover"]);Jr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Jr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Jr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Jr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Jr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Jr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ls="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),vT=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ls));function Cm(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,gI(r,e,void 0,t),t.currentTarget=null}function Xv(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,h=l.currentTarget;if(l=l.listener,u!==s&&i.isPropagationStopped())break e;Cm(i,l,h),s=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,h=l.currentTarget,l=l.listener,u!==s&&i.isPropagationStopped())break e;Cm(i,l,h),s=u}}}if(el)throw t=Qc,el=!1,Qc=null,t}function he(t,e){var n=e[sh];n===void 0&&(n=e[sh]=new Set);var r=t+"__bubble";n.has(r)||(Zv(e,t,2,!1),n.add(r))}function ic(t,e,n){var r=0;e&&(r|=4),Zv(n,t,r,e)}var ya="_reactListening"+Math.random().toString(36).slice(2);function lo(t){if(!t[ya]){t[ya]=!0,ov.forEach(function(n){n!=="selectionchange"&&(vT.has(n)||ic(n,!1,t),ic(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[ya]||(e[ya]=!0,ic("selectionchange",!1,e))}}function Zv(t,e,n,r){switch(bv(e)){case 1:var i=DI;break;case 4:i=LI;break;default:i=yd}n=i.bind(null,e,n,t),i=void 0,!Gc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function sc(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;l!==null;){if(o=xr(l),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}l=l.parentNode}}r=r.return}Iv(function(){var h=s,d=fd(n),p=[];e:{var g=Jv.get(t);if(g!==void 0){var S=_d,A=t;switch(t){case"keypress":if(Oa(n)===0)break e;case"keydown":case"keyup":S=GI;break;case"focusin":A="focus",S=Xu;break;case"focusout":A="blur",S=Xu;break;case"beforeblur":case"afterblur":S=Xu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":S=pm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":S=bI;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":S=JI;break;case Kv:case Gv:case Qv:S=jI;break;case Yv:S=ZI;break;case"scroll":S=OI;break;case"wheel":S=tT;break;case"copy":case"cut":case"paste":S=$I;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":S=gm}var N=(e&4)!==0,L=!N&&t==="scroll",I=N?g!==null?g+"Capture":null:g;N=[];for(var w=h,k;w!==null;){k=w;var P=k.stateNode;if(k.tag===5&&P!==null&&(k=P,I!==null&&(P=no(w,I),P!=null&&N.push(uo(w,P,k)))),L)break;w=w.return}0<N.length&&(g=new S(g,A,null,n,d),p.push({event:g,listeners:N}))}}if(!(e&7)){e:{if(g=t==="mouseover"||t==="pointerover",S=t==="mouseout"||t==="pointerout",g&&n!==Wc&&(A=n.relatedTarget||n.fromElement)&&(xr(A)||A[kn]))break e;if((S||g)&&(g=d.window===d?d:(g=d.ownerDocument)?g.defaultView||g.parentWindow:window,S?(A=n.relatedTarget||n.toElement,S=h,A=A?xr(A):null,A!==null&&(L=Xr(A),A!==L||A.tag!==5&&A.tag!==6)&&(A=null)):(S=null,A=h),S!==A)){if(N=pm,P="onMouseLeave",I="onMouseEnter",w="mouse",(t==="pointerout"||t==="pointerover")&&(N=gm,P="onPointerLeave",I="onPointerEnter",w="pointer"),L=S==null?g:gi(S),k=A==null?g:gi(A),g=new N(P,w+"leave",S,n,d),g.target=L,g.relatedTarget=k,P=null,xr(d)===h&&(N=new N(I,w+"enter",A,n,d),N.target=k,N.relatedTarget=L,P=N),L=P,S&&A)t:{for(N=S,I=A,w=0,k=N;k;k=ai(k))w++;for(k=0,P=I;P;P=ai(P))k++;for(;0<w-k;)N=ai(N),w--;for(;0<k-w;)I=ai(I),k--;for(;w--;){if(N===I||I!==null&&N===I.alternate)break t;N=ai(N),I=ai(I)}N=null}else N=null;S!==null&&Am(p,g,S,N,!1),A!==null&&L!==null&&Am(p,L,A,N,!0)}}e:{if(g=h?gi(h):window,S=g.nodeName&&g.nodeName.toLowerCase(),S==="select"||S==="input"&&g.type==="file")var V=lT;else if(_m(g))if(Bv)V=dT;else{V=cT;var F=uT}else(S=g.nodeName)&&S.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(V=hT);if(V&&(V=V(t,h))){$v(p,V,n,d);break e}F&&F(t,g,h),t==="focusout"&&(F=g._wrapperState)&&F.controlled&&g.type==="number"&&$c(g,"number",g.value)}switch(F=h?gi(h):window,t){case"focusin":(_m(F)||F.contentEditable==="true")&&(pi=F,Zc=h,Bs=null);break;case"focusout":Bs=Zc=pi=null;break;case"mousedown":eh=!0;break;case"contextmenu":case"mouseup":case"dragend":eh=!1,Sm(p,n,d);break;case"selectionchange":if(mT)break;case"keydown":case"keyup":Sm(p,n,d)}var E;if(Ed)e:{switch(t){case"compositionstart":var v="onCompositionStart";break e;case"compositionend":v="onCompositionEnd";break e;case"compositionupdate":v="onCompositionUpdate";break e}v=void 0}else fi?jv(t,n)&&(v="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(v="onCompositionStart");v&&(Fv&&n.locale!=="ko"&&(fi||v!=="onCompositionStart"?v==="onCompositionEnd"&&fi&&(E=Mv()):(Kn=d,vd="value"in Kn?Kn.value:Kn.textContent,fi=!0)),F=sl(h,v),0<F.length&&(v=new mm(v,t,null,n,d),p.push({event:v,listeners:F}),E?v.data=E:(E=Uv(n),E!==null&&(v.data=E)))),(E=rT?iT(t,n):sT(t,n))&&(h=sl(h,"onBeforeInput"),0<h.length&&(d=new mm("onBeforeInput","beforeinput",null,n,d),p.push({event:d,listeners:h}),d.data=E))}Xv(p,e)})}function uo(t,e,n){return{instance:t,listener:e,currentTarget:n}}function sl(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=no(t,n),s!=null&&r.unshift(uo(t,s,i)),s=no(t,e),s!=null&&r.push(uo(t,s,i))),t=t.return}return r}function ai(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Am(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,h=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&h!==null&&(l=h,i?(u=no(n,s),u!=null&&o.unshift(uo(n,u,l))):i||(u=no(n,s),u!=null&&o.push(uo(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var _T=/\r\n?/g,wT=/\u0000|\uFFFD/g;function Rm(t){return(typeof t=="string"?t:""+t).replace(_T,`
`).replace(wT,"")}function va(t,e,n){if(e=Rm(e),Rm(t)!==e&&n)throw Error(j(425))}function ol(){}var th=null,nh=null;function rh(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var ih=typeof setTimeout=="function"?setTimeout:void 0,ET=typeof clearTimeout=="function"?clearTimeout:void 0,Pm=typeof Promise=="function"?Promise:void 0,IT=typeof queueMicrotask=="function"?queueMicrotask:typeof Pm!="undefined"?function(t){return Pm.resolve(null).then(t).catch(TT)}:ih;function TT(t){setTimeout(function(){throw t})}function oc(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),so(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);so(e)}function tr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function xm(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Xi=Math.random().toString(36).slice(2),Jt="__reactFiber$"+Xi,co="__reactProps$"+Xi,kn="__reactContainer$"+Xi,sh="__reactEvents$"+Xi,ST="__reactListeners$"+Xi,kT="__reactHandles$"+Xi;function xr(t){var e=t[Jt];if(e)return e;for(var n=t.parentNode;n;){if(e=n[kn]||n[Jt]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=xm(t);t!==null;){if(n=t[Jt])return n;t=xm(t)}return e}t=n,n=t.parentNode}return null}function Do(t){return t=t[Jt]||t[kn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function gi(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(j(33))}function zl(t){return t[co]||null}var oh=[],yi=-1;function _r(t){return{current:t}}function fe(t){0>yi||(t.current=oh[yi],oh[yi]=null,yi--)}function ue(t,e){yi++,oh[yi]=t.current,t.current=e}var fr={},et=_r(fr),ft=_r(!1),$r=fr;function Mi(t,e){var n=t.type.contextTypes;if(!n)return fr;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function pt(t){return t=t.childContextTypes,t!=null}function al(){fe(ft),fe(et)}function Nm(t,e,n){if(et.current!==fr)throw Error(j(168));ue(et,e),ue(ft,n)}function e0(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(j(108,uI(t)||"Unknown",i));return ve({},n,r)}function ll(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||fr,$r=et.current,ue(et,t),ue(ft,ft.current),!0}function Dm(t,e,n){var r=t.stateNode;if(!r)throw Error(j(169));n?(t=e0(t,e,$r),r.__reactInternalMemoizedMergedChildContext=t,fe(ft),fe(et),ue(et,t)):fe(ft),ue(ft,n)}var gn=null,ql=!1,ac=!1;function t0(t){gn===null?gn=[t]:gn.push(t)}function CT(t){ql=!0,t0(t)}function wr(){if(!ac&&gn!==null){ac=!0;var t=0,e=oe;try{var n=gn;for(oe=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}gn=null,ql=!1}catch(i){throw gn!==null&&(gn=gn.slice(t+1)),Cv(pd,wr),i}finally{oe=e,ac=!1}}return null}var vi=[],_i=0,ul=null,cl=0,Pt=[],xt=0,Br=null,yn=1,vn="";function Ar(t,e){vi[_i++]=cl,vi[_i++]=ul,ul=t,cl=e}function n0(t,e,n){Pt[xt++]=yn,Pt[xt++]=vn,Pt[xt++]=Br,Br=t;var r=yn;t=vn;var i=32-zt(r)-1;r&=~(1<<i),n+=1;var s=32-zt(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,yn=1<<32-zt(e)+i|n<<i|r,vn=s+t}else yn=1<<s|n<<i|r,vn=t}function Td(t){t.return!==null&&(Ar(t,1),n0(t,1,0))}function Sd(t){for(;t===ul;)ul=vi[--_i],vi[_i]=null,cl=vi[--_i],vi[_i]=null;for(;t===Br;)Br=Pt[--xt],Pt[xt]=null,vn=Pt[--xt],Pt[xt]=null,yn=Pt[--xt],Pt[xt]=null}var Et=null,_t=null,pe=!1,Bt=null;function r0(t,e){var n=Dt(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Lm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Et=t,_t=tr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Et=t,_t=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Br!==null?{id:yn,overflow:vn}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Dt(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Et=t,_t=null,!0):!1;default:return!1}}function ah(t){return(t.mode&1)!==0&&(t.flags&128)===0}function lh(t){if(pe){var e=_t;if(e){var n=e;if(!Lm(t,e)){if(ah(t))throw Error(j(418));e=tr(n.nextSibling);var r=Et;e&&Lm(t,e)?r0(r,n):(t.flags=t.flags&-4097|2,pe=!1,Et=t)}}else{if(ah(t))throw Error(j(418));t.flags=t.flags&-4097|2,pe=!1,Et=t}}}function Om(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Et=t}function _a(t){if(t!==Et)return!1;if(!pe)return Om(t),pe=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!rh(t.type,t.memoizedProps)),e&&(e=_t)){if(ah(t))throw i0(),Error(j(418));for(;e;)r0(t,e),e=tr(e.nextSibling)}if(Om(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(j(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){_t=tr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}_t=null}}else _t=Et?tr(t.stateNode.nextSibling):null;return!0}function i0(){for(var t=_t;t;)t=tr(t.nextSibling)}function Fi(){_t=Et=null,pe=!1}function kd(t){Bt===null?Bt=[t]:Bt.push(t)}var AT=Ln.ReactCurrentBatchConfig;function Cs(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(j(309));var r=n.stateNode}if(!r)throw Error(j(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=i.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(j(284));if(!n._owner)throw Error(j(290,t))}return t}function wa(t,e){throw t=Object.prototype.toString.call(e),Error(j(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Vm(t){var e=t._init;return e(t._payload)}function s0(t){function e(I,w){if(t){var k=I.deletions;k===null?(I.deletions=[w],I.flags|=16):k.push(w)}}function n(I,w){if(!t)return null;for(;w!==null;)e(I,w),w=w.sibling;return null}function r(I,w){for(I=new Map;w!==null;)w.key!==null?I.set(w.key,w):I.set(w.index,w),w=w.sibling;return I}function i(I,w){return I=sr(I,w),I.index=0,I.sibling=null,I}function s(I,w,k){return I.index=k,t?(k=I.alternate,k!==null?(k=k.index,k<w?(I.flags|=2,w):k):(I.flags|=2,w)):(I.flags|=1048576,w)}function o(I){return t&&I.alternate===null&&(I.flags|=2),I}function l(I,w,k,P){return w===null||w.tag!==6?(w=pc(k,I.mode,P),w.return=I,w):(w=i(w,k),w.return=I,w)}function u(I,w,k,P){var V=k.type;return V===di?d(I,w,k.props.children,P,k.key):w!==null&&(w.elementType===V||typeof V=="object"&&V!==null&&V.$$typeof===jn&&Vm(V)===w.type)?(P=i(w,k.props),P.ref=Cs(I,w,k),P.return=I,P):(P=$a(k.type,k.key,k.props,null,I.mode,P),P.ref=Cs(I,w,k),P.return=I,P)}function h(I,w,k,P){return w===null||w.tag!==4||w.stateNode.containerInfo!==k.containerInfo||w.stateNode.implementation!==k.implementation?(w=mc(k,I.mode,P),w.return=I,w):(w=i(w,k.children||[]),w.return=I,w)}function d(I,w,k,P,V){return w===null||w.tag!==7?(w=Fr(k,I.mode,P,V),w.return=I,w):(w=i(w,k),w.return=I,w)}function p(I,w,k){if(typeof w=="string"&&w!==""||typeof w=="number")return w=pc(""+w,I.mode,k),w.return=I,w;if(typeof w=="object"&&w!==null){switch(w.$$typeof){case ua:return k=$a(w.type,w.key,w.props,null,I.mode,k),k.ref=Cs(I,null,w),k.return=I,k;case hi:return w=mc(w,I.mode,k),w.return=I,w;case jn:var P=w._init;return p(I,P(w._payload),k)}if(Ns(w)||Es(w))return w=Fr(w,I.mode,k,null),w.return=I,w;wa(I,w)}return null}function g(I,w,k,P){var V=w!==null?w.key:null;if(typeof k=="string"&&k!==""||typeof k=="number")return V!==null?null:l(I,w,""+k,P);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case ua:return k.key===V?u(I,w,k,P):null;case hi:return k.key===V?h(I,w,k,P):null;case jn:return V=k._init,g(I,w,V(k._payload),P)}if(Ns(k)||Es(k))return V!==null?null:d(I,w,k,P,null);wa(I,k)}return null}function S(I,w,k,P,V){if(typeof P=="string"&&P!==""||typeof P=="number")return I=I.get(k)||null,l(w,I,""+P,V);if(typeof P=="object"&&P!==null){switch(P.$$typeof){case ua:return I=I.get(P.key===null?k:P.key)||null,u(w,I,P,V);case hi:return I=I.get(P.key===null?k:P.key)||null,h(w,I,P,V);case jn:var F=P._init;return S(I,w,k,F(P._payload),V)}if(Ns(P)||Es(P))return I=I.get(k)||null,d(w,I,P,V,null);wa(w,P)}return null}function A(I,w,k,P){for(var V=null,F=null,E=w,v=w=0,_=null;E!==null&&v<k.length;v++){E.index>v?(_=E,E=null):_=E.sibling;var T=g(I,E,k[v],P);if(T===null){E===null&&(E=_);break}t&&E&&T.alternate===null&&e(I,E),w=s(T,w,v),F===null?V=T:F.sibling=T,F=T,E=_}if(v===k.length)return n(I,E),pe&&Ar(I,v),V;if(E===null){for(;v<k.length;v++)E=p(I,k[v],P),E!==null&&(w=s(E,w,v),F===null?V=E:F.sibling=E,F=E);return pe&&Ar(I,v),V}for(E=r(I,E);v<k.length;v++)_=S(E,I,v,k[v],P),_!==null&&(t&&_.alternate!==null&&E.delete(_.key===null?v:_.key),w=s(_,w,v),F===null?V=_:F.sibling=_,F=_);return t&&E.forEach(function(R){return e(I,R)}),pe&&Ar(I,v),V}function N(I,w,k,P){var V=Es(k);if(typeof V!="function")throw Error(j(150));if(k=V.call(k),k==null)throw Error(j(151));for(var F=V=null,E=w,v=w=0,_=null,T=k.next();E!==null&&!T.done;v++,T=k.next()){E.index>v?(_=E,E=null):_=E.sibling;var R=g(I,E,T.value,P);if(R===null){E===null&&(E=_);break}t&&E&&R.alternate===null&&e(I,E),w=s(R,w,v),F===null?V=R:F.sibling=R,F=R,E=_}if(T.done)return n(I,E),pe&&Ar(I,v),V;if(E===null){for(;!T.done;v++,T=k.next())T=p(I,T.value,P),T!==null&&(w=s(T,w,v),F===null?V=T:F.sibling=T,F=T);return pe&&Ar(I,v),V}for(E=r(I,E);!T.done;v++,T=k.next())T=S(E,I,v,T.value,P),T!==null&&(t&&T.alternate!==null&&E.delete(T.key===null?v:T.key),w=s(T,w,v),F===null?V=T:F.sibling=T,F=T);return t&&E.forEach(function(D){return e(I,D)}),pe&&Ar(I,v),V}function L(I,w,k,P){if(typeof k=="object"&&k!==null&&k.type===di&&k.key===null&&(k=k.props.children),typeof k=="object"&&k!==null){switch(k.$$typeof){case ua:e:{for(var V=k.key,F=w;F!==null;){if(F.key===V){if(V=k.type,V===di){if(F.tag===7){n(I,F.sibling),w=i(F,k.props.children),w.return=I,I=w;break e}}else if(F.elementType===V||typeof V=="object"&&V!==null&&V.$$typeof===jn&&Vm(V)===F.type){n(I,F.sibling),w=i(F,k.props),w.ref=Cs(I,F,k),w.return=I,I=w;break e}n(I,F);break}else e(I,F);F=F.sibling}k.type===di?(w=Fr(k.props.children,I.mode,P,k.key),w.return=I,I=w):(P=$a(k.type,k.key,k.props,null,I.mode,P),P.ref=Cs(I,w,k),P.return=I,I=P)}return o(I);case hi:e:{for(F=k.key;w!==null;){if(w.key===F)if(w.tag===4&&w.stateNode.containerInfo===k.containerInfo&&w.stateNode.implementation===k.implementation){n(I,w.sibling),w=i(w,k.children||[]),w.return=I,I=w;break e}else{n(I,w);break}else e(I,w);w=w.sibling}w=mc(k,I.mode,P),w.return=I,I=w}return o(I);case jn:return F=k._init,L(I,w,F(k._payload),P)}if(Ns(k))return A(I,w,k,P);if(Es(k))return N(I,w,k,P);wa(I,k)}return typeof k=="string"&&k!==""||typeof k=="number"?(k=""+k,w!==null&&w.tag===6?(n(I,w.sibling),w=i(w,k),w.return=I,I=w):(n(I,w),w=pc(k,I.mode,P),w.return=I,I=w),o(I)):n(I,w)}return L}var ji=s0(!0),o0=s0(!1),hl=_r(null),dl=null,wi=null,Cd=null;function Ad(){Cd=wi=dl=null}function Rd(t){var e=hl.current;fe(hl),t._currentValue=e}function uh(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Pi(t,e){dl=t,Cd=wi=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(dt=!0),t.firstContext=null)}function Vt(t){var e=t._currentValue;if(Cd!==t)if(t={context:t,memoizedValue:e,next:null},wi===null){if(dl===null)throw Error(j(308));wi=t,dl.dependencies={lanes:0,firstContext:t}}else wi=wi.next=t;return e}var Nr=null;function Pd(t){Nr===null?Nr=[t]:Nr.push(t)}function a0(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Pd(e)):(n.next=i.next,i.next=n),e.interleaved=n,Cn(t,r)}function Cn(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Un=!1;function xd(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function l0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Tn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function nr(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,re&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,Cn(t,n)}return i=r.interleaved,i===null?(e.next=e,Pd(r)):(e.next=i.next,i.next=e),r.interleaved=e,Cn(t,n)}function Va(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,md(t,n)}}function bm(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function fl(t,e,n,r){var i=t.updateQueue;Un=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var u=l,h=u.next;u.next=null,o===null?s=h:o.next=h,o=u;var d=t.alternate;d!==null&&(d=d.updateQueue,l=d.lastBaseUpdate,l!==o&&(l===null?d.firstBaseUpdate=h:l.next=h,d.lastBaseUpdate=u))}if(s!==null){var p=i.baseState;o=0,d=h=u=null,l=s;do{var g=l.lane,S=l.eventTime;if((r&g)===g){d!==null&&(d=d.next={eventTime:S,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var A=t,N=l;switch(g=e,S=n,N.tag){case 1:if(A=N.payload,typeof A=="function"){p=A.call(S,p,g);break e}p=A;break e;case 3:A.flags=A.flags&-65537|128;case 0:if(A=N.payload,g=typeof A=="function"?A.call(S,p,g):A,g==null)break e;p=ve({},p,g);break e;case 2:Un=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,g=i.effects,g===null?i.effects=[l]:g.push(l))}else S={eventTime:S,lane:g,tag:l.tag,payload:l.payload,callback:l.callback,next:null},d===null?(h=d=S,u=p):d=d.next=S,o|=g;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;g=l,l=g.next,g.next=null,i.lastBaseUpdate=g,i.shared.pending=null}}while(!0);if(d===null&&(u=p),i.baseState=u,i.firstBaseUpdate=h,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);qr|=o,t.lanes=o,t.memoizedState=p}}function Mm(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(j(191,i));i.call(r)}}}var Lo={},en=_r(Lo),ho=_r(Lo),fo=_r(Lo);function Dr(t){if(t===Lo)throw Error(j(174));return t}function Nd(t,e){switch(ue(fo,e),ue(ho,t),ue(en,Lo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:zc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=zc(e,t)}fe(en),ue(en,e)}function Ui(){fe(en),fe(ho),fe(fo)}function u0(t){Dr(fo.current);var e=Dr(en.current),n=zc(e,t.type);e!==n&&(ue(ho,t),ue(en,n))}function Dd(t){ho.current===t&&(fe(en),fe(ho))}var ge=_r(0);function pl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var lc=[];function Ld(){for(var t=0;t<lc.length;t++)lc[t]._workInProgressVersionPrimary=null;lc.length=0}var ba=Ln.ReactCurrentDispatcher,uc=Ln.ReactCurrentBatchConfig,zr=0,ye=null,xe=null,Le=null,ml=!1,zs=!1,po=0,RT=0;function Ke(){throw Error(j(321))}function Od(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Ht(t[n],e[n]))return!1;return!0}function Vd(t,e,n,r,i,s){if(zr=s,ye=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,ba.current=t===null||t.memoizedState===null?DT:LT,t=n(r,i),zs){s=0;do{if(zs=!1,po=0,25<=s)throw Error(j(301));s+=1,Le=xe=null,e.updateQueue=null,ba.current=OT,t=n(r,i)}while(zs)}if(ba.current=gl,e=xe!==null&&xe.next!==null,zr=0,Le=xe=ye=null,ml=!1,e)throw Error(j(300));return t}function bd(){var t=po!==0;return po=0,t}function Yt(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Le===null?ye.memoizedState=Le=t:Le=Le.next=t,Le}function bt(){if(xe===null){var t=ye.alternate;t=t!==null?t.memoizedState:null}else t=xe.next;var e=Le===null?ye.memoizedState:Le.next;if(e!==null)Le=e,xe=t;else{if(t===null)throw Error(j(310));xe=t,t={memoizedState:xe.memoizedState,baseState:xe.baseState,baseQueue:xe.baseQueue,queue:xe.queue,next:null},Le===null?ye.memoizedState=Le=t:Le=Le.next=t}return Le}function mo(t,e){return typeof e=="function"?e(t):e}function cc(t){var e=bt(),n=e.queue;if(n===null)throw Error(j(311));n.lastRenderedReducer=t;var r=xe,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var l=o=null,u=null,h=s;do{var d=h.lane;if((zr&d)===d)u!==null&&(u=u.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),r=h.hasEagerState?h.eagerState:t(r,h.action);else{var p={lane:d,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};u===null?(l=u=p,o=r):u=u.next=p,ye.lanes|=d,qr|=d}h=h.next}while(h!==null&&h!==s);u===null?o=r:u.next=l,Ht(r,e.memoizedState)||(dt=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,ye.lanes|=s,qr|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function hc(t){var e=bt(),n=e.queue;if(n===null)throw Error(j(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);Ht(s,e.memoizedState)||(dt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function c0(){}function h0(t,e){var n=ye,r=bt(),i=e(),s=!Ht(r.memoizedState,i);if(s&&(r.memoizedState=i,dt=!0),r=r.queue,Md(p0.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||Le!==null&&Le.memoizedState.tag&1){if(n.flags|=2048,go(9,f0.bind(null,n,r,i,e),void 0,null),Ve===null)throw Error(j(349));zr&30||d0(n,e,i)}return i}function d0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=ye.updateQueue,e===null?(e={lastEffect:null,stores:null},ye.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function f0(t,e,n,r){e.value=n,e.getSnapshot=r,m0(e)&&g0(t)}function p0(t,e,n){return n(function(){m0(e)&&g0(t)})}function m0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Ht(t,n)}catch(r){return!0}}function g0(t){var e=Cn(t,1);e!==null&&qt(e,t,1,-1)}function Fm(t){var e=Yt();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:mo,lastRenderedState:t},e.queue=t,t=t.dispatch=NT.bind(null,ye,t),[e.memoizedState,t]}function go(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=ye.updateQueue,e===null?(e={lastEffect:null,stores:null},ye.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function y0(){return bt().memoizedState}function Ma(t,e,n,r){var i=Yt();ye.flags|=t,i.memoizedState=go(1|e,n,void 0,r===void 0?null:r)}function Hl(t,e,n,r){var i=bt();r=r===void 0?null:r;var s=void 0;if(xe!==null){var o=xe.memoizedState;if(s=o.destroy,r!==null&&Od(r,o.deps)){i.memoizedState=go(e,n,s,r);return}}ye.flags|=t,i.memoizedState=go(1|e,n,s,r)}function jm(t,e){return Ma(8390656,8,t,e)}function Md(t,e){return Hl(2048,8,t,e)}function v0(t,e){return Hl(4,2,t,e)}function _0(t,e){return Hl(4,4,t,e)}function w0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function E0(t,e,n){return n=n!=null?n.concat([t]):null,Hl(4,4,w0.bind(null,e,t),n)}function Fd(){}function I0(t,e){var n=bt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Od(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function T0(t,e){var n=bt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Od(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function S0(t,e,n){return zr&21?(Ht(n,e)||(n=Pv(),ye.lanes|=n,qr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,dt=!0),t.memoizedState=n)}function PT(t,e){var n=oe;oe=n!==0&&4>n?n:4,t(!0);var r=uc.transition;uc.transition={};try{t(!1),e()}finally{oe=n,uc.transition=r}}function k0(){return bt().memoizedState}function xT(t,e,n){var r=ir(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},C0(t))A0(e,n);else if(n=a0(t,e,n,r),n!==null){var i=at();qt(n,t,r,i),R0(n,e,r)}}function NT(t,e,n){var r=ir(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(C0(t))A0(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(i.hasEagerState=!0,i.eagerState=l,Ht(l,o)){var u=e.interleaved;u===null?(i.next=i,Pd(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch(h){}finally{}n=a0(t,e,i,r),n!==null&&(i=at(),qt(n,t,r,i),R0(n,e,r))}}function C0(t){var e=t.alternate;return t===ye||e!==null&&e===ye}function A0(t,e){zs=ml=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function R0(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,md(t,n)}}var gl={readContext:Vt,useCallback:Ke,useContext:Ke,useEffect:Ke,useImperativeHandle:Ke,useInsertionEffect:Ke,useLayoutEffect:Ke,useMemo:Ke,useReducer:Ke,useRef:Ke,useState:Ke,useDebugValue:Ke,useDeferredValue:Ke,useTransition:Ke,useMutableSource:Ke,useSyncExternalStore:Ke,useId:Ke,unstable_isNewReconciler:!1},DT={readContext:Vt,useCallback:function(t,e){return Yt().memoizedState=[t,e===void 0?null:e],t},useContext:Vt,useEffect:jm,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Ma(4194308,4,w0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Ma(4194308,4,t,e)},useInsertionEffect:function(t,e){return Ma(4,2,t,e)},useMemo:function(t,e){var n=Yt();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=Yt();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=xT.bind(null,ye,t),[r.memoizedState,t]},useRef:function(t){var e=Yt();return t={current:t},e.memoizedState=t},useState:Fm,useDebugValue:Fd,useDeferredValue:function(t){return Yt().memoizedState=t},useTransition:function(){var t=Fm(!1),e=t[0];return t=PT.bind(null,t[1]),Yt().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=ye,i=Yt();if(pe){if(n===void 0)throw Error(j(407));n=n()}else{if(n=e(),Ve===null)throw Error(j(349));zr&30||d0(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,jm(p0.bind(null,r,s,t),[t]),r.flags|=2048,go(9,f0.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=Yt(),e=Ve.identifierPrefix;if(pe){var n=vn,r=yn;n=(r&~(1<<32-zt(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=po++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=RT++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},LT={readContext:Vt,useCallback:I0,useContext:Vt,useEffect:Md,useImperativeHandle:E0,useInsertionEffect:v0,useLayoutEffect:_0,useMemo:T0,useReducer:cc,useRef:y0,useState:function(){return cc(mo)},useDebugValue:Fd,useDeferredValue:function(t){var e=bt();return S0(e,xe.memoizedState,t)},useTransition:function(){var t=cc(mo)[0],e=bt().memoizedState;return[t,e]},useMutableSource:c0,useSyncExternalStore:h0,useId:k0,unstable_isNewReconciler:!1},OT={readContext:Vt,useCallback:I0,useContext:Vt,useEffect:Md,useImperativeHandle:E0,useInsertionEffect:v0,useLayoutEffect:_0,useMemo:T0,useReducer:hc,useRef:y0,useState:function(){return hc(mo)},useDebugValue:Fd,useDeferredValue:function(t){var e=bt();return xe===null?e.memoizedState=t:S0(e,xe.memoizedState,t)},useTransition:function(){var t=hc(mo)[0],e=bt().memoizedState;return[t,e]},useMutableSource:c0,useSyncExternalStore:h0,useId:k0,unstable_isNewReconciler:!1};function Ut(t,e){if(t&&t.defaultProps){e=ve({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function ch(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:ve({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Wl={isMounted:function(t){return(t=t._reactInternals)?Xr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=at(),i=ir(t),s=Tn(r,i);s.payload=e,n!=null&&(s.callback=n),e=nr(t,s,i),e!==null&&(qt(e,t,i,r),Va(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=at(),i=ir(t),s=Tn(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=nr(t,s,i),e!==null&&(qt(e,t,i,r),Va(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=at(),r=ir(t),i=Tn(n,r);i.tag=2,e!=null&&(i.callback=e),e=nr(t,i,r),e!==null&&(qt(e,t,r,n),Va(e,t,r))}};function Um(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!ao(n,r)||!ao(i,s):!0}function P0(t,e,n){var r=!1,i=fr,s=e.contextType;return typeof s=="object"&&s!==null?s=Vt(s):(i=pt(e)?$r:et.current,r=e.contextTypes,s=(r=r!=null)?Mi(t,i):fr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Wl,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function $m(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&Wl.enqueueReplaceState(e,e.state,null)}function hh(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},xd(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Vt(s):(s=pt(e)?$r:et.current,i.context=Mi(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(ch(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Wl.enqueueReplaceState(i,i.state,null),fl(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function $i(t,e){try{var n="",r=e;do n+=lI(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function dc(t,e,n){return{value:t,source:null,stack:n!=null?n:null,digest:e!=null?e:null}}function dh(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var VT=typeof WeakMap=="function"?WeakMap:Map;function x0(t,e,n){n=Tn(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){vl||(vl=!0,Ih=r),dh(t,e)},n}function N0(t,e,n){n=Tn(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){dh(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){dh(t,e),typeof r!="function"&&(rr===null?rr=new Set([this]):rr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Bm(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new VT;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=QT.bind(null,t,e,n),e.then(t,t))}function zm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function qm(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Tn(-1,1),e.tag=2,nr(n,e,1))),n.lanes|=1),t)}var bT=Ln.ReactCurrentOwner,dt=!1;function it(t,e,n,r){e.child=t===null?o0(e,null,n,r):ji(e,t.child,n,r)}function Hm(t,e,n,r,i){n=n.render;var s=e.ref;return Pi(e,i),r=Vd(t,e,n,r,s,i),n=bd(),t!==null&&!dt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,An(t,e,i)):(pe&&n&&Td(e),e.flags|=1,it(t,e,r,i),e.child)}function Wm(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!Wd(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,D0(t,e,s,r,i)):(t=$a(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:ao,n(o,r)&&t.ref===e.ref)return An(t,e,i)}return e.flags|=1,t=sr(s,r),t.ref=e.ref,t.return=e,e.child=t}function D0(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(ao(s,r)&&t.ref===e.ref)if(dt=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(dt=!0);else return e.lanes=t.lanes,An(t,e,i)}return fh(t,e,n,r,i)}function L0(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ue(Ii,vt),vt|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ue(Ii,vt),vt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,ue(Ii,vt),vt|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,ue(Ii,vt),vt|=r;return it(t,e,i,n),e.child}function O0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function fh(t,e,n,r,i){var s=pt(n)?$r:et.current;return s=Mi(e,s),Pi(e,i),n=Vd(t,e,n,r,s,i),r=bd(),t!==null&&!dt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,An(t,e,i)):(pe&&r&&Td(e),e.flags|=1,it(t,e,n,i),e.child)}function Km(t,e,n,r,i){if(pt(n)){var s=!0;ll(e)}else s=!1;if(Pi(e,i),e.stateNode===null)Fa(t,e),P0(e,n,r),hh(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,h=n.contextType;typeof h=="object"&&h!==null?h=Vt(h):(h=pt(n)?$r:et.current,h=Mi(e,h));var d=n.getDerivedStateFromProps,p=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";p||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==h)&&$m(e,o,r,h),Un=!1;var g=e.memoizedState;o.state=g,fl(e,r,o,i),u=e.memoizedState,l!==r||g!==u||ft.current||Un?(typeof d=="function"&&(ch(e,n,d,r),u=e.memoizedState),(l=Un||Um(e,n,l,r,g,u,h))?(p||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=h,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,l0(t,e),l=e.memoizedProps,h=e.type===e.elementType?l:Ut(e.type,l),o.props=h,p=e.pendingProps,g=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Vt(u):(u=pt(n)?$r:et.current,u=Mi(e,u));var S=n.getDerivedStateFromProps;(d=typeof S=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==p||g!==u)&&$m(e,o,r,u),Un=!1,g=e.memoizedState,o.state=g,fl(e,r,o,i);var A=e.memoizedState;l!==p||g!==A||ft.current||Un?(typeof S=="function"&&(ch(e,n,S,r),A=e.memoizedState),(h=Un||Um(e,n,h,r,g,A,u)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,A,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,A,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=A),o.props=r,o.state=A,o.context=u,r=h):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),r=!1)}return ph(t,e,n,r,s,i)}function ph(t,e,n,r,i,s){O0(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&Dm(e,n,!1),An(t,e,s);r=e.stateNode,bT.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=ji(e,t.child,null,s),e.child=ji(e,null,l,s)):it(t,e,l,s),e.memoizedState=r.state,i&&Dm(e,n,!0),e.child}function V0(t){var e=t.stateNode;e.pendingContext?Nm(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Nm(t,e.context,!1),Nd(t,e.containerInfo)}function Gm(t,e,n,r,i){return Fi(),kd(i),e.flags|=256,it(t,e,n,r),e.child}var mh={dehydrated:null,treeContext:null,retryLane:0};function gh(t){return{baseLanes:t,cachePool:null,transitions:null}}function b0(t,e,n){var r=e.pendingProps,i=ge.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),ue(ge,i&1),t===null)return lh(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Ql(o,r,0,null),t=Fr(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=gh(n),e.memoizedState=mh,t):jd(e,o));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return MT(t,e,o,r,l,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,l=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=sr(i,u),r.subtreeFlags=i.subtreeFlags&14680064),l!==null?s=sr(l,s):(s=Fr(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?gh(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=mh,r}return s=t.child,t=s.sibling,r=sr(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function jd(t,e){return e=Ql({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Ea(t,e,n,r){return r!==null&&kd(r),ji(e,t.child,null,n),t=jd(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function MT(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=dc(Error(j(422))),Ea(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Ql({mode:"visible",children:r.children},i,0,null),s=Fr(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&ji(e,t.child,null,o),e.child.memoizedState=gh(o),e.memoizedState=mh,s);if(!(e.mode&1))return Ea(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(j(419)),r=dc(s,r,void 0),Ea(t,e,o,r)}if(l=(o&t.childLanes)!==0,dt||l){if(r=Ve,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,Cn(t,i),qt(r,t,i,-1))}return Hd(),r=dc(Error(j(421))),Ea(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=YT.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,_t=tr(i.nextSibling),Et=e,pe=!0,Bt=null,t!==null&&(Pt[xt++]=yn,Pt[xt++]=vn,Pt[xt++]=Br,yn=t.id,vn=t.overflow,Br=e),e=jd(e,r.children),e.flags|=4096,e)}function Qm(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),uh(t.return,e,n)}function fc(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function M0(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(it(t,e,r.children,n),r=ge.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Qm(t,n,e);else if(t.tag===19)Qm(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(ue(ge,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&pl(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),fc(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&pl(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}fc(e,!0,n,null,s);break;case"together":fc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Fa(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function An(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),qr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(j(153));if(e.child!==null){for(t=e.child,n=sr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=sr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function FT(t,e,n){switch(e.tag){case 3:V0(e),Fi();break;case 5:u0(e);break;case 1:pt(e.type)&&ll(e);break;case 4:Nd(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;ue(hl,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(ue(ge,ge.current&1),e.flags|=128,null):n&e.child.childLanes?b0(t,e,n):(ue(ge,ge.current&1),t=An(t,e,n),t!==null?t.sibling:null);ue(ge,ge.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return M0(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),ue(ge,ge.current),r)break;return null;case 22:case 23:return e.lanes=0,L0(t,e,n)}return An(t,e,n)}var F0,yh,j0,U0;F0=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};yh=function(){};j0=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,Dr(en.current);var s=null;switch(n){case"input":i=jc(t,i),r=jc(t,r),s=[];break;case"select":i=ve({},i,{value:void 0}),r=ve({},r,{value:void 0}),s=[];break;case"textarea":i=Bc(t,i),r=Bc(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=ol)}qc(n,r);var o;n=null;for(h in i)if(!r.hasOwnProperty(h)&&i.hasOwnProperty(h)&&i[h]!=null)if(h==="style"){var l=i[h];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(eo.hasOwnProperty(h)?s||(s=[]):(s=s||[]).push(h,null));for(h in r){var u=r[h];if(l=i!=null?i[h]:void 0,r.hasOwnProperty(h)&&u!==l&&(u!=null||l!=null))if(h==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(h,n)),n=u;else h==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(s=s||[]).push(h,u)):h==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(h,""+u):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(eo.hasOwnProperty(h)?(u!=null&&h==="onScroll"&&he("scroll",t),s||l===u||(s=[])):(s=s||[]).push(h,u))}n&&(s=s||[]).push("style",n);var h=s;(e.updateQueue=h)&&(e.flags|=4)}};U0=function(t,e,n,r){n!==r&&(e.flags|=4)};function As(t,e){if(!pe)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function Ge(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function jT(t,e,n){var r=e.pendingProps;switch(Sd(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ge(e),null;case 1:return pt(e.type)&&al(),Ge(e),null;case 3:return r=e.stateNode,Ui(),fe(ft),fe(et),Ld(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(_a(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Bt!==null&&(kh(Bt),Bt=null))),yh(t,e),Ge(e),null;case 5:Dd(e);var i=Dr(fo.current);if(n=e.type,t!==null&&e.stateNode!=null)j0(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(j(166));return Ge(e),null}if(t=Dr(en.current),_a(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[Jt]=e,r[co]=s,t=(e.mode&1)!==0,n){case"dialog":he("cancel",r),he("close",r);break;case"iframe":case"object":case"embed":he("load",r);break;case"video":case"audio":for(i=0;i<Ls.length;i++)he(Ls[i],r);break;case"source":he("error",r);break;case"img":case"image":case"link":he("error",r),he("load",r);break;case"details":he("toggle",r);break;case"input":im(r,s),he("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},he("invalid",r);break;case"textarea":om(r,s),he("invalid",r)}qc(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&va(r.textContent,l,t),i=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&va(r.textContent,l,t),i=["children",""+l]):eo.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&he("scroll",r)}switch(n){case"input":ca(r),sm(r,s,!0);break;case"textarea":ca(r),am(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=ol)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=pv(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[Jt]=e,t[co]=r,F0(t,e,!1,!1),e.stateNode=t;e:{switch(o=Hc(n,r),n){case"dialog":he("cancel",t),he("close",t),i=r;break;case"iframe":case"object":case"embed":he("load",t),i=r;break;case"video":case"audio":for(i=0;i<Ls.length;i++)he(Ls[i],t);i=r;break;case"source":he("error",t),i=r;break;case"img":case"image":case"link":he("error",t),he("load",t),i=r;break;case"details":he("toggle",t),i=r;break;case"input":im(t,r),i=jc(t,r),he("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=ve({},r,{value:void 0}),he("invalid",t);break;case"textarea":om(t,r),i=Bc(t,r),he("invalid",t);break;default:i=r}qc(n,i),l=i;for(s in l)if(l.hasOwnProperty(s)){var u=l[s];s==="style"?yv(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&mv(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&to(t,u):typeof u=="number"&&to(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(eo.hasOwnProperty(s)?u!=null&&s==="onScroll"&&he("scroll",t):u!=null&&ud(t,s,u,o))}switch(n){case"input":ca(t),sm(t,r,!1);break;case"textarea":ca(t),am(t);break;case"option":r.value!=null&&t.setAttribute("value",""+dr(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?ki(t,!!r.multiple,s,!1):r.defaultValue!=null&&ki(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=ol)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Ge(e),null;case 6:if(t&&e.stateNode!=null)U0(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(j(166));if(n=Dr(fo.current),Dr(en.current),_a(e)){if(r=e.stateNode,n=e.memoizedProps,r[Jt]=e,(s=r.nodeValue!==n)&&(t=Et,t!==null))switch(t.tag){case 3:va(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&va(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Jt]=e,e.stateNode=r}return Ge(e),null;case 13:if(fe(ge),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(pe&&_t!==null&&e.mode&1&&!(e.flags&128))i0(),Fi(),e.flags|=98560,s=!1;else if(s=_a(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(j(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(j(317));s[Jt]=e}else Fi(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Ge(e),s=!1}else Bt!==null&&(kh(Bt),Bt=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||ge.current&1?Ne===0&&(Ne=3):Hd())),e.updateQueue!==null&&(e.flags|=4),Ge(e),null);case 4:return Ui(),yh(t,e),t===null&&lo(e.stateNode.containerInfo),Ge(e),null;case 10:return Rd(e.type._context),Ge(e),null;case 17:return pt(e.type)&&al(),Ge(e),null;case 19:if(fe(ge),s=e.memoizedState,s===null)return Ge(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)As(s,!1);else{if(Ne!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=pl(t),o!==null){for(e.flags|=128,As(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ue(ge,ge.current&1|2),e.child}t=t.sibling}s.tail!==null&&Se()>Bi&&(e.flags|=128,r=!0,As(s,!1),e.lanes=4194304)}else{if(!r)if(t=pl(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),As(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!pe)return Ge(e),null}else 2*Se()-s.renderingStartTime>Bi&&n!==1073741824&&(e.flags|=128,r=!0,As(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Se(),e.sibling=null,n=ge.current,ue(ge,r?n&1|2:n&1),e):(Ge(e),null);case 22:case 23:return qd(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?vt&1073741824&&(Ge(e),e.subtreeFlags&6&&(e.flags|=8192)):Ge(e),null;case 24:return null;case 25:return null}throw Error(j(156,e.tag))}function UT(t,e){switch(Sd(e),e.tag){case 1:return pt(e.type)&&al(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ui(),fe(ft),fe(et),Ld(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Dd(e),null;case 13:if(fe(ge),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(j(340));Fi()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return fe(ge),null;case 4:return Ui(),null;case 10:return Rd(e.type._context),null;case 22:case 23:return qd(),null;case 24:return null;default:return null}}var Ia=!1,Je=!1,$T=typeof WeakSet=="function"?WeakSet:Set,z=null;function Ei(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){we(t,e,r)}else n.current=null}function vh(t,e,n){try{n()}catch(r){we(t,e,r)}}var Ym=!1;function BT(t,e){if(th=rl,t=Hv(),Id(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch(P){n=null;break e}var o=0,l=-1,u=-1,h=0,d=0,p=t,g=null;t:for(;;){for(var S;p!==n||i!==0&&p.nodeType!==3||(l=o+i),p!==s||r!==0&&p.nodeType!==3||(u=o+r),p.nodeType===3&&(o+=p.nodeValue.length),(S=p.firstChild)!==null;)g=p,p=S;for(;;){if(p===t)break t;if(g===n&&++h===i&&(l=o),g===s&&++d===r&&(u=o),(S=p.nextSibling)!==null)break;p=g,g=p.parentNode}p=S}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(nh={focusedElem:t,selectionRange:n},rl=!1,z=e;z!==null;)if(e=z,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,z=t;else for(;z!==null;){e=z;try{var A=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(A!==null){var N=A.memoizedProps,L=A.memoizedState,I=e.stateNode,w=I.getSnapshotBeforeUpdate(e.elementType===e.type?N:Ut(e.type,N),L);I.__reactInternalSnapshotBeforeUpdate=w}break;case 3:var k=e.stateNode.containerInfo;k.nodeType===1?k.textContent="":k.nodeType===9&&k.documentElement&&k.removeChild(k.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(j(163))}}catch(P){we(e,e.return,P)}if(t=e.sibling,t!==null){t.return=e.return,z=t;break}z=e.return}return A=Ym,Ym=!1,A}function qs(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&vh(e,n,s)}i=i.next}while(i!==r)}}function Kl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function _h(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function $0(t){var e=t.alternate;e!==null&&(t.alternate=null,$0(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Jt],delete e[co],delete e[sh],delete e[ST],delete e[kT])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function B0(t){return t.tag===5||t.tag===3||t.tag===4}function Jm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||B0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function wh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=ol));else if(r!==4&&(t=t.child,t!==null))for(wh(t,e,n),t=t.sibling;t!==null;)wh(t,e,n),t=t.sibling}function Eh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(Eh(t,e,n),t=t.sibling;t!==null;)Eh(t,e,n),t=t.sibling}var Fe=null,$t=!1;function Mn(t,e,n){for(n=n.child;n!==null;)z0(t,e,n),n=n.sibling}function z0(t,e,n){if(Zt&&typeof Zt.onCommitFiberUnmount=="function")try{Zt.onCommitFiberUnmount(jl,n)}catch(l){}switch(n.tag){case 5:Je||Ei(n,e);case 6:var r=Fe,i=$t;Fe=null,Mn(t,e,n),Fe=r,$t=i,Fe!==null&&($t?(t=Fe,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Fe.removeChild(n.stateNode));break;case 18:Fe!==null&&($t?(t=Fe,n=n.stateNode,t.nodeType===8?oc(t.parentNode,n):t.nodeType===1&&oc(t,n),so(t)):oc(Fe,n.stateNode));break;case 4:r=Fe,i=$t,Fe=n.stateNode.containerInfo,$t=!0,Mn(t,e,n),Fe=r,$t=i;break;case 0:case 11:case 14:case 15:if(!Je&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&vh(n,e,o),i=i.next}while(i!==r)}Mn(t,e,n);break;case 1:if(!Je&&(Ei(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){we(n,e,l)}Mn(t,e,n);break;case 21:Mn(t,e,n);break;case 22:n.mode&1?(Je=(r=Je)||n.memoizedState!==null,Mn(t,e,n),Je=r):Mn(t,e,n);break;default:Mn(t,e,n)}}function Xm(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new $T),e.forEach(function(r){var i=JT.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function Ft(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Fe=l.stateNode,$t=!1;break e;case 3:Fe=l.stateNode.containerInfo,$t=!0;break e;case 4:Fe=l.stateNode.containerInfo,$t=!0;break e}l=l.return}if(Fe===null)throw Error(j(160));z0(s,o,i),Fe=null,$t=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(h){we(i,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)q0(e,t),e=e.sibling}function q0(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Ft(e,t),Qt(t),r&4){try{qs(3,t,t.return),Kl(3,t)}catch(N){we(t,t.return,N)}try{qs(5,t,t.return)}catch(N){we(t,t.return,N)}}break;case 1:Ft(e,t),Qt(t),r&512&&n!==null&&Ei(n,n.return);break;case 5:if(Ft(e,t),Qt(t),r&512&&n!==null&&Ei(n,n.return),t.flags&32){var i=t.stateNode;try{to(i,"")}catch(N){we(t,t.return,N)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&dv(i,s),Hc(l,o);var h=Hc(l,s);for(o=0;o<u.length;o+=2){var d=u[o],p=u[o+1];d==="style"?yv(i,p):d==="dangerouslySetInnerHTML"?mv(i,p):d==="children"?to(i,p):ud(i,d,p,h)}switch(l){case"input":Uc(i,s);break;case"textarea":fv(i,s);break;case"select":var g=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var S=s.value;S!=null?ki(i,!!s.multiple,S,!1):g!==!!s.multiple&&(s.defaultValue!=null?ki(i,!!s.multiple,s.defaultValue,!0):ki(i,!!s.multiple,s.multiple?[]:"",!1))}i[co]=s}catch(N){we(t,t.return,N)}}break;case 6:if(Ft(e,t),Qt(t),r&4){if(t.stateNode===null)throw Error(j(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(N){we(t,t.return,N)}}break;case 3:if(Ft(e,t),Qt(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{so(e.containerInfo)}catch(N){we(t,t.return,N)}break;case 4:Ft(e,t),Qt(t);break;case 13:Ft(e,t),Qt(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(Bd=Se())),r&4&&Xm(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(Je=(h=Je)||d,Ft(e,t),Je=h):Ft(e,t),Qt(t),r&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!d&&t.mode&1)for(z=t,d=t.child;d!==null;){for(p=z=d;z!==null;){switch(g=z,S=g.child,g.tag){case 0:case 11:case 14:case 15:qs(4,g,g.return);break;case 1:Ei(g,g.return);var A=g.stateNode;if(typeof A.componentWillUnmount=="function"){r=g,n=g.return;try{e=r,A.props=e.memoizedProps,A.state=e.memoizedState,A.componentWillUnmount()}catch(N){we(r,n,N)}}break;case 5:Ei(g,g.return);break;case 22:if(g.memoizedState!==null){eg(p);continue}}S!==null?(S.return=g,z=S):eg(p)}d=d.sibling}e:for(d=null,p=t;;){if(p.tag===5){if(d===null){d=p;try{i=p.stateNode,h?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=p.stateNode,u=p.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=gv("display",o))}catch(N){we(t,t.return,N)}}}else if(p.tag===6){if(d===null)try{p.stateNode.nodeValue=h?"":p.memoizedProps}catch(N){we(t,t.return,N)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;d===p&&(d=null),p=p.return}d===p&&(d=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Ft(e,t),Qt(t),r&4&&Xm(t);break;case 21:break;default:Ft(e,t),Qt(t)}}function Qt(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(B0(n)){var r=n;break e}n=n.return}throw Error(j(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(to(i,""),r.flags&=-33);var s=Jm(t);Eh(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,l=Jm(t);wh(t,l,o);break;default:throw Error(j(161))}}catch(u){we(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function zT(t,e,n){z=t,H0(t)}function H0(t,e,n){for(var r=(t.mode&1)!==0;z!==null;){var i=z,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||Ia;if(!o){var l=i.alternate,u=l!==null&&l.memoizedState!==null||Je;l=Ia;var h=Je;if(Ia=o,(Je=u)&&!h)for(z=i;z!==null;)o=z,u=o.child,o.tag===22&&o.memoizedState!==null?tg(i):u!==null?(u.return=o,z=u):tg(i);for(;s!==null;)z=s,H0(s),s=s.sibling;z=i,Ia=l,Je=h}Zm(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,z=s):Zm(t)}}function Zm(t){for(;z!==null;){var e=z;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Je||Kl(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!Je)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:Ut(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Mm(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Mm(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var d=h.memoizedState;if(d!==null){var p=d.dehydrated;p!==null&&so(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(j(163))}Je||e.flags&512&&_h(e)}catch(g){we(e,e.return,g)}}if(e===t){z=null;break}if(n=e.sibling,n!==null){n.return=e.return,z=n;break}z=e.return}}function eg(t){for(;z!==null;){var e=z;if(e===t){z=null;break}var n=e.sibling;if(n!==null){n.return=e.return,z=n;break}z=e.return}}function tg(t){for(;z!==null;){var e=z;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Kl(4,e)}catch(u){we(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){we(e,i,u)}}var s=e.return;try{_h(e)}catch(u){we(e,s,u)}break;case 5:var o=e.return;try{_h(e)}catch(u){we(e,o,u)}}}catch(u){we(e,e.return,u)}if(e===t){z=null;break}var l=e.sibling;if(l!==null){l.return=e.return,z=l;break}z=e.return}}var qT=Math.ceil,yl=Ln.ReactCurrentDispatcher,Ud=Ln.ReactCurrentOwner,Lt=Ln.ReactCurrentBatchConfig,re=0,Ve=null,Re=null,Ue=0,vt=0,Ii=_r(0),Ne=0,yo=null,qr=0,Gl=0,$d=0,Hs=null,ht=null,Bd=0,Bi=1/0,mn=null,vl=!1,Ih=null,rr=null,Ta=!1,Gn=null,_l=0,Ws=0,Th=null,ja=-1,Ua=0;function at(){return re&6?Se():ja!==-1?ja:ja=Se()}function ir(t){return t.mode&1?re&2&&Ue!==0?Ue&-Ue:AT.transition!==null?(Ua===0&&(Ua=Pv()),Ua):(t=oe,t!==0||(t=window.event,t=t===void 0?16:bv(t.type)),t):1}function qt(t,e,n,r){if(50<Ws)throw Ws=0,Th=null,Error(j(185));xo(t,n,r),(!(re&2)||t!==Ve)&&(t===Ve&&(!(re&2)&&(Gl|=n),Ne===4&&Bn(t,Ue)),mt(t,r),n===1&&re===0&&!(e.mode&1)&&(Bi=Se()+500,ql&&wr()))}function mt(t,e){var n=t.callbackNode;AI(t,e);var r=nl(t,t===Ve?Ue:0);if(r===0)n!==null&&cm(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&cm(n),e===1)t.tag===0?CT(ng.bind(null,t)):t0(ng.bind(null,t)),IT(function(){!(re&6)&&wr()}),n=null;else{switch(xv(r)){case 1:n=pd;break;case 4:n=Av;break;case 16:n=tl;break;case 536870912:n=Rv;break;default:n=tl}n=Z0(n,W0.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function W0(t,e){if(ja=-1,Ua=0,re&6)throw Error(j(327));var n=t.callbackNode;if(xi()&&t.callbackNode!==n)return null;var r=nl(t,t===Ve?Ue:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=wl(t,r);else{e=r;var i=re;re|=2;var s=G0();(Ve!==t||Ue!==e)&&(mn=null,Bi=Se()+500,Mr(t,e));do try{KT();break}catch(l){K0(t,l)}while(!0);Ad(),yl.current=s,re=i,Re!==null?e=0:(Ve=null,Ue=0,e=Ne)}if(e!==0){if(e===2&&(i=Yc(t),i!==0&&(r=i,e=Sh(t,i))),e===1)throw n=yo,Mr(t,0),Bn(t,r),mt(t,Se()),n;if(e===6)Bn(t,r);else{if(i=t.current.alternate,!(r&30)&&!HT(i)&&(e=wl(t,r),e===2&&(s=Yc(t),s!==0&&(r=s,e=Sh(t,s))),e===1))throw n=yo,Mr(t,0),Bn(t,r),mt(t,Se()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(j(345));case 2:Rr(t,ht,mn);break;case 3:if(Bn(t,r),(r&130023424)===r&&(e=Bd+500-Se(),10<e)){if(nl(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){at(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=ih(Rr.bind(null,t,ht,mn),e);break}Rr(t,ht,mn);break;case 4:if(Bn(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-zt(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=Se()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*qT(r/1960))-r,10<r){t.timeoutHandle=ih(Rr.bind(null,t,ht,mn),r);break}Rr(t,ht,mn);break;case 5:Rr(t,ht,mn);break;default:throw Error(j(329))}}}return mt(t,Se()),t.callbackNode===n?W0.bind(null,t):null}function Sh(t,e){var n=Hs;return t.current.memoizedState.isDehydrated&&(Mr(t,e).flags|=256),t=wl(t,e),t!==2&&(e=ht,ht=n,e!==null&&kh(e)),t}function kh(t){ht===null?ht=t:ht.push.apply(ht,t)}function HT(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!Ht(s(),i))return!1}catch(o){return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Bn(t,e){for(e&=~$d,e&=~Gl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-zt(e),r=1<<n;t[n]=-1,e&=~r}}function ng(t){if(re&6)throw Error(j(327));xi();var e=nl(t,0);if(!(e&1))return mt(t,Se()),null;var n=wl(t,e);if(t.tag!==0&&n===2){var r=Yc(t);r!==0&&(e=r,n=Sh(t,r))}if(n===1)throw n=yo,Mr(t,0),Bn(t,e),mt(t,Se()),n;if(n===6)throw Error(j(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Rr(t,ht,mn),mt(t,Se()),null}function zd(t,e){var n=re;re|=1;try{return t(e)}finally{re=n,re===0&&(Bi=Se()+500,ql&&wr())}}function Hr(t){Gn!==null&&Gn.tag===0&&!(re&6)&&xi();var e=re;re|=1;var n=Lt.transition,r=oe;try{if(Lt.transition=null,oe=1,t)return t()}finally{oe=r,Lt.transition=n,re=e,!(re&6)&&wr()}}function qd(){vt=Ii.current,fe(Ii)}function Mr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,ET(n)),Re!==null)for(n=Re.return;n!==null;){var r=n;switch(Sd(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&al();break;case 3:Ui(),fe(ft),fe(et),Ld();break;case 5:Dd(r);break;case 4:Ui();break;case 13:fe(ge);break;case 19:fe(ge);break;case 10:Rd(r.type._context);break;case 22:case 23:qd()}n=n.return}if(Ve=t,Re=t=sr(t.current,null),Ue=vt=e,Ne=0,yo=null,$d=Gl=qr=0,ht=Hs=null,Nr!==null){for(e=0;e<Nr.length;e++)if(n=Nr[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}Nr=null}return t}function K0(t,e){do{var n=Re;try{if(Ad(),ba.current=gl,ml){for(var r=ye.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}ml=!1}if(zr=0,Le=xe=ye=null,zs=!1,po=0,Ud.current=null,n===null||n.return===null){Ne=1,yo=e,Re=null;break}e:{var s=t,o=n.return,l=n,u=e;if(e=Ue,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var h=u,d=l,p=d.tag;if(!(d.mode&1)&&(p===0||p===11||p===15)){var g=d.alternate;g?(d.updateQueue=g.updateQueue,d.memoizedState=g.memoizedState,d.lanes=g.lanes):(d.updateQueue=null,d.memoizedState=null)}var S=zm(o);if(S!==null){S.flags&=-257,qm(S,o,l,s,e),S.mode&1&&Bm(s,h,e),e=S,u=h;var A=e.updateQueue;if(A===null){var N=new Set;N.add(u),e.updateQueue=N}else A.add(u);break e}else{if(!(e&1)){Bm(s,h,e),Hd();break e}u=Error(j(426))}}else if(pe&&l.mode&1){var L=zm(o);if(L!==null){!(L.flags&65536)&&(L.flags|=256),qm(L,o,l,s,e),kd($i(u,l));break e}}s=u=$i(u,l),Ne!==4&&(Ne=2),Hs===null?Hs=[s]:Hs.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var I=x0(s,u,e);bm(s,I);break e;case 1:l=u;var w=s.type,k=s.stateNode;if(!(s.flags&128)&&(typeof w.getDerivedStateFromError=="function"||k!==null&&typeof k.componentDidCatch=="function"&&(rr===null||!rr.has(k)))){s.flags|=65536,e&=-e,s.lanes|=e;var P=N0(s,l,e);bm(s,P);break e}}s=s.return}while(s!==null)}Y0(n)}catch(V){e=V,Re===n&&n!==null&&(Re=n=n.return);continue}break}while(!0)}function G0(){var t=yl.current;return yl.current=gl,t===null?gl:t}function Hd(){(Ne===0||Ne===3||Ne===2)&&(Ne=4),Ve===null||!(qr&268435455)&&!(Gl&268435455)||Bn(Ve,Ue)}function wl(t,e){var n=re;re|=2;var r=G0();(Ve!==t||Ue!==e)&&(mn=null,Mr(t,e));do try{WT();break}catch(i){K0(t,i)}while(!0);if(Ad(),re=n,yl.current=r,Re!==null)throw Error(j(261));return Ve=null,Ue=0,Ne}function WT(){for(;Re!==null;)Q0(Re)}function KT(){for(;Re!==null&&!vI();)Q0(Re)}function Q0(t){var e=X0(t.alternate,t,vt);t.memoizedProps=t.pendingProps,e===null?Y0(t):Re=e,Ud.current=null}function Y0(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=UT(n,e),n!==null){n.flags&=32767,Re=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Ne=6,Re=null;return}}else if(n=jT(n,e,vt),n!==null){Re=n;return}if(e=e.sibling,e!==null){Re=e;return}Re=e=t}while(e!==null);Ne===0&&(Ne=5)}function Rr(t,e,n){var r=oe,i=Lt.transition;try{Lt.transition=null,oe=1,GT(t,e,n,r)}finally{Lt.transition=i,oe=r}return null}function GT(t,e,n,r){do xi();while(Gn!==null);if(re&6)throw Error(j(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(j(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(RI(t,s),t===Ve&&(Re=Ve=null,Ue=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Ta||(Ta=!0,Z0(tl,function(){return xi(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Lt.transition,Lt.transition=null;var o=oe;oe=1;var l=re;re|=4,Ud.current=null,BT(t,n),q0(n,t),pT(nh),rl=!!th,nh=th=null,t.current=n,zT(n),_I(),re=l,oe=o,Lt.transition=s}else t.current=n;if(Ta&&(Ta=!1,Gn=t,_l=i),s=t.pendingLanes,s===0&&(rr=null),II(n.stateNode),mt(t,Se()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(vl)throw vl=!1,t=Ih,Ih=null,t;return _l&1&&t.tag!==0&&xi(),s=t.pendingLanes,s&1?t===Th?Ws++:(Ws=0,Th=t):Ws=0,wr(),null}function xi(){if(Gn!==null){var t=xv(_l),e=Lt.transition,n=oe;try{if(Lt.transition=null,oe=16>t?16:t,Gn===null)var r=!1;else{if(t=Gn,Gn=null,_l=0,re&6)throw Error(j(331));var i=re;for(re|=4,z=t.current;z!==null;){var s=z,o=s.child;if(z.flags&16){var l=s.deletions;if(l!==null){for(var u=0;u<l.length;u++){var h=l[u];for(z=h;z!==null;){var d=z;switch(d.tag){case 0:case 11:case 15:qs(8,d,s)}var p=d.child;if(p!==null)p.return=d,z=p;else for(;z!==null;){d=z;var g=d.sibling,S=d.return;if($0(d),d===h){z=null;break}if(g!==null){g.return=S,z=g;break}z=S}}}var A=s.alternate;if(A!==null){var N=A.child;if(N!==null){A.child=null;do{var L=N.sibling;N.sibling=null,N=L}while(N!==null)}}z=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,z=o;else e:for(;z!==null;){if(s=z,s.flags&2048)switch(s.tag){case 0:case 11:case 15:qs(9,s,s.return)}var I=s.sibling;if(I!==null){I.return=s.return,z=I;break e}z=s.return}}var w=t.current;for(z=w;z!==null;){o=z;var k=o.child;if(o.subtreeFlags&2064&&k!==null)k.return=o,z=k;else e:for(o=w;z!==null;){if(l=z,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:Kl(9,l)}}catch(V){we(l,l.return,V)}if(l===o){z=null;break e}var P=l.sibling;if(P!==null){P.return=l.return,z=P;break e}z=l.return}}if(re=i,wr(),Zt&&typeof Zt.onPostCommitFiberRoot=="function")try{Zt.onPostCommitFiberRoot(jl,t)}catch(V){}r=!0}return r}finally{oe=n,Lt.transition=e}}return!1}function rg(t,e,n){e=$i(n,e),e=x0(t,e,1),t=nr(t,e,1),e=at(),t!==null&&(xo(t,1,e),mt(t,e))}function we(t,e,n){if(t.tag===3)rg(t,t,n);else for(;e!==null;){if(e.tag===3){rg(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(rr===null||!rr.has(r))){t=$i(n,t),t=N0(e,t,1),e=nr(e,t,1),t=at(),e!==null&&(xo(e,1,t),mt(e,t));break}}e=e.return}}function QT(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=at(),t.pingedLanes|=t.suspendedLanes&n,Ve===t&&(Ue&n)===n&&(Ne===4||Ne===3&&(Ue&130023424)===Ue&&500>Se()-Bd?Mr(t,0):$d|=n),mt(t,e)}function J0(t,e){e===0&&(t.mode&1?(e=fa,fa<<=1,!(fa&130023424)&&(fa=4194304)):e=1);var n=at();t=Cn(t,e),t!==null&&(xo(t,e,n),mt(t,n))}function YT(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),J0(t,n)}function JT(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(j(314))}r!==null&&r.delete(e),J0(t,n)}var X0;X0=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||ft.current)dt=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return dt=!1,FT(t,e,n);dt=!!(t.flags&131072)}else dt=!1,pe&&e.flags&1048576&&n0(e,cl,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;Fa(t,e),t=e.pendingProps;var i=Mi(e,et.current);Pi(e,n),i=Vd(null,e,r,t,i,n);var s=bd();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,pt(r)?(s=!0,ll(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,xd(e),i.updater=Wl,e.stateNode=i,i._reactInternals=e,hh(e,r,t,n),e=ph(null,e,r,!0,s,n)):(e.tag=0,pe&&s&&Td(e),it(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(Fa(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=ZT(r),t=Ut(r,t),i){case 0:e=fh(null,e,r,t,n);break e;case 1:e=Km(null,e,r,t,n);break e;case 11:e=Hm(null,e,r,t,n);break e;case 14:e=Wm(null,e,r,Ut(r.type,t),n);break e}throw Error(j(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ut(r,i),fh(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ut(r,i),Km(t,e,r,i,n);case 3:e:{if(V0(e),t===null)throw Error(j(387));r=e.pendingProps,s=e.memoizedState,i=s.element,l0(t,e),fl(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=$i(Error(j(423)),e),e=Gm(t,e,r,n,i);break e}else if(r!==i){i=$i(Error(j(424)),e),e=Gm(t,e,r,n,i);break e}else for(_t=tr(e.stateNode.containerInfo.firstChild),Et=e,pe=!0,Bt=null,n=o0(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Fi(),r===i){e=An(t,e,n);break e}it(t,e,r,n)}e=e.child}return e;case 5:return u0(e),t===null&&lh(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,rh(r,i)?o=null:s!==null&&rh(r,s)&&(e.flags|=32),O0(t,e),it(t,e,o,n),e.child;case 6:return t===null&&lh(e),null;case 13:return b0(t,e,n);case 4:return Nd(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=ji(e,null,r,n):it(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ut(r,i),Hm(t,e,r,i,n);case 7:return it(t,e,e.pendingProps,n),e.child;case 8:return it(t,e,e.pendingProps.children,n),e.child;case 12:return it(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,ue(hl,r._currentValue),r._currentValue=o,s!==null)if(Ht(s.value,o)){if(s.children===i.children&&!ft.current){e=An(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=Tn(-1,n&-n),u.tag=2;var h=s.updateQueue;if(h!==null){h=h.shared;var d=h.pending;d===null?u.next=u:(u.next=d.next,d.next=u),h.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),uh(s.return,n,e),l.lanes|=n;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(j(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),uh(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}it(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,Pi(e,n),i=Vt(i),r=r(i),e.flags|=1,it(t,e,r,n),e.child;case 14:return r=e.type,i=Ut(r,e.pendingProps),i=Ut(r.type,i),Wm(t,e,r,i,n);case 15:return D0(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ut(r,i),Fa(t,e),e.tag=1,pt(r)?(t=!0,ll(e)):t=!1,Pi(e,n),P0(e,r,i),hh(e,r,i,n),ph(null,e,r,!0,t,n);case 19:return M0(t,e,n);case 22:return L0(t,e,n)}throw Error(j(156,e.tag))};function Z0(t,e){return Cv(t,e)}function XT(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Dt(t,e,n,r){return new XT(t,e,n,r)}function Wd(t){return t=t.prototype,!(!t||!t.isReactComponent)}function ZT(t){if(typeof t=="function")return Wd(t)?1:0;if(t!=null){if(t=t.$$typeof,t===hd)return 11;if(t===dd)return 14}return 2}function sr(t,e){var n=t.alternate;return n===null?(n=Dt(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function $a(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")Wd(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case di:return Fr(n.children,i,s,e);case cd:o=8,i|=8;break;case Vc:return t=Dt(12,n,e,i|2),t.elementType=Vc,t.lanes=s,t;case bc:return t=Dt(13,n,e,i),t.elementType=bc,t.lanes=s,t;case Mc:return t=Dt(19,n,e,i),t.elementType=Mc,t.lanes=s,t;case uv:return Ql(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case av:o=10;break e;case lv:o=9;break e;case hd:o=11;break e;case dd:o=14;break e;case jn:o=16,r=null;break e}throw Error(j(130,t==null?t:typeof t,""))}return e=Dt(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function Fr(t,e,n,r){return t=Dt(7,t,r,e),t.lanes=n,t}function Ql(t,e,n,r){return t=Dt(22,t,r,e),t.elementType=uv,t.lanes=n,t.stateNode={isHidden:!1},t}function pc(t,e,n){return t=Dt(6,t,null,e),t.lanes=n,t}function mc(t,e,n){return e=Dt(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function e2(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Qu(0),this.expirationTimes=Qu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Qu(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Kd(t,e,n,r,i,s,o,l,u){return t=new e2(t,e,n,l,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Dt(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},xd(s),t}function t2(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:hi,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function e_(t){if(!t)return fr;t=t._reactInternals;e:{if(Xr(t)!==t||t.tag!==1)throw Error(j(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(pt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(j(171))}if(t.tag===1){var n=t.type;if(pt(n))return e0(t,n,e)}return e}function t_(t,e,n,r,i,s,o,l,u){return t=Kd(n,r,!0,t,i,s,o,l,u),t.context=e_(null),n=t.current,r=at(),i=ir(n),s=Tn(r,i),s.callback=e!=null?e:null,nr(n,s,i),t.current.lanes=i,xo(t,i,r),mt(t,r),t}function Yl(t,e,n,r){var i=e.current,s=at(),o=ir(i);return n=e_(n),e.context===null?e.context=n:e.pendingContext=n,e=Tn(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=nr(i,e,o),t!==null&&(qt(t,i,o,s),Va(t,i,o)),o}function El(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function ig(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Gd(t,e){ig(t,e),(t=t.alternate)&&ig(t,e)}function n2(){return null}var n_=typeof reportError=="function"?reportError:function(t){console.error(t)};function Qd(t){this._internalRoot=t}Jl.prototype.render=Qd.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(j(409));Yl(t,e,null,null)};Jl.prototype.unmount=Qd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Hr(function(){Yl(null,t,null,null)}),e[kn]=null}};function Jl(t){this._internalRoot=t}Jl.prototype.unstable_scheduleHydration=function(t){if(t){var e=Lv();t={blockedOn:null,target:t,priority:e};for(var n=0;n<$n.length&&e!==0&&e<$n[n].priority;n++);$n.splice(n,0,t),n===0&&Vv(t)}};function Yd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Xl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function sg(){}function r2(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var h=El(o);s.call(h)}}var o=t_(e,r,t,0,null,!1,!1,"",sg);return t._reactRootContainer=o,t[kn]=o.current,lo(t.nodeType===8?t.parentNode:t),Hr(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var l=r;r=function(){var h=El(u);l.call(h)}}var u=Kd(t,0,!1,null,null,!1,!1,"",sg);return t._reactRootContainer=u,t[kn]=u.current,lo(t.nodeType===8?t.parentNode:t),Hr(function(){Yl(e,u,n,r)}),u}function Zl(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var l=i;i=function(){var u=El(o);l.call(u)}}Yl(e,o,t,i)}else o=r2(n,e,t,i,r);return El(o)}Nv=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ds(e.pendingLanes);n!==0&&(md(e,n|1),mt(e,Se()),!(re&6)&&(Bi=Se()+500,wr()))}break;case 13:Hr(function(){var r=Cn(t,1);if(r!==null){var i=at();qt(r,t,1,i)}}),Gd(t,1)}};gd=function(t){if(t.tag===13){var e=Cn(t,134217728);if(e!==null){var n=at();qt(e,t,134217728,n)}Gd(t,134217728)}};Dv=function(t){if(t.tag===13){var e=ir(t),n=Cn(t,e);if(n!==null){var r=at();qt(n,t,e,r)}Gd(t,e)}};Lv=function(){return oe};Ov=function(t,e){var n=oe;try{return oe=t,e()}finally{oe=n}};Kc=function(t,e,n){switch(e){case"input":if(Uc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=zl(r);if(!i)throw Error(j(90));hv(r),Uc(r,i)}}}break;case"textarea":fv(t,n);break;case"select":e=n.value,e!=null&&ki(t,!!n.multiple,e,!1)}};wv=zd;Ev=Hr;var i2={usingClientEntryPoint:!1,Events:[Do,gi,zl,vv,_v,zd]},Rs={findFiberByHostInstance:xr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},s2={bundleType:Rs.bundleType,version:Rs.version,rendererPackageName:Rs.rendererPackageName,rendererConfig:Rs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ln.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Sv(t),t===null?null:t.stateNode},findFiberByHostInstance:Rs.findFiberByHostInstance||n2,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__!="undefined"){var Sa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Sa.isDisabled&&Sa.supportsFiber)try{jl=Sa.inject(s2),Zt=Sa}catch(t){}}kt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=i2;kt.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Yd(e))throw Error(j(200));return t2(t,e,null,n)};kt.createRoot=function(t,e){if(!Yd(t))throw Error(j(299));var n=!1,r="",i=n_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=Kd(t,1,!1,null,null,n,!1,r,i),t[kn]=e.current,lo(t.nodeType===8?t.parentNode:t),new Qd(e)};kt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(j(188)):(t=Object.keys(t).join(","),Error(j(268,t)));return t=Sv(e),t=t===null?null:t.stateNode,t};kt.flushSync=function(t){return Hr(t)};kt.hydrate=function(t,e,n){if(!Xl(e))throw Error(j(200));return Zl(null,t,e,!0,n)};kt.hydrateRoot=function(t,e,n){if(!Yd(t))throw Error(j(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=n_;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=t_(e,null,t,1,n!=null?n:null,i,!1,s,o),t[kn]=e.current,lo(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new Jl(e)};kt.render=function(t,e,n){if(!Xl(e))throw Error(j(200));return Zl(null,t,e,!1,n)};kt.unmountComponentAtNode=function(t){if(!Xl(t))throw Error(j(40));return t._reactRootContainer?(Hr(function(){Zl(null,null,t,!1,function(){t._reactRootContainer=null,t[kn]=null})}),!0):!1};kt.unstable_batchedUpdates=zd;kt.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!Xl(n))throw Error(j(200));if(t==null||t._reactInternals===void 0)throw Error(j(38));return Zl(t,e,n,!1,r)};kt.version="18.3.1-next-f1338f8080-20240426";function r_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__=="undefined"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r_)}catch(t){console.error(t)}}r_(),rv.exports=kt;var o2=rv.exports,i_,og=o2;i_=og.createRoot,og.hydrateRoot;/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function vo(){return vo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},vo.apply(this,arguments)}var Qn;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(Qn||(Qn={}));const ag="popstate";function a2(t){t===void 0&&(t={});function e(r,i){let{pathname:s,search:o,hash:l}=r.location;return Ch("",{pathname:s,search:o,hash:l},i.state&&i.state.usr||null,i.state&&i.state.key||"default")}function n(r,i){return typeof i=="string"?i:Il(i)}return u2(e,n,null,t)}function ke(t,e){if(t===!1||t===null||typeof t=="undefined")throw new Error(e)}function s_(t,e){if(!t){typeof console!="undefined"&&console.warn(e);try{throw new Error(e)}catch(n){}}}function l2(){return Math.random().toString(36).substr(2,8)}function lg(t,e){return{usr:t.state,key:t.key,idx:e}}function Ch(t,e,n,r){return n===void 0&&(n=null),vo({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?Zi(e):e,{state:n,key:e&&e.key||r||l2()})}function Il(t){let{pathname:e="/",search:n="",hash:r=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(e+=r.charAt(0)==="#"?r:"#"+r),e}function Zi(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let r=t.indexOf("?");r>=0&&(e.search=t.substr(r),t=t.substr(0,r)),t&&(e.pathname=t)}return e}function u2(t,e,n,r){r===void 0&&(r={});let{window:i=document.defaultView,v5Compat:s=!1}=r,o=i.history,l=Qn.Pop,u=null,h=d();h==null&&(h=0,o.replaceState(vo({},o.state,{idx:h}),""));function d(){return(o.state||{idx:null}).idx}function p(){l=Qn.Pop;let L=d(),I=L==null?null:L-h;h=L,u&&u({action:l,location:N.location,delta:I})}function g(L,I){l=Qn.Push;let w=Ch(N.location,L,I);h=d()+1;let k=lg(w,h),P=N.createHref(w);try{o.pushState(k,"",P)}catch(V){if(V instanceof DOMException&&V.name==="DataCloneError")throw V;i.location.assign(P)}s&&u&&u({action:l,location:N.location,delta:1})}function S(L,I){l=Qn.Replace;let w=Ch(N.location,L,I);h=d();let k=lg(w,h),P=N.createHref(w);o.replaceState(k,"",P),s&&u&&u({action:l,location:N.location,delta:0})}function A(L){let I=i.location.origin!=="null"?i.location.origin:i.location.href,w=typeof L=="string"?L:Il(L);return w=w.replace(/ $/,"%20"),ke(I,"No window.location.(origin|href) available to create URL for href: "+w),new URL(w,I)}let N={get action(){return l},get location(){return t(i,o)},listen(L){if(u)throw new Error("A history only accepts one active listener");return i.addEventListener(ag,p),u=L,()=>{i.removeEventListener(ag,p),u=null}},createHref(L){return e(i,L)},createURL:A,encodeLocation(L){let I=A(L);return{pathname:I.pathname,search:I.search,hash:I.hash}},push:g,replace:S,go(L){return o.go(L)}};return N}var ug;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(ug||(ug={}));function c2(t,e,n){return n===void 0&&(n="/"),h2(t,e,n)}function h2(t,e,n,r){let i=typeof e=="string"?Zi(e):e,s=Jd(i.pathname||"/",n);if(s==null)return null;let o=o_(t);d2(o);let l=null;for(let u=0;l==null&&u<o.length;++u){let h=S2(s);l=E2(o[u],h)}return l}function o_(t,e,n,r){e===void 0&&(e=[]),n===void 0&&(n=[]),r===void 0&&(r="");let i=(s,o,l)=>{let u={relativePath:l===void 0?s.path||"":l,caseSensitive:s.caseSensitive===!0,childrenIndex:o,route:s};u.relativePath.startsWith("/")&&(ke(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let h=or([r,u.relativePath]),d=n.concat(u);s.children&&s.children.length>0&&(ke(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+h+'".')),o_(s.children,e,d,h)),!(s.path==null&&!s.index)&&e.push({path:h,score:_2(h,s.index),routesMeta:d})};return t.forEach((s,o)=>{var l;if(s.path===""||!((l=s.path)!=null&&l.includes("?")))i(s,o);else for(let u of a_(s.path))i(s,o,u)}),e}function a_(t){let e=t.split("/");if(e.length===0)return[];let[n,...r]=e,i=n.endsWith("?"),s=n.replace(/\?$/,"");if(r.length===0)return i?[s,""]:[s];let o=a_(r.join("/")),l=[];return l.push(...o.map(u=>u===""?s:[s,u].join("/"))),i&&l.push(...o),l.map(u=>t.startsWith("/")&&u===""?"/":u)}function d2(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:w2(e.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const f2=/^:[\w-]+$/,p2=3,m2=2,g2=1,y2=10,v2=-2,cg=t=>t==="*";function _2(t,e){let n=t.split("/"),r=n.length;return n.some(cg)&&(r+=v2),e&&(r+=m2),n.filter(i=>!cg(i)).reduce((i,s)=>i+(f2.test(s)?p2:s===""?g2:y2),r)}function w2(t,e){return t.length===e.length&&t.slice(0,-1).every((r,i)=>r===e[i])?t[t.length-1]-e[e.length-1]:0}function E2(t,e,n){let{routesMeta:r}=t,i={},s="/",o=[];for(let l=0;l<r.length;++l){let u=r[l],h=l===r.length-1,d=s==="/"?e:e.slice(s.length)||"/",p=I2({path:u.relativePath,caseSensitive:u.caseSensitive,end:h},d),g=u.route;if(!p)return null;Object.assign(i,p.params),o.push({params:i,pathname:or([s,p.pathname]),pathnameBase:R2(or([s,p.pathnameBase])),route:g}),p.pathnameBase!=="/"&&(s=or([s,p.pathnameBase]))}return o}function I2(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,r]=T2(t.path,t.caseSensitive,t.end),i=e.match(n);if(!i)return null;let s=i[0],o=s.replace(/(.)\/+$/,"$1"),l=i.slice(1);return{params:r.reduce((h,d,p)=>{let{paramName:g,isOptional:S}=d;if(g==="*"){let N=l[p]||"";o=s.slice(0,s.length-N.length).replace(/(.)\/+$/,"$1")}const A=l[p];return S&&!A?h[g]=void 0:h[g]=(A||"").replace(/%2F/g,"/"),h},{}),pathname:s,pathnameBase:o,pattern:t}}function T2(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),s_(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let r=[],i="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,l,u)=>(r.push({paramName:l,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(r.push({paramName:"*"}),i+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?i+="\\/*$":t!==""&&t!=="/"&&(i+="(?:(?=\\/|$))"),[new RegExp(i,e?void 0:"i"),r]}function S2(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return s_(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function Jd(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,r=t.charAt(n);return r&&r!=="/"?null:t.slice(n)||"/"}function k2(t,e){e===void 0&&(e="/");let{pathname:n,search:r="",hash:i=""}=typeof t=="string"?Zi(t):t;return{pathname:n?n.startsWith("/")?n:C2(n,e):e,search:P2(r),hash:x2(i)}}function C2(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(i=>{i===".."?n.length>1&&n.pop():i!=="."&&n.push(i)}),n.length>1?n.join("/"):"/"}function gc(t,e,n,r){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function A2(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function Xd(t,e){let n=A2(t);return e?n.map((r,i)=>i===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Zd(t,e,n,r){r===void 0&&(r=!1);let i;typeof t=="string"?i=Zi(t):(i=vo({},t),ke(!i.pathname||!i.pathname.includes("?"),gc("?","pathname","search",i)),ke(!i.pathname||!i.pathname.includes("#"),gc("#","pathname","hash",i)),ke(!i.search||!i.search.includes("#"),gc("#","search","hash",i)));let s=t===""||i.pathname==="",o=s?"/":i.pathname,l;if(o==null)l=n;else{let p=e.length-1;if(!r&&o.startsWith("..")){let g=o.split("/");for(;g[0]==="..";)g.shift(),p-=1;i.pathname=g.join("/")}l=p>=0?e[p]:"/"}let u=k2(i,l),h=o&&o!=="/"&&o.endsWith("/"),d=(s||o===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(h||d)&&(u.pathname+="/"),u}const or=t=>t.join("/").replace(/\/\/+/g,"/"),R2=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),P2=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,x2=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function N2(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const l_=["post","put","patch","delete"];new Set(l_);const D2=["get",...l_];new Set(D2);/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function _o(){return _o=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},_o.apply(this,arguments)}const ef=b.createContext(null),L2=b.createContext(null),Er=b.createContext(null),eu=b.createContext(null),an=b.createContext({outlet:null,matches:[],isDataRoute:!1}),u_=b.createContext(null);function O2(t,e){let{relative:n}=e===void 0?{}:e;es()||ke(!1);let{basename:r,navigator:i}=b.useContext(Er),{hash:s,pathname:o,search:l}=h_(t,{relative:n}),u=o;return r!=="/"&&(u=o==="/"?r:or([r,o])),i.createHref({pathname:u,search:l,hash:s})}function es(){return b.useContext(eu)!=null}function Zr(){return es()||ke(!1),b.useContext(eu).location}function c_(t){b.useContext(Er).static||b.useLayoutEffect(t)}function tu(){let{isDataRoute:t}=b.useContext(an);return t?Y2():V2()}function V2(){es()||ke(!1);let t=b.useContext(ef),{basename:e,future:n,navigator:r}=b.useContext(Er),{matches:i}=b.useContext(an),{pathname:s}=Zr(),o=JSON.stringify(Xd(i,n.v7_relativeSplatPath)),l=b.useRef(!1);return c_(()=>{l.current=!0}),b.useCallback(function(h,d){if(d===void 0&&(d={}),!l.current)return;if(typeof h=="number"){r.go(h);return}let p=Zd(h,JSON.parse(o),s,d.relative==="path");t==null&&e!=="/"&&(p.pathname=p.pathname==="/"?e:or([e,p.pathname])),(d.replace?r.replace:r.push)(p,d.state,d)},[e,r,o,s,t])}const b2=b.createContext(null);function M2(t){let e=b.useContext(an).outlet;return e&&b.createElement(b2.Provider,{value:t},e)}function F2(){let{matches:t}=b.useContext(an),e=t[t.length-1];return e?e.params:{}}function h_(t,e){let{relative:n}=e===void 0?{}:e,{future:r}=b.useContext(Er),{matches:i}=b.useContext(an),{pathname:s}=Zr(),o=JSON.stringify(Xd(i,r.v7_relativeSplatPath));return b.useMemo(()=>Zd(t,JSON.parse(o),s,n==="path"),[t,o,s,n])}function j2(t,e){return U2(t,e)}function U2(t,e,n,r){es()||ke(!1);let{navigator:i}=b.useContext(Er),{matches:s}=b.useContext(an),o=s[s.length-1],l=o?o.params:{};o&&o.pathname;let u=o?o.pathnameBase:"/";o&&o.route;let h=Zr(),d;if(e){var p;let L=typeof e=="string"?Zi(e):e;u==="/"||(p=L.pathname)!=null&&p.startsWith(u)||ke(!1),d=L}else d=h;let g=d.pathname||"/",S=g;if(u!=="/"){let L=u.replace(/^\//,"").split("/");S="/"+g.replace(/^\//,"").split("/").slice(L.length).join("/")}let A=c2(t,{pathname:S}),N=H2(A&&A.map(L=>Object.assign({},L,{params:Object.assign({},l,L.params),pathname:or([u,i.encodeLocation?i.encodeLocation(L.pathname).pathname:L.pathname]),pathnameBase:L.pathnameBase==="/"?u:or([u,i.encodeLocation?i.encodeLocation(L.pathnameBase).pathname:L.pathnameBase])})),s,n,r);return e&&N?b.createElement(eu.Provider,{value:{location:_o({pathname:"/",search:"",hash:"",state:null,key:"default"},d),navigationType:Qn.Pop}},N):N}function $2(){let t=Q2(),e=N2(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,i={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return b.createElement(b.Fragment,null,b.createElement("h2",null,"Unexpected Application Error!"),b.createElement("h3",{style:{fontStyle:"italic"}},e),n?b.createElement("pre",{style:i},n):null,null)}const B2=b.createElement($2,null);class z2 extends b.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?b.createElement(an.Provider,{value:this.props.routeContext},b.createElement(u_.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function q2(t){let{routeContext:e,match:n,children:r}=t,i=b.useContext(ef);return i&&i.static&&i.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=n.route.id),b.createElement(an.Provider,{value:e},r)}function H2(t,e,n,r){var i;if(e===void 0&&(e=[]),n===void 0&&(n=null),r===void 0&&(r=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=r)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let o=t,l=(i=n)==null?void 0:i.errors;if(l!=null){let d=o.findIndex(p=>p.route.id&&(l==null?void 0:l[p.route.id])!==void 0);d>=0||ke(!1),o=o.slice(0,Math.min(o.length,d+1))}let u=!1,h=-1;if(n&&r&&r.v7_partialHydration)for(let d=0;d<o.length;d++){let p=o[d];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(h=d),p.route.id){let{loaderData:g,errors:S}=n,A=p.route.loader&&g[p.route.id]===void 0&&(!S||S[p.route.id]===void 0);if(p.route.lazy||A){u=!0,h>=0?o=o.slice(0,h+1):o=[o[0]];break}}}return o.reduceRight((d,p,g)=>{let S,A=!1,N=null,L=null;n&&(S=l&&p.route.id?l[p.route.id]:void 0,N=p.route.errorElement||B2,u&&(h<0&&g===0?(J2("route-fallback"),A=!0,L=null):h===g&&(A=!0,L=p.route.hydrateFallbackElement||null)));let I=e.concat(o.slice(0,g+1)),w=()=>{let k;return S?k=N:A?k=L:p.route.Component?k=b.createElement(p.route.Component,null):p.route.element?k=p.route.element:k=d,b.createElement(q2,{match:p,routeContext:{outlet:d,matches:I,isDataRoute:n!=null},children:k})};return n&&(p.route.ErrorBoundary||p.route.errorElement||g===0)?b.createElement(z2,{location:n.location,revalidation:n.revalidation,component:N,error:S,children:w(),routeContext:{outlet:null,matches:I,isDataRoute:!0}}):w()},null)}var d_=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(d_||{}),f_=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(f_||{});function W2(t){let e=b.useContext(ef);return e||ke(!1),e}function K2(t){let e=b.useContext(L2);return e||ke(!1),e}function G2(t){let e=b.useContext(an);return e||ke(!1),e}function p_(t){let e=G2(),n=e.matches[e.matches.length-1];return n.route.id||ke(!1),n.route.id}function Q2(){var t;let e=b.useContext(u_),n=K2(),r=p_();return e!==void 0?e:(t=n.errors)==null?void 0:t[r]}function Y2(){let{router:t}=W2(d_.UseNavigateStable),e=p_(f_.UseNavigateStable),n=b.useRef(!1);return c_(()=>{n.current=!0}),b.useCallback(function(i,s){s===void 0&&(s={}),n.current&&(typeof i=="number"?t.navigate(i):t.navigate(i,_o({fromRouteId:e},s)))},[t,e])}const hg={};function J2(t,e,n){hg[t]||(hg[t]=!0)}function X2(t,e){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function Z2(t){let{to:e,replace:n,state:r,relative:i}=t;es()||ke(!1);let{future:s,static:o}=b.useContext(Er),{matches:l}=b.useContext(an),{pathname:u}=Zr(),h=tu(),d=Zd(e,Xd(l,s.v7_relativeSplatPath),u,i==="path"),p=JSON.stringify(d);return b.useEffect(()=>h(JSON.parse(p),{replace:n,state:r,relative:i}),[h,p,i,n,r]),null}function eS(t){return M2(t.context)}function jt(t){ke(!1)}function tS(t){let{basename:e="/",children:n=null,location:r,navigationType:i=Qn.Pop,navigator:s,static:o=!1,future:l}=t;es()&&ke(!1);let u=e.replace(/^\/*/,"/"),h=b.useMemo(()=>({basename:u,navigator:s,static:o,future:_o({v7_relativeSplatPath:!1},l)}),[u,l,s,o]);typeof r=="string"&&(r=Zi(r));let{pathname:d="/",search:p="",hash:g="",state:S=null,key:A="default"}=r,N=b.useMemo(()=>{let L=Jd(d,u);return L==null?null:{location:{pathname:L,search:p,hash:g,state:S,key:A},navigationType:i}},[u,d,p,g,S,A,i]);return N==null?null:b.createElement(Er.Provider,{value:h},b.createElement(eu.Provider,{children:n,value:N}))}function nS(t){let{children:e,location:n}=t;return j2(Ah(e),n)}new Promise(()=>{});function Ah(t,e){e===void 0&&(e=[]);let n=[];return b.Children.forEach(t,(r,i)=>{if(!b.isValidElement(r))return;let s=[...e,i];if(r.type===b.Fragment){n.push.apply(n,Ah(r.props.children,s));return}r.type!==jt&&ke(!1),!r.props.index||!r.props.children||ke(!1);let o={id:r.props.id||s.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(o.children=Ah(r.props.children,s)),n.push(o)}),n}/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Rh(){return Rh=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Rh.apply(this,arguments)}function rS(t,e){if(t==null)return{};var n={},r=Object.keys(t),i,s;for(s=0;s<r.length;s++)i=r[s],!(e.indexOf(i)>=0)&&(n[i]=t[i]);return n}function iS(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function sS(t,e){return t.button===0&&(!e||e==="_self")&&!iS(t)}function Ph(t){return t===void 0&&(t=""),new URLSearchParams(typeof t=="string"||Array.isArray(t)||t instanceof URLSearchParams?t:Object.keys(t).reduce((e,n)=>{let r=t[n];return e.concat(Array.isArray(r)?r.map(i=>[n,i]):[[n,r]])},[]))}function oS(t,e){let n=Ph(t);return e&&e.forEach((r,i)=>{n.has(i)||e.getAll(i).forEach(s=>{n.append(i,s)})}),n}const aS=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],lS="6";try{window.__reactRouterVersion=lS}catch(t){}const uS="startTransition",dg=QE[uS];function cS(t){let{basename:e,children:n,future:r,window:i}=t,s=b.useRef();s.current==null&&(s.current=a2({window:i,v5Compat:!0}));let o=s.current,[l,u]=b.useState({action:o.action,location:o.location}),{v7_startTransition:h}=r||{},d=b.useCallback(p=>{h&&dg?dg(()=>u(p)):u(p)},[u,h]);return b.useLayoutEffect(()=>o.listen(d),[o,d]),b.useEffect(()=>X2(r),[r]),b.createElement(tS,{basename:e,children:n,location:l.location,navigationType:l.action,navigator:o,future:r})}const hS=typeof window!="undefined"&&typeof window.document!="undefined"&&typeof window.document.createElement!="undefined",dS=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,tf=b.forwardRef(function(e,n){let{onClick:r,relative:i,reloadDocument:s,replace:o,state:l,target:u,to:h,preventScrollReset:d,viewTransition:p}=e,g=rS(e,aS),{basename:S}=b.useContext(Er),A,N=!1;if(typeof h=="string"&&dS.test(h)&&(A=h,hS))try{let k=new URL(window.location.href),P=h.startsWith("//")?new URL(k.protocol+h):new URL(h),V=Jd(P.pathname,S);P.origin===k.origin&&V!=null?h=V+P.search+P.hash:N=!0}catch(k){}let L=O2(h,{relative:i}),I=fS(h,{replace:o,state:l,target:u,preventScrollReset:d,relative:i,viewTransition:p});function w(k){r&&r(k),k.defaultPrevented||I(k)}return b.createElement("a",Rh({},g,{href:A||L,onClick:N||s?r:w,ref:n,target:u}))});var fg;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(fg||(fg={}));var pg;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(pg||(pg={}));function fS(t,e){let{target:n,replace:r,state:i,preventScrollReset:s,relative:o,viewTransition:l}=e===void 0?{}:e,u=tu(),h=Zr(),d=h_(t,{relative:o});return b.useCallback(p=>{if(sS(p,n)){p.preventDefault();let g=r!==void 0?r:Il(h)===Il(d);u(t,{replace:g,state:i,preventScrollReset:s,relative:o,viewTransition:l})}},[h,u,d,r,i,n,t,s,o,l])}function m_(t){let e=b.useRef(Ph(t)),n=b.useRef(!1),r=Zr(),i=b.useMemo(()=>oS(r.search,n.current?null:e.current),[r.search]),s=tu(),o=b.useCallback((l,u)=>{const h=Ph(typeof l=="function"?l(i):l);n.current=!0,s("?"+h,u)},[s,i]);return[i,o]}var mg={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g_=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},pS=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],l=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},y_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,l=o?t[i+1]:0,u=i+2<t.length,h=u?t[i+2]:0,d=s>>2,p=(s&3)<<4|l>>4;let g=(l&15)<<2|h>>6,S=h&63;u||(S=64,o||(g=64)),r.push(n[d],n[p],n[g],n[S])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(g_(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):pS(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const h=i<t.length?n[t.charAt(i)]:64;++i;const p=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||h==null||p==null)throw new mS;const g=s<<2|l>>4;if(r.push(g),h!==64){const S=l<<4&240|h>>2;if(r.push(S),p!==64){const A=h<<6&192|p;r.push(A)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class mS extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const gS=function(t){const e=g_(t);return y_.encodeByteArray(e,!0)},Tl=function(t){return gS(t).replace(/\./g,"")},v_=function(t){try{return y_.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yS(){if(typeof self!="undefined")return self;if(typeof window!="undefined")return window;if(typeof global!="undefined")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vS=()=>yS().__FIREBASE_DEFAULTS__,_S=()=>{if(typeof process=="undefined"||typeof mg=="undefined")return;const t=mg.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},wS=()=>{if(typeof document=="undefined")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const e=t&&v_(t[1]);return e&&JSON.parse(e)},nu=()=>{try{return vS()||_S()||wS()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},__=t=>{var e,n;return(n=(e=nu())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},ES=t=>{const e=__(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},w_=()=>{var t;return(t=nu())===null||t===void 0?void 0:t.config},E_=t=>{var e;return(e=nu())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IS{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TS(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Tl(JSON.stringify(n)),Tl(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tt(){return typeof navigator!="undefined"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function SS(){return typeof window!="undefined"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(tt())}function kS(){var t;const e=(t=nu())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch(n){return!1}}function CS(){return typeof navigator!="undefined"&&navigator.userAgent==="Cloudflare-Workers"}function nf(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function AS(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function RS(){const t=tt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function PS(){return!kS()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function rf(){try{return typeof indexedDB=="object"}catch(t){return!1}}function sf(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}function I_(){return!(typeof navigator=="undefined"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xS="FirebaseError";class Gt extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=xS,Object.setPrototypeOf(this,Gt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ei.prototype.create)}}class ei{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?NS(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new Gt(i,l,r)}}function NS(t,e){return t.replace(DS,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const DS=/\{\$([^}]+)}/g;function LS(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function wo(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(gg(s)&&gg(o)){if(!wo(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function gg(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oo(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function OS(t,e){const n=new VS(t,e);return n.subscribe.bind(n)}class VS{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");bS(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=yc),i.error===void 0&&(i.error=yc),i.complete===void 0&&(i.complete=yc);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch(o){}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console!="undefined"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function bS(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function yc(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MS=1e3,FS=2,jS=4*60*60*1e3,US=.5;function yg(t,e=MS,n=FS){const r=e*Math.pow(n,t),i=Math.round(US*r*(Math.random()-.5)*2);return Math.min(jS,r+i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(t){return t&&t._delegate?t._delegate:t}class Wt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $S{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new IS;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch(i){}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(zS(e))try{this.getOrInitializeService({instanceIdentifier:Pr})}catch(n){}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch(s){}}}}clearInstance(e=Pr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Pr){return this.instances.has(e)}getOptions(e=Pr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch(s){}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:BS(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch(i){}return r||null}normalizeInstanceIdentifier(e=Pr){return this.component?this.component.multipleInstances?e:Pr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function BS(t){return t===Pr?void 0:t}function zS(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qS{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new $S(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Z;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(Z||(Z={}));const HS={debug:Z.DEBUG,verbose:Z.VERBOSE,info:Z.INFO,warn:Z.WARN,error:Z.ERROR,silent:Z.SILENT},WS=Z.INFO,KS={[Z.DEBUG]:"log",[Z.VERBOSE]:"log",[Z.INFO]:"info",[Z.WARN]:"warn",[Z.ERROR]:"error"},GS=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=KS[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ru{constructor(e){this.name=e,this._logLevel=WS,this._logHandler=GS,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Z))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?HS[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Z.DEBUG,...e),this._logHandler(this,Z.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Z.VERBOSE,...e),this._logHandler(this,Z.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Z.INFO,...e),this._logHandler(this,Z.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Z.WARN,...e),this._logHandler(this,Z.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Z.ERROR,...e),this._logHandler(this,Z.ERROR,...e)}}const QS=(t,e)=>e.some(n=>t instanceof n);let vg,_g;function YS(){return vg||(vg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function JS(){return _g||(_g=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const T_=new WeakMap,xh=new WeakMap,S_=new WeakMap,vc=new WeakMap,of=new WeakMap;function XS(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(ar(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&T_.set(n,t)}).catch(()=>{}),of.set(e,t),e}function ZS(t){if(xh.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});xh.set(t,e)}let Nh={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return xh.get(t);if(e==="objectStoreNames")return t.objectStoreNames||S_.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ar(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ek(t){Nh=t(Nh)}function tk(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(_c(this),e,...n);return S_.set(r,e.sort?e.sort():[e]),ar(r)}:JS().includes(t)?function(...e){return t.apply(_c(this),e),ar(T_.get(this))}:function(...e){return ar(t.apply(_c(this),e))}}function nk(t){return typeof t=="function"?tk(t):(t instanceof IDBTransaction&&ZS(t),QS(t,YS())?new Proxy(t,Nh):t)}function ar(t){if(t instanceof IDBRequest)return XS(t);if(vc.has(t))return vc.get(t);const e=nk(t);return e!==t&&(vc.set(t,e),of.set(e,t)),e}const _c=t=>of.get(t);function k_(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),l=ar(o);return r&&o.addEventListener("upgradeneeded",u=>{r(ar(o.result),u.oldVersion,u.newVersion,ar(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const rk=["get","getKey","getAll","getAllKeys","count"],ik=["put","add","delete","clear"],wc=new Map;function wg(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(wc.get(e))return wc.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=ik.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||rk.includes(n)))return;const s=async function(o,...l){const u=this.transaction(o,i?"readwrite":"readonly");let h=u.store;return r&&(h=h.index(l.shift())),(await Promise.all([h[n](...l),i&&u.done]))[0]};return wc.set(e,s),s}ek(t=>({...t,get:(e,n,r)=>wg(e,n)||t.get(e,n,r),has:(e,n)=>!!wg(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sk{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ok(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ok(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Dh="@firebase/app",Eg="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn=new ru("@firebase/app"),ak="@firebase/app-compat",lk="@firebase/analytics-compat",uk="@firebase/analytics",ck="@firebase/app-check-compat",hk="@firebase/app-check",dk="@firebase/auth",fk="@firebase/auth-compat",pk="@firebase/database",mk="@firebase/data-connect",gk="@firebase/database-compat",yk="@firebase/functions",vk="@firebase/functions-compat",_k="@firebase/installations",wk="@firebase/installations-compat",Ek="@firebase/messaging",Ik="@firebase/messaging-compat",Tk="@firebase/performance",Sk="@firebase/performance-compat",kk="@firebase/remote-config",Ck="@firebase/remote-config-compat",Ak="@firebase/storage",Rk="@firebase/storage-compat",Pk="@firebase/firestore",xk="@firebase/vertexai-preview",Nk="@firebase/firestore-compat",Dk="firebase",Lk="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lh="[DEFAULT]",Ok={[Dh]:"fire-core",[ak]:"fire-core-compat",[uk]:"fire-analytics",[lk]:"fire-analytics-compat",[hk]:"fire-app-check",[ck]:"fire-app-check-compat",[dk]:"fire-auth",[fk]:"fire-auth-compat",[pk]:"fire-rtdb",[mk]:"fire-data-connect",[gk]:"fire-rtdb-compat",[yk]:"fire-fn",[vk]:"fire-fn-compat",[_k]:"fire-iid",[wk]:"fire-iid-compat",[Ek]:"fire-fcm",[Ik]:"fire-fcm-compat",[Tk]:"fire-perf",[Sk]:"fire-perf-compat",[kk]:"fire-rc",[Ck]:"fire-rc-compat",[Ak]:"fire-gcs",[Rk]:"fire-gcs-compat",[Pk]:"fire-fst",[Nk]:"fire-fst-compat",[xk]:"fire-vertex","fire-js":"fire-js",[Dk]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eo=new Map,Vk=new Map,Oh=new Map;function Ig(t,e){try{t.container.addComponent(e)}catch(n){Rn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function sn(t){const e=t.name;if(Oh.has(e))return Rn.debug(`There were multiple attempts to register component ${e}.`),!1;Oh.set(e,t);for(const n of Eo.values())Ig(n,t);for(const n of Vk.values())Ig(n,t);return!0}function ti(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function _n(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bk={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},lr=new ei("app","Firebase",bk);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mk{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Wt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw lr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ts=Lk;function C_(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Lh,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw lr.create("bad-app-name",{appName:String(i)});if(n||(n=w_()),!n)throw lr.create("no-options");const s=Eo.get(i);if(s){if(wo(n,s.options)&&wo(r,s.config))return s;throw lr.create("duplicate-app",{appName:i})}const o=new qS(i);for(const u of Oh.values())o.addComponent(u);const l=new Mk(n,r,o);return Eo.set(i,l),l}function af(t=Lh){const e=Eo.get(t);if(!e&&t===Lh&&w_())return C_();if(!e)throw lr.create("no-app",{appName:t});return e}function Tg(){return Array.from(Eo.values())}function Ot(t,e,n){var r;let i=(r=Ok[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Rn.warn(l.join(" "));return}sn(new Wt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fk="firebase-heartbeat-database",jk=1,Io="firebase-heartbeat-store";let Ec=null;function A_(){return Ec||(Ec=k_(Fk,jk,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Io)}catch(n){console.warn(n)}}}}).catch(t=>{throw lr.create("idb-open",{originalErrorMessage:t.message})})),Ec}async function Uk(t){try{const n=(await A_()).transaction(Io),r=await n.objectStore(Io).get(R_(t));return await n.done,r}catch(e){if(e instanceof Gt)Rn.warn(e.message);else{const n=lr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Rn.warn(n.message)}}}async function Sg(t,e){try{const r=(await A_()).transaction(Io,"readwrite");await r.objectStore(Io).put(e,R_(t)),await r.done}catch(n){if(n instanceof Gt)Rn.warn(n.message);else{const r=lr.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Rn.warn(r.message)}}}function R_(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $k=1024,Bk=30*24*60*60*1e3;class zk{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Hk(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=kg();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=Bk}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Rn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=kg(),{heartbeatsToSend:r,unsentEntries:i}=qk(this._heartbeatsCache.heartbeats),s=Tl(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Rn.warn(n),""}}}function kg(){return new Date().toISOString().substring(0,10)}function qk(t,e=$k){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),Cg(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Cg(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Hk{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return rf()?sf().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Uk(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Sg(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Sg(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Cg(t){return Tl(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wk(t){sn(new Wt("platform-logger",e=>new sk(e),"PRIVATE")),sn(new Wt("heartbeat",e=>new zk(e),"PRIVATE")),Ot(Dh,Eg,t),Ot(Dh,Eg,"esm2017"),Ot("fire-js","")}Wk("");var Kk="firebase",Gk="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ot(Kk,Gk,"app");function lf(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function P_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Qk=P_,x_=new ei("auth","Firebase",P_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sl=new ru("@firebase/auth");function Yk(t,...e){Sl.logLevel<=Z.WARN&&Sl.warn(`Auth (${ts}): ${t}`,...e)}function Ba(t,...e){Sl.logLevel<=Z.ERROR&&Sl.error(`Auth (${ts}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pn(t,...e){throw uf(t,...e)}function tn(t,...e){return uf(t,...e)}function N_(t,e,n){const r=Object.assign(Object.assign({},Qk()),{[e]:n});return new ei("auth","Firebase",r).create(e,{appName:t.name})}function ur(t){return N_(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function uf(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return x_.create(t,...e)}function K(t,e,...n){if(!t)throw uf(e,...n)}function wn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ba(e),new Error(e)}function xn(t,e){t||wn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vh(){var t;return typeof self!="undefined"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Jk(){return Ag()==="http:"||Ag()==="https:"}function Ag(){var t;return typeof self!="undefined"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xk(){return typeof navigator!="undefined"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Jk()||nf()||"connection"in navigator)?navigator.onLine:!0}function Zk(){if(typeof navigator=="undefined")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(e,n){this.shortDelay=e,this.longDelay=n,xn(n>e,"Short delay should be less than long delay!"),this.isMobile=SS()||AS()}get(){return Xk()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cf(t,e){xn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D_{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self!="undefined"&&"fetch"in self)return self.fetch;if(typeof globalThis!="undefined"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch!="undefined")return fetch;wn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self!="undefined"&&"Headers"in self)return self.Headers;if(typeof globalThis!="undefined"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers!="undefined")return Headers;wn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self!="undefined"&&"Response"in self)return self.Response;if(typeof globalThis!="undefined"&&globalThis.Response)return globalThis.Response;if(typeof Response!="undefined")return Response;wn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eC={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tC=new Vo(3e4,6e4);function iu(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function ns(t,e,n,r,i={}){return L_(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=Oo(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const h=Object.assign({method:e,headers:u},s);return CS()||(h.referrerPolicy="no-referrer"),D_.fetch()(V_(t,t.config.apiHost,n,l),h)})}async function L_(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},eC),e);try{const i=new nC(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw ka(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[u,h]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw ka(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw ka(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw ka(t,"user-disabled",o);const d=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw N_(t,d,h);Pn(t,d)}}catch(i){if(i instanceof Gt)throw i;Pn(t,"network-request-failed",{message:String(i)})}}async function O_(t,e,n,r,i={}){const s=await ns(t,e,n,r,i);return"mfaPendingCredential"in s&&Pn(t,"multi-factor-auth-required",{_serverResponse:s}),s}function V_(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?cf(t.config,i):`${t.config.apiScheme}://${i}`}class nC{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(tn(this.auth,"network-request-failed")),tC.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ka(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=tn(t,e,r);return i.customData._tokenResponse=n,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rC(t,e){return ns(t,"POST","/v1/accounts:delete",e)}async function b_(t,e){return ns(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ks(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch(e){}}async function iC(t,e=!1){const n=lt(t),r=await n.getIdToken(e),i=hf(r);K(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Ks(Ic(i.auth_time)),issuedAtTime:Ks(Ic(i.iat)),expirationTime:Ks(Ic(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Ic(t){return Number(t)*1e3}function hf(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ba("JWT malformed, contained fewer than 3 sections"),null;try{const i=v_(n);return i?JSON.parse(i):(Ba("Failed to decode base64 JWT payload"),null)}catch(i){return Ba("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Rg(t){const e=hf(t);return K(e,"internal-error"),K(typeof e.exp!="undefined","internal-error"),K(typeof e.iat!="undefined","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function To(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Gt&&sC(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function sC({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oC{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bh{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ks(this.lastLoginAt),this.creationTime=Ks(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kl(t){var e;const n=t.auth,r=await t.getIdToken(),i=await To(t,b_(n,{idToken:r}));K(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?M_(s.providerUserInfo):[],l=lC(t.providerData,o),u=t.isAnonymous,h=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),d=u?h:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new bh(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(t,p)}async function aC(t){const e=lt(t);await kl(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function lC(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function M_(t){return t.map(e=>{var{providerId:n}=e,r=lf(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uC(t,e){const n=await L_(t,{},async()=>{const r=Oo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=V_(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",D_.fetch()(o,{method:"POST",headers:l,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function cC(t,e){return ns(t,"POST","/v2/accounts:revokeToken",iu(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken!="undefined","internal-error"),K(typeof e.refreshToken!="undefined","internal-error");const n="expiresIn"in e&&typeof e.expiresIn!="undefined"?Number(e.expiresIn):Rg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){K(e.length!==0,"internal-error");const n=Rg(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await uC(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new Ni;return r&&(K(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(K(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(K(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ni,this.toJSON())}_performRefresh(){return wn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fn(t,e){K(typeof t=="string"||typeof t=="undefined","internal-error",{appName:e})}class En{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=lf(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new oC(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new bh(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await To(this,this.stsTokenManager.getToken(this.auth,e));return K(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return iC(this,e)}reload(){return aC(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new En(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await kl(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(_n(this.auth.app))return Promise.reject(ur(this.auth));const e=await this.getIdToken();return await To(this,rC(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,l,u,h,d;const p=(r=n.displayName)!==null&&r!==void 0?r:void 0,g=(i=n.email)!==null&&i!==void 0?i:void 0,S=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,A=(o=n.photoURL)!==null&&o!==void 0?o:void 0,N=(l=n.tenantId)!==null&&l!==void 0?l:void 0,L=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,I=(h=n.createdAt)!==null&&h!==void 0?h:void 0,w=(d=n.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:k,emailVerified:P,isAnonymous:V,providerData:F,stsTokenManager:E}=n;K(k&&E,e,"internal-error");const v=Ni.fromJSON(this.name,E);K(typeof k=="string",e,"internal-error"),Fn(p,e.name),Fn(g,e.name),K(typeof P=="boolean",e,"internal-error"),K(typeof V=="boolean",e,"internal-error"),Fn(S,e.name),Fn(A,e.name),Fn(N,e.name),Fn(L,e.name),Fn(I,e.name),Fn(w,e.name);const _=new En({uid:k,auth:e,email:g,emailVerified:P,displayName:p,isAnonymous:V,photoURL:A,phoneNumber:S,tenantId:N,stsTokenManager:v,createdAt:I,lastLoginAt:w});return F&&Array.isArray(F)&&(_.providerData=F.map(T=>Object.assign({},T))),L&&(_._redirectEventId=L),_}static async _fromIdTokenResponse(e,n,r=!1){const i=new Ni;i.updateFromServerResponse(n);const s=new En({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await kl(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];K(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?M_(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new Ni;l.updateFromIdToken(r);const u=new En({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new bh(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pg=new Map;function In(t){xn(t instanceof Function,"Expected a class definition");let e=Pg.get(t);return e?(xn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Pg.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}F_.type="NONE";const xg=F_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function za(t,e,n){return`firebase:${t}:${e}:${n}`}class Di{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=za(this.userKey,i.apiKey,s),this.fullPersistenceKey=za("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?En._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Di(In(xg),e,r);const i=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let s=i[0]||In(xg);const o=za(r,e.config.apiKey,e.name);let l=null;for(const h of n)try{const d=await h._get(o);if(d){const p=En._fromJSON(e,d);h!==s&&(l=p),s=h;break}}catch(d){}const u=i.filter(h=>h._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new Di(s,e,r):(s=u[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async h=>{if(h!==s)try{await h._remove(o)}catch(d){}})),new Di(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ng(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(B_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(j_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(q_(e))return"Blackberry";if(H_(e))return"Webos";if(U_(e))return"Safari";if((e.includes("chrome/")||$_(e))&&!e.includes("edge/"))return"Chrome";if(z_(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function j_(t=tt()){return/firefox\//i.test(t)}function U_(t=tt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function $_(t=tt()){return/crios\//i.test(t)}function B_(t=tt()){return/iemobile/i.test(t)}function z_(t=tt()){return/android/i.test(t)}function q_(t=tt()){return/blackberry/i.test(t)}function H_(t=tt()){return/webos/i.test(t)}function df(t=tt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function hC(t=tt()){var e;return df(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function dC(){return RS()&&document.documentMode===10}function W_(t=tt()){return df(t)||z_(t)||H_(t)||q_(t)||/windows phone/i.test(t)||B_(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K_(t,e=[]){let n;switch(t){case"Browser":n=Ng(tt());break;case"Worker":n=`${Ng(tt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${ts}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fC{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,l)=>{try{const u=e(s);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch(s){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pC(t,e={}){return ns(t,"GET","/v2/passwordPolicy",iu(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mC=6;class gC{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:mC,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yC{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Dg(this),this.idTokenSubscription=new Dg(this),this.beforeStateQueue=new fC(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=x_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=In(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await Di.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(s){}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await b_(this,{idToken:e}),r=await En._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(_n(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(r){await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await kl(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Zk()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(_n(this.app))return Promise.reject(ur(this));const n=e?lt(e):null;return n&&K(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return _n(this.app)?Promise.reject(ur(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return _n(this.app)?Promise.reject(ur(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(In(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await pC(this),n=new gC(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ei("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await cC(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&In(e)||this._popupRedirectResolver;K(n,this,"argument-error"),this.redirectPersistenceManager=await Di.create(this,[In(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=K_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Yk(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function bo(t){return lt(t)}class Dg{constructor(e){this.auth=e,this.observer=null,this.addObserver=OS(n=>this.observer=n)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ff={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function vC(t){ff=t}function _C(t){return ff.loadJS(t)}function wC(){return ff.gapiScript}function EC(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IC(t,e){const n=ti(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(wo(s,e!=null?e:{}))return i;Pn(i,"already-initialized")}return n.initialize({options:e})}function TC(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(In);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function SC(t,e,n){const r=bo(t);K(r._canInitEmulator,r,"emulator-config-failed"),K(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=G_(e),{host:o,port:l}=kC(e),u=l===null?"":`:${l}`;r.config.emulator={url:`${s}//${o}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),CC()}function G_(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function kC(t){const e=G_(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Lg(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Lg(o)}}}function Lg(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function CC(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console!="undefined"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window!="undefined"&&typeof document!="undefined"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return wn("not implemented")}_getIdTokenResponse(e){return wn("not implemented")}_linkToIdToken(e,n){return wn("not implemented")}_getReauthenticationResolver(e){return wn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Li(t,e){return O_(t,"POST","/v1/accounts:signInWithIdp",iu(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AC="http://localhost";class Nn extends Q_{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Nn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Pn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=lf(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new Nn(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Li(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Li(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Li(e,n)}buildRequest(){const e={requestUri:AC,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Oo(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y_{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs extends Y_{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class Gs extends rs{static credentialFromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;return K("providerId"in n&&"signInMethod"in n,"argument-error"),Nn._fromParams(n)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return K(e.idToken||e.accessToken,"argument-error"),Nn._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return Gs.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return Gs.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r,oauthTokenSecret:i,pendingToken:s,nonce:o,providerId:l}=e;if(!r&&!i&&!n&&!s||!l)return null;try{return new Gs(l)._credential({idToken:n,accessToken:r,nonce:o,pendingToken:s})}catch(u){return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn extends rs{constructor(){super("facebook.com")}static credential(e){return Nn._fromParams({providerId:zn.PROVIDER_ID,signInMethod:zn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return zn.credentialFromTaggedObject(e)}static credentialFromError(e){return zn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return zn.credential(e.oauthAccessToken)}catch(n){return null}}}zn.FACEBOOK_SIGN_IN_METHOD="facebook.com";zn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn extends rs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Nn._fromParams({providerId:qn.PROVIDER_ID,signInMethod:qn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return qn.credentialFromTaggedObject(e)}static credentialFromError(e){return qn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return qn.credential(n,r)}catch(i){return null}}}qn.GOOGLE_SIGN_IN_METHOD="google.com";qn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn extends rs{constructor(){super("github.com")}static credential(e){return Nn._fromParams({providerId:Hn.PROVIDER_ID,signInMethod:Hn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Hn.credentialFromTaggedObject(e)}static credentialFromError(e){return Hn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Hn.credential(e.oauthAccessToken)}catch(n){return null}}}Hn.GITHUB_SIGN_IN_METHOD="github.com";Hn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wn extends rs{constructor(){super("twitter.com")}static credential(e,n){return Nn._fromParams({providerId:Wn.PROVIDER_ID,signInMethod:Wn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Wn.credentialFromTaggedObject(e)}static credentialFromError(e){return Wn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Wn.credential(n,r)}catch(i){return null}}}Wn.TWITTER_SIGN_IN_METHOD="twitter.com";Wn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function RC(t,e){return O_(t,"POST","/v1/accounts:signUp",iu(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await En._fromIdTokenResponse(e,r,i),o=Og(r);return new pr({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Og(r);return new pr({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Og(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PC(t){var e;if(_n(t.app))return Promise.reject(ur(t));const n=bo(t);if(await n._initializationPromise,!((e=n.currentUser)===null||e===void 0)&&e.isAnonymous)return new pr({user:n.currentUser,providerId:null,operationType:"signIn"});const r=await RC(n,{returnSecureToken:!0}),i=await pr._fromIdTokenResponse(n,"signIn",r,!0);return await n._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl extends Gt{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Cl.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Cl(e,n,r,i)}}function J_(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Cl._fromErrorAndOperation(t,s,e,r):s})}async function xC(t,e,n=!1){const r=await To(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return pr._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NC(t,e,n=!1){const{auth:r}=t;if(_n(r.app))return Promise.reject(ur(r));const i="reauthenticate";try{const s=await To(t,J_(r,i,e,t),n);K(s.idToken,r,"internal-error");const o=hf(s.idToken);K(o,r,"internal-error");const{sub:l}=o;return K(t.uid===l,r,"user-mismatch"),pr._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Pn(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X_(t,e,n=!1){if(_n(t.app))return Promise.reject(ur(t));const r="signIn",i=await J_(t,r,e),s=await pr._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function DC(t,e){return X_(bo(t),e)}function LC(t,e,n,r){return lt(t).onIdTokenChanged(e,n,r)}function OC(t,e,n){return lt(t).beforeAuthStateChanged(e,n)}function VC(t,e,n,r){return lt(t).onAuthStateChanged(e,n,r)}function bC(t){return lt(t).signOut()}const Al="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Al,"1"),this.storage.removeItem(Al),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MC=1e3,FC=10;class ew extends Z_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=W_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);dC()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,FC):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},MC)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}ew.type="LOCAL";const jC=ew;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tw extends Z_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}tw.type="SESSION";const nw=tw;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UC(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new su(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async h=>h(n.origin,s)),u=await UC(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}su.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pf(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $C{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel!="undefined"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,u)=>{const h=pf("",20);i.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(p){const g=p;if(g.data.eventId===h)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(g.data.response);break;default:clearTimeout(d),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nn(){return window}function BC(t){nn().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rw(){return typeof nn().WorkerGlobalScope!="undefined"&&typeof nn().importScripts=="function"}async function zC(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch(t){return null}}function qC(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function HC(){return rw()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iw="firebaseLocalStorageDb",WC=1,Rl="firebaseLocalStorage",sw="fbase_key";class Mo{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function ou(t,e){return t.transaction([Rl],e?"readwrite":"readonly").objectStore(Rl)}function KC(){const t=indexedDB.deleteDatabase(iw);return new Mo(t).toPromise()}function Mh(){const t=indexedDB.open(iw,WC);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Rl,{keyPath:sw})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Rl)?e(r):(r.close(),await KC(),e(await Mh()))})})}async function Vg(t,e,n){const r=ou(t,!0).put({[sw]:e,value:n});return new Mo(r).toPromise()}async function GC(t,e){const n=ou(t,!1).get(e),r=await new Mo(n).toPromise();return r===void 0?null:r.value}function bg(t,e){const n=ou(t,!0).delete(e);return new Mo(n).toPromise()}const QC=800,YC=3;class ow{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Mh(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>YC)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return rw()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=su._getInstance(HC()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await zC(),!this.activeServiceWorker)return;this.sender=new $C(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||qC()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(n){}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Mh();return await Vg(e,Al,"1"),await bg(e,Al),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Vg(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>GC(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>bg(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=ou(i,!1).getAll();return new Mo(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),QC)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ow.type="LOCAL";const JC=ow;new Vo(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XC(t,e){return e?In(e):(K(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mf extends Q_{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Li(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Li(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Li(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function ZC(t){return X_(t.auth,new mf(t),t.bypassAuthState)}function eA(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),NC(n,new mf(t),t.bypassAuthState)}async function tA(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),xC(n,new mf(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aw{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return ZC;case"linkViaPopup":case"linkViaRedirect":return tA;case"reauthViaPopup":case"reauthViaRedirect":return eA;default:Pn(this.auth,"internal-error")}}resolve(e){xn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){xn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nA=new Vo(2e3,1e4);class Ti extends aw{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Ti.currentPopupAction&&Ti.currentPopupAction.cancel(),Ti.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){xn(this.filter.length===1,"Popup operations only handle one event");const e=pf();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(tn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(tn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ti.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(tn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,nA.get())};e()}}Ti.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rA="pendingRedirect",qa=new Map;class iA extends aw{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=qa.get(this.auth._key());if(!e){try{const r=await sA(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}qa.set(this.auth._key(),e)}return this.bypassAuthState||qa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function sA(t,e){const n=lA(e),r=aA(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function oA(t,e){qa.set(t._key(),e)}function aA(t){return In(t._redirectPersistence)}function lA(t){return za(rA,t.config.apiKey,t.name)}async function uA(t,e,n=!1){if(_n(t.app))return Promise.reject(ur(t));const r=bo(t),i=XC(r,e),o=await new iA(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cA=10*60*1e3;class hA{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!dA(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!lw(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(tn(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=cA&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mg(e))}saveEventToCache(e){this.cachedEventUids.add(Mg(e)),this.lastProcessedEventTime=Date.now()}}function Mg(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function lw({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function dA(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return lw(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fA(t,e={}){return ns(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pA=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,mA=/^https?/;async function gA(t){if(t.config.emulator)return;const{authorizedDomains:e}=await fA(t);for(const n of e)try{if(yA(n))return}catch(r){}Pn(t,"unauthorized-domain")}function yA(t){const e=Vh(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!mA.test(n))return!1;if(pA.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vA=new Vo(3e4,6e4);function Fg(){const t=nn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function _A(t){return new Promise((e,n)=>{var r,i,s;function o(){Fg(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Fg(),n(tn(t,"network-request-failed"))},timeout:vA.get()})}if(!((i=(r=nn().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=nn().gapi)===null||s===void 0)&&s.load)o();else{const l=EC("iframefcb");return nn()[l]=()=>{gapi.load?o():n(tn(t,"network-request-failed"))},_C(`${wC()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw Ha=null,e})}let Ha=null;function wA(t){return Ha=Ha||_A(t),Ha}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EA=new Vo(5e3,15e3),IA="__/auth/iframe",TA="emulator/auth/iframe",SA={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},kA=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function CA(t){const e=t.config;K(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?cf(e,TA):`https://${t.config.authDomain}/${IA}`,r={apiKey:e.apiKey,appName:t.name,v:ts},i=kA.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Oo(r).slice(1)}`}async function AA(t){const e=await wA(t),n=nn().gapi;return K(n,t,"internal-error"),e.open({where:document.body,url:CA(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:SA,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=tn(t,"network-request-failed"),l=nn().setTimeout(()=>{s(o)},EA.get());function u(){nn().clearTimeout(l),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RA={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},PA=500,xA=600,NA="_blank",DA="http://localhost";class jg{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function LA(t,e,n,r=PA,i=xA){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Object.assign(Object.assign({},RA),{width:r.toString(),height:i.toString(),top:s,left:o}),h=tt().toLowerCase();n&&(l=$_(h)?NA:n),j_(h)&&(e=e||DA,u.scrollbars="yes");const d=Object.entries(u).reduce((g,[S,A])=>`${g}${S}=${A},`,"");if(hC(h)&&l!=="_self")return OA(e||"",l),new jg(null);const p=window.open(e||"",l,d);K(p,t,"popup-blocked");try{p.focus()}catch(g){}return new jg(p)}function OA(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VA="__/auth/handler",bA="emulator/auth/handler",MA=encodeURIComponent("fac");async function Ug(t,e,n,r,i,s){K(t.config.authDomain,t,"auth-domain-config-required"),K(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:ts,eventId:i};if(e instanceof Y_){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",LS(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,p]of Object.entries({}))o[d]=p}if(e instanceof rs){const d=e.getScopes().filter(p=>p!=="");d.length>0&&(o.scopes=d.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const d of Object.keys(l))l[d]===void 0&&delete l[d];const u=await t._getAppCheckToken(),h=u?`#${MA}=${encodeURIComponent(u)}`:"";return`${FA(t)}?${Oo(l).slice(1)}${h}`}function FA({config:t}){return t.emulator?cf(t,bA):`https://${t.authDomain}/${VA}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tc="webStorageSupport";class jA{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=nw,this._completeRedirectFn=uA,this._overrideRedirectResult=oA}async _openPopup(e,n,r,i){var s;xn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await Ug(e,n,r,Vh(),i);return LA(e,o,pf())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Ug(e,n,r,Vh(),i);return BC(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(xn(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await AA(e),r=new hA(e);return n.register("authEvent",i=>(K(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Tc,{type:Tc},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Tc];o!==void 0&&n(!!o),Pn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=gA(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return W_()||U_()||df()}}const UA=jA;var $g="@firebase/auth",Bg="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $A{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BA(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function zA(t){sn(new Wt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:K_(t)},h=new yC(r,i,s,u);return TC(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),sn(new Wt("auth-internal",e=>{const n=bo(e.getProvider("auth").getImmediate());return(r=>new $A(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ot($g,Bg,BA(t)),Ot($g,Bg,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qA=5*60,HA=E_("authIdTokenMaxAge")||qA;let zg=null;const WA=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>HA)return;const i=n==null?void 0:n.token;zg!==i&&(zg=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function uw(t=af()){const e=ti(t,"auth");if(e.isInitialized())return e.getImmediate();const n=IC(t,{popupRedirectResolver:UA,persistence:[JC,jC,nw]}),r=E_("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=WA(s.toString());OC(n,o,()=>o(n.currentUser)),LC(n,l=>o(l))}}const i=__("auth");return i&&SC(n,`http://${i}`),n}function KA(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}vC({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=tn("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",KA().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});zA("Browser");var qg=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var jr,cw;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,v){function _(){}_.prototype=v.prototype,E.D=v.prototype,E.prototype=new _,E.prototype.constructor=E,E.C=function(T,R,D){for(var C=Array(arguments.length-2),At=2;At<arguments.length;At++)C[At-2]=arguments[At];return v.prototype[R].apply(T,C)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,v,_){_||(_=0);var T=Array(16);if(typeof v=="string")for(var R=0;16>R;++R)T[R]=v.charCodeAt(_++)|v.charCodeAt(_++)<<8|v.charCodeAt(_++)<<16|v.charCodeAt(_++)<<24;else for(R=0;16>R;++R)T[R]=v[_++]|v[_++]<<8|v[_++]<<16|v[_++]<<24;v=E.g[0],_=E.g[1],R=E.g[2];var D=E.g[3],C=v+(D^_&(R^D))+T[0]+3614090360&4294967295;v=_+(C<<7&4294967295|C>>>25),C=D+(R^v&(_^R))+T[1]+3905402710&4294967295,D=v+(C<<12&4294967295|C>>>20),C=R+(_^D&(v^_))+T[2]+606105819&4294967295,R=D+(C<<17&4294967295|C>>>15),C=_+(v^R&(D^v))+T[3]+3250441966&4294967295,_=R+(C<<22&4294967295|C>>>10),C=v+(D^_&(R^D))+T[4]+4118548399&4294967295,v=_+(C<<7&4294967295|C>>>25),C=D+(R^v&(_^R))+T[5]+1200080426&4294967295,D=v+(C<<12&4294967295|C>>>20),C=R+(_^D&(v^_))+T[6]+2821735955&4294967295,R=D+(C<<17&4294967295|C>>>15),C=_+(v^R&(D^v))+T[7]+4249261313&4294967295,_=R+(C<<22&4294967295|C>>>10),C=v+(D^_&(R^D))+T[8]+1770035416&4294967295,v=_+(C<<7&4294967295|C>>>25),C=D+(R^v&(_^R))+T[9]+2336552879&4294967295,D=v+(C<<12&4294967295|C>>>20),C=R+(_^D&(v^_))+T[10]+4294925233&4294967295,R=D+(C<<17&4294967295|C>>>15),C=_+(v^R&(D^v))+T[11]+2304563134&4294967295,_=R+(C<<22&4294967295|C>>>10),C=v+(D^_&(R^D))+T[12]+1804603682&4294967295,v=_+(C<<7&4294967295|C>>>25),C=D+(R^v&(_^R))+T[13]+4254626195&4294967295,D=v+(C<<12&4294967295|C>>>20),C=R+(_^D&(v^_))+T[14]+2792965006&4294967295,R=D+(C<<17&4294967295|C>>>15),C=_+(v^R&(D^v))+T[15]+1236535329&4294967295,_=R+(C<<22&4294967295|C>>>10),C=v+(R^D&(_^R))+T[1]+4129170786&4294967295,v=_+(C<<5&4294967295|C>>>27),C=D+(_^R&(v^_))+T[6]+3225465664&4294967295,D=v+(C<<9&4294967295|C>>>23),C=R+(v^_&(D^v))+T[11]+643717713&4294967295,R=D+(C<<14&4294967295|C>>>18),C=_+(D^v&(R^D))+T[0]+3921069994&4294967295,_=R+(C<<20&4294967295|C>>>12),C=v+(R^D&(_^R))+T[5]+3593408605&4294967295,v=_+(C<<5&4294967295|C>>>27),C=D+(_^R&(v^_))+T[10]+38016083&4294967295,D=v+(C<<9&4294967295|C>>>23),C=R+(v^_&(D^v))+T[15]+3634488961&4294967295,R=D+(C<<14&4294967295|C>>>18),C=_+(D^v&(R^D))+T[4]+3889429448&4294967295,_=R+(C<<20&4294967295|C>>>12),C=v+(R^D&(_^R))+T[9]+568446438&4294967295,v=_+(C<<5&4294967295|C>>>27),C=D+(_^R&(v^_))+T[14]+3275163606&4294967295,D=v+(C<<9&4294967295|C>>>23),C=R+(v^_&(D^v))+T[3]+4107603335&4294967295,R=D+(C<<14&4294967295|C>>>18),C=_+(D^v&(R^D))+T[8]+1163531501&4294967295,_=R+(C<<20&4294967295|C>>>12),C=v+(R^D&(_^R))+T[13]+2850285829&4294967295,v=_+(C<<5&4294967295|C>>>27),C=D+(_^R&(v^_))+T[2]+4243563512&4294967295,D=v+(C<<9&4294967295|C>>>23),C=R+(v^_&(D^v))+T[7]+1735328473&4294967295,R=D+(C<<14&4294967295|C>>>18),C=_+(D^v&(R^D))+T[12]+2368359562&4294967295,_=R+(C<<20&4294967295|C>>>12),C=v+(_^R^D)+T[5]+4294588738&4294967295,v=_+(C<<4&4294967295|C>>>28),C=D+(v^_^R)+T[8]+2272392833&4294967295,D=v+(C<<11&4294967295|C>>>21),C=R+(D^v^_)+T[11]+1839030562&4294967295,R=D+(C<<16&4294967295|C>>>16),C=_+(R^D^v)+T[14]+4259657740&4294967295,_=R+(C<<23&4294967295|C>>>9),C=v+(_^R^D)+T[1]+2763975236&4294967295,v=_+(C<<4&4294967295|C>>>28),C=D+(v^_^R)+T[4]+1272893353&4294967295,D=v+(C<<11&4294967295|C>>>21),C=R+(D^v^_)+T[7]+4139469664&4294967295,R=D+(C<<16&4294967295|C>>>16),C=_+(R^D^v)+T[10]+3200236656&4294967295,_=R+(C<<23&4294967295|C>>>9),C=v+(_^R^D)+T[13]+681279174&4294967295,v=_+(C<<4&4294967295|C>>>28),C=D+(v^_^R)+T[0]+3936430074&4294967295,D=v+(C<<11&4294967295|C>>>21),C=R+(D^v^_)+T[3]+3572445317&4294967295,R=D+(C<<16&4294967295|C>>>16),C=_+(R^D^v)+T[6]+76029189&4294967295,_=R+(C<<23&4294967295|C>>>9),C=v+(_^R^D)+T[9]+3654602809&4294967295,v=_+(C<<4&4294967295|C>>>28),C=D+(v^_^R)+T[12]+3873151461&4294967295,D=v+(C<<11&4294967295|C>>>21),C=R+(D^v^_)+T[15]+530742520&4294967295,R=D+(C<<16&4294967295|C>>>16),C=_+(R^D^v)+T[2]+3299628645&4294967295,_=R+(C<<23&4294967295|C>>>9),C=v+(R^(_|~D))+T[0]+4096336452&4294967295,v=_+(C<<6&4294967295|C>>>26),C=D+(_^(v|~R))+T[7]+1126891415&4294967295,D=v+(C<<10&4294967295|C>>>22),C=R+(v^(D|~_))+T[14]+2878612391&4294967295,R=D+(C<<15&4294967295|C>>>17),C=_+(D^(R|~v))+T[5]+4237533241&4294967295,_=R+(C<<21&4294967295|C>>>11),C=v+(R^(_|~D))+T[12]+1700485571&4294967295,v=_+(C<<6&4294967295|C>>>26),C=D+(_^(v|~R))+T[3]+2399980690&4294967295,D=v+(C<<10&4294967295|C>>>22),C=R+(v^(D|~_))+T[10]+4293915773&4294967295,R=D+(C<<15&4294967295|C>>>17),C=_+(D^(R|~v))+T[1]+2240044497&4294967295,_=R+(C<<21&4294967295|C>>>11),C=v+(R^(_|~D))+T[8]+1873313359&4294967295,v=_+(C<<6&4294967295|C>>>26),C=D+(_^(v|~R))+T[15]+4264355552&4294967295,D=v+(C<<10&4294967295|C>>>22),C=R+(v^(D|~_))+T[6]+2734768916&4294967295,R=D+(C<<15&4294967295|C>>>17),C=_+(D^(R|~v))+T[13]+1309151649&4294967295,_=R+(C<<21&4294967295|C>>>11),C=v+(R^(_|~D))+T[4]+4149444226&4294967295,v=_+(C<<6&4294967295|C>>>26),C=D+(_^(v|~R))+T[11]+3174756917&4294967295,D=v+(C<<10&4294967295|C>>>22),C=R+(v^(D|~_))+T[2]+718787259&4294967295,R=D+(C<<15&4294967295|C>>>17),C=_+(D^(R|~v))+T[9]+3951481745&4294967295,E.g[0]=E.g[0]+v&4294967295,E.g[1]=E.g[1]+(R+(C<<21&4294967295|C>>>11))&4294967295,E.g[2]=E.g[2]+R&4294967295,E.g[3]=E.g[3]+D&4294967295}r.prototype.u=function(E,v){v===void 0&&(v=E.length);for(var _=v-this.blockSize,T=this.B,R=this.h,D=0;D<v;){if(R==0)for(;D<=_;)i(this,E,D),D+=this.blockSize;if(typeof E=="string"){for(;D<v;)if(T[R++]=E.charCodeAt(D++),R==this.blockSize){i(this,T),R=0;break}}else for(;D<v;)if(T[R++]=E[D++],R==this.blockSize){i(this,T),R=0;break}}this.h=R,this.o+=v},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var v=1;v<E.length-8;++v)E[v]=0;var _=8*this.o;for(v=E.length-8;v<E.length;++v)E[v]=_&255,_/=256;for(this.u(E),E=Array(16),v=_=0;4>v;++v)for(var T=0;32>T;T+=8)E[_++]=this.g[v]>>>T&255;return E};function s(E,v){var _=l;return Object.prototype.hasOwnProperty.call(_,E)?_[E]:_[E]=v(E)}function o(E,v){this.h=v;for(var _=[],T=!0,R=E.length-1;0<=R;R--){var D=E[R]|0;T&&D==v||(_[R]=D,T=!1)}this.g=_}var l={};function u(E){return-128<=E&&128>E?s(E,function(v){return new o([v|0],0>v?-1:0)}):new o([E|0],0>E?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return p;if(0>E)return L(h(-E));for(var v=[],_=1,T=0;E>=_;T++)v[T]=E/_|0,_*=4294967296;return new o(v,0)}function d(E,v){if(E.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(E.charAt(0)=="-")return L(d(E.substring(1),v));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=h(Math.pow(v,8)),T=p,R=0;R<E.length;R+=8){var D=Math.min(8,E.length-R),C=parseInt(E.substring(R,R+D),v);8>D?(D=h(Math.pow(v,D)),T=T.j(D).add(h(C))):(T=T.j(_),T=T.add(h(C)))}return T}var p=u(0),g=u(1),S=u(16777216);t=o.prototype,t.m=function(){if(N(this))return-L(this).m();for(var E=0,v=1,_=0;_<this.g.length;_++){var T=this.i(_);E+=(0<=T?T:4294967296+T)*v,v*=4294967296}return E},t.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(A(this))return"0";if(N(this))return"-"+L(this).toString(E);for(var v=h(Math.pow(E,6)),_=this,T="";;){var R=P(_,v).g;_=I(_,R.j(v));var D=((0<_.g.length?_.g[0]:_.h)>>>0).toString(E);if(_=R,A(_))return D+T;for(;6>D.length;)D="0"+D;T=D+T}},t.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function A(E){if(E.h!=0)return!1;for(var v=0;v<E.g.length;v++)if(E.g[v]!=0)return!1;return!0}function N(E){return E.h==-1}t.l=function(E){return E=I(this,E),N(E)?-1:A(E)?0:1};function L(E){for(var v=E.g.length,_=[],T=0;T<v;T++)_[T]=~E.g[T];return new o(_,~E.h).add(g)}t.abs=function(){return N(this)?L(this):this},t.add=function(E){for(var v=Math.max(this.g.length,E.g.length),_=[],T=0,R=0;R<=v;R++){var D=T+(this.i(R)&65535)+(E.i(R)&65535),C=(D>>>16)+(this.i(R)>>>16)+(E.i(R)>>>16);T=C>>>16,D&=65535,C&=65535,_[R]=C<<16|D}return new o(_,_[_.length-1]&-2147483648?-1:0)};function I(E,v){return E.add(L(v))}t.j=function(E){if(A(this)||A(E))return p;if(N(this))return N(E)?L(this).j(L(E)):L(L(this).j(E));if(N(E))return L(this.j(L(E)));if(0>this.l(S)&&0>E.l(S))return h(this.m()*E.m());for(var v=this.g.length+E.g.length,_=[],T=0;T<2*v;T++)_[T]=0;for(T=0;T<this.g.length;T++)for(var R=0;R<E.g.length;R++){var D=this.i(T)>>>16,C=this.i(T)&65535,At=E.i(R)>>>16,Ir=E.i(R)&65535;_[2*T+2*R]+=C*Ir,w(_,2*T+2*R),_[2*T+2*R+1]+=D*Ir,w(_,2*T+2*R+1),_[2*T+2*R+1]+=C*At,w(_,2*T+2*R+1),_[2*T+2*R+2]+=D*At,w(_,2*T+2*R+2)}for(T=0;T<v;T++)_[T]=_[2*T+1]<<16|_[2*T];for(T=v;T<2*v;T++)_[T]=0;return new o(_,0)};function w(E,v){for(;(E[v]&65535)!=E[v];)E[v+1]+=E[v]>>>16,E[v]&=65535,v++}function k(E,v){this.g=E,this.h=v}function P(E,v){if(A(v))throw Error("division by zero");if(A(E))return new k(p,p);if(N(E))return v=P(L(E),v),new k(L(v.g),L(v.h));if(N(v))return v=P(E,L(v)),new k(L(v.g),v.h);if(30<E.g.length){if(N(E)||N(v))throw Error("slowDivide_ only works with positive integers.");for(var _=g,T=v;0>=T.l(E);)_=V(_),T=V(T);var R=F(_,1),D=F(T,1);for(T=F(T,2),_=F(_,2);!A(T);){var C=D.add(T);0>=C.l(E)&&(R=R.add(_),D=C),T=F(T,1),_=F(_,1)}return v=I(E,R.j(v)),new k(R,v)}for(R=p;0<=E.l(v);){for(_=Math.max(1,Math.floor(E.m()/v.m())),T=Math.ceil(Math.log(_)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),D=h(_),C=D.j(v);N(C)||0<C.l(E);)_-=T,D=h(_),C=D.j(v);A(D)&&(D=g),R=R.add(D),E=I(E,C)}return new k(R,E)}t.A=function(E){return P(this,E).h},t.and=function(E){for(var v=Math.max(this.g.length,E.g.length),_=[],T=0;T<v;T++)_[T]=this.i(T)&E.i(T);return new o(_,this.h&E.h)},t.or=function(E){for(var v=Math.max(this.g.length,E.g.length),_=[],T=0;T<v;T++)_[T]=this.i(T)|E.i(T);return new o(_,this.h|E.h)},t.xor=function(E){for(var v=Math.max(this.g.length,E.g.length),_=[],T=0;T<v;T++)_[T]=this.i(T)^E.i(T);return new o(_,this.h^E.h)};function V(E){for(var v=E.g.length+1,_=[],T=0;T<v;T++)_[T]=E.i(T)<<1|E.i(T-1)>>>31;return new o(_,E.h)}function F(E,v){var _=v>>5;v%=32;for(var T=E.g.length-_,R=[],D=0;D<T;D++)R[D]=0<v?E.i(D+_)>>>v|E.i(D+_+1)<<32-v:E.i(D+_);return new o(R,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,cw=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=d,jr=o}).apply(typeof qg!="undefined"?qg:typeof self!="undefined"?self:typeof window!="undefined"?window:{});var Ca=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var hw,Os,dw,Wa,Fh,fw,pw,mw;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,c,f){return a==Array.prototype||a==Object.prototype||(a[c]=f.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ca=="object"&&Ca];for(var c=0;c<a.length;++c){var f=a[c];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=n(this);function i(a,c){if(c)e:{var f=r;a=a.split(".");for(var m=0;m<a.length-1;m++){var x=a[m];if(!(x in f))break e;f=f[x]}a=a[a.length-1],m=f[a],c=c(m),c!=m&&c!=null&&e(f,a,{configurable:!0,writable:!0,value:c})}}function s(a,c){a instanceof String&&(a+="");var f=0,m=!1,x={next:function(){if(!m&&f<a.length){var O=f++;return{value:c(O,a[O]),done:!1}}return m=!0,{done:!0,value:void 0}}};return x[Symbol.iterator]=function(){return x},x}i("Array.prototype.values",function(a){return a||function(){return s(this,function(c,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function u(a){var c=typeof a;return c=c!="object"?c:a?Array.isArray(a)?"array":c:"null",c=="array"||c=="object"&&typeof a.length=="number"}function h(a){var c=typeof a;return c=="object"&&a!=null||c=="function"}function d(a,c,f){return a.call.apply(a.bind,arguments)}function p(a,c,f){if(!a)throw Error();if(2<arguments.length){var m=Array.prototype.slice.call(arguments,2);return function(){var x=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(x,m),a.apply(c,x)}}return function(){return a.apply(c,arguments)}}function g(a,c,f){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:p,g.apply(null,arguments)}function S(a,c){var f=Array.prototype.slice.call(arguments,1);return function(){var m=f.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function A(a,c){function f(){}f.prototype=c.prototype,a.aa=c.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(m,x,O){for(var $=Array(arguments.length-2),le=2;le<arguments.length;le++)$[le-2]=arguments[le];return c.prototype[x].apply(m,$)}}function N(a){const c=a.length;if(0<c){const f=Array(c);for(let m=0;m<c;m++)f[m]=a[m];return f}return[]}function L(a,c){for(let f=1;f<arguments.length;f++){const m=arguments[f];if(u(m)){const x=a.length||0,O=m.length||0;a.length=x+O;for(let $=0;$<O;$++)a[x+$]=m[$]}else a.push(m)}}class I{constructor(c,f){this.i=c,this.j=f,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function w(a){return/^[\s\xa0]*$/.test(a)}function k(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function P(a){return P[" "](a),a}P[" "]=function(){};var V=k().indexOf("Gecko")!=-1&&!(k().toLowerCase().indexOf("webkit")!=-1&&k().indexOf("Edge")==-1)&&!(k().indexOf("Trident")!=-1||k().indexOf("MSIE")!=-1)&&k().indexOf("Edge")==-1;function F(a,c,f){for(const m in a)c.call(f,a[m],m,a)}function E(a,c){for(const f in a)c.call(void 0,a[f],f,a)}function v(a){const c={};for(const f in a)c[f]=a[f];return c}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(a,c){let f,m;for(let x=1;x<arguments.length;x++){m=arguments[x];for(f in m)a[f]=m[f];for(let O=0;O<_.length;O++)f=_[O],Object.prototype.hasOwnProperty.call(m,f)&&(a[f]=m[f])}}function R(a){var c=1;a=a.split(":");const f=[];for(;0<c&&a.length;)f.push(a.shift()),c--;return a.length&&f.push(a.join(":")),f}function D(a){l.setTimeout(()=>{throw a},0)}function C(){var a=G;let c=null;return a.g&&(c=a.g,a.g=a.g.next,a.g||(a.h=null),c.next=null),c}class At{constructor(){this.h=this.g=null}add(c,f){const m=Ir.get();m.set(c,f),this.h?this.h.next=m:this.g=m,this.h=m}}var Ir=new I(()=>new as,a=>a.reset());class as{constructor(){this.next=this.g=this.h=null}set(c,f){this.h=c,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let ln,B=!1,G=new At,J=()=>{const a=l.Promise.resolve(void 0);ln=()=>{a.then(me)}};var me=()=>{for(var a;a=C();){try{a.h.call(a.g)}catch(f){D(f)}var c=Ir;c.j(a),100>c.h&&(c.h++,a.next=c.g,c.g=a)}B=!1};function ae(){this.s=this.s,this.C=this.C}ae.prototype.s=!1,ae.prototype.ma=function(){this.s||(this.s=!0,this.N())},ae.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ie(a,c){this.type=a,this.g=this.target=c,this.defaultPrevented=!1}Ie.prototype.h=function(){this.defaultPrevented=!0};var un=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,c=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,c),l.removeEventListener("test",f,c)}catch(f){}return a}();function cn(a,c){if(Ie.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=c,c=a.relatedTarget){if(V){e:{try{P(c.nodeName);var x=!0;break e}catch(O){}x=!1}x||(c=null)}}else f=="mouseover"?c=a.fromElement:f=="mouseout"&&(c=a.toElement);this.relatedTarget=c,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:hn[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&cn.aa.h.call(this)}}A(cn,Ie);var hn={2:"touch",3:"pen",4:"mouse"};cn.prototype.h=function(){cn.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var dn="closure_listenable_"+(1e6*Math.random()|0),tE=0;function nE(a,c,f,m,x){this.listener=a,this.proxy=null,this.src=c,this.type=f,this.capture=!!m,this.ha=x,this.key=++tE,this.da=this.fa=!1}function qo(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Ho(a){this.src=a,this.g={},this.h=0}Ho.prototype.add=function(a,c,f,m,x){var O=a.toString();a=this.g[O],a||(a=this.g[O]=[],this.h++);var $=Iu(a,c,m,x);return-1<$?(c=a[$],f||(c.fa=!1)):(c=new nE(c,this.src,O,!!m,x),c.fa=f,a.push(c)),c};function Eu(a,c){var f=c.type;if(f in a.g){var m=a.g[f],x=Array.prototype.indexOf.call(m,c,void 0),O;(O=0<=x)&&Array.prototype.splice.call(m,x,1),O&&(qo(c),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Iu(a,c,f,m){for(var x=0;x<a.length;++x){var O=a[x];if(!O.da&&O.listener==c&&O.capture==!!f&&O.ha==m)return x}return-1}var Tu="closure_lm_"+(1e6*Math.random()|0),Su={};function Zf(a,c,f,m,x){if(Array.isArray(c)){for(var O=0;O<c.length;O++)Zf(a,c[O],f,m,x);return null}return f=np(f),a&&a[dn]?a.K(c,f,h(m)?!!m.capture:!1,x):rE(a,c,f,!1,m,x)}function rE(a,c,f,m,x,O){if(!c)throw Error("Invalid event type");var $=h(x)?!!x.capture:!!x,le=Cu(a);if(le||(a[Tu]=le=new Ho(a)),f=le.add(c,f,m,$,O),f.proxy)return f;if(m=iE(),f.proxy=m,m.src=a,m.listener=f,a.addEventListener)un||(x=$),x===void 0&&(x=!1),a.addEventListener(c.toString(),m,x);else if(a.attachEvent)a.attachEvent(tp(c.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return f}function iE(){function a(f){return c.call(a.src,a.listener,f)}const c=sE;return a}function ep(a,c,f,m,x){if(Array.isArray(c))for(var O=0;O<c.length;O++)ep(a,c[O],f,m,x);else m=h(m)?!!m.capture:!!m,f=np(f),a&&a[dn]?(a=a.i,c=String(c).toString(),c in a.g&&(O=a.g[c],f=Iu(O,f,m,x),-1<f&&(qo(O[f]),Array.prototype.splice.call(O,f,1),O.length==0&&(delete a.g[c],a.h--)))):a&&(a=Cu(a))&&(c=a.g[c.toString()],a=-1,c&&(a=Iu(c,f,m,x)),(f=-1<a?c[a]:null)&&ku(f))}function ku(a){if(typeof a!="number"&&a&&!a.da){var c=a.src;if(c&&c[dn])Eu(c.i,a);else{var f=a.type,m=a.proxy;c.removeEventListener?c.removeEventListener(f,m,a.capture):c.detachEvent?c.detachEvent(tp(f),m):c.addListener&&c.removeListener&&c.removeListener(m),(f=Cu(c))?(Eu(f,a),f.h==0&&(f.src=null,c[Tu]=null)):qo(a)}}}function tp(a){return a in Su?Su[a]:Su[a]="on"+a}function sE(a,c){if(a.da)a=!0;else{c=new cn(c,this);var f=a.listener,m=a.ha||a.src;a.fa&&ku(a),a=f.call(m,c)}return a}function Cu(a){return a=a[Tu],a instanceof Ho?a:null}var Au="__closure_events_fn_"+(1e9*Math.random()>>>0);function np(a){return typeof a=="function"?a:(a[Au]||(a[Au]=function(c){return a.handleEvent(c)}),a[Au])}function qe(){ae.call(this),this.i=new Ho(this),this.M=this,this.F=null}A(qe,ae),qe.prototype[dn]=!0,qe.prototype.removeEventListener=function(a,c,f,m){ep(this,a,c,f,m)};function nt(a,c){var f,m=a.F;if(m)for(f=[];m;m=m.F)f.push(m);if(a=a.M,m=c.type||c,typeof c=="string")c=new Ie(c,a);else if(c instanceof Ie)c.target=c.target||a;else{var x=c;c=new Ie(m,a),T(c,x)}if(x=!0,f)for(var O=f.length-1;0<=O;O--){var $=c.g=f[O];x=Wo($,m,!0,c)&&x}if($=c.g=a,x=Wo($,m,!0,c)&&x,x=Wo($,m,!1,c)&&x,f)for(O=0;O<f.length;O++)$=c.g=f[O],x=Wo($,m,!1,c)&&x}qe.prototype.N=function(){if(qe.aa.N.call(this),this.i){var a=this.i,c;for(c in a.g){for(var f=a.g[c],m=0;m<f.length;m++)qo(f[m]);delete a.g[c],a.h--}}this.F=null},qe.prototype.K=function(a,c,f,m){return this.i.add(String(a),c,!1,f,m)},qe.prototype.L=function(a,c,f,m){return this.i.add(String(a),c,!0,f,m)};function Wo(a,c,f,m){if(c=a.i.g[String(c)],!c)return!0;c=c.concat();for(var x=!0,O=0;O<c.length;++O){var $=c[O];if($&&!$.da&&$.capture==f){var le=$.listener,Me=$.ha||$.src;$.fa&&Eu(a.i,$),x=le.call(Me,m)!==!1&&x}}return x&&!m.defaultPrevented}function rp(a,c,f){if(typeof a=="function")f&&(a=g(a,f));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(a,c||0)}function ip(a){a.g=rp(()=>{a.g=null,a.i&&(a.i=!1,ip(a))},a.l);const c=a.h;a.h=null,a.m.apply(null,c)}class oE extends ae{constructor(c,f){super(),this.m=c,this.l=f,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:ip(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ls(a){ae.call(this),this.h=a,this.g={}}A(ls,ae);var sp=[];function op(a){F(a.g,function(c,f){this.g.hasOwnProperty(f)&&ku(c)},a),a.g={}}ls.prototype.N=function(){ls.aa.N.call(this),op(this)},ls.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ru=l.JSON.stringify,aE=l.JSON.parse,lE=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Pu(){}Pu.prototype.h=null;function ap(a){return a.h||(a.h=a.i())}function lp(){}var us={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function xu(){Ie.call(this,"d")}A(xu,Ie);function Nu(){Ie.call(this,"c")}A(Nu,Ie);var Tr={},up=null;function Ko(){return up=up||new qe}Tr.La="serverreachability";function cp(a){Ie.call(this,Tr.La,a)}A(cp,Ie);function cs(a){const c=Ko();nt(c,new cp(c))}Tr.STAT_EVENT="statevent";function hp(a,c){Ie.call(this,Tr.STAT_EVENT,a),this.stat=c}A(hp,Ie);function rt(a){const c=Ko();nt(c,new hp(c,a))}Tr.Ma="timingevent";function dp(a,c){Ie.call(this,Tr.Ma,a),this.size=c}A(dp,Ie);function hs(a,c){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},c)}function ds(){this.g=!0}ds.prototype.xa=function(){this.g=!1};function uE(a,c,f,m,x,O){a.info(function(){if(a.g)if(O)for(var $="",le=O.split("&"),Me=0;Me<le.length;Me++){var ie=le[Me].split("=");if(1<ie.length){var He=ie[0];ie=ie[1];var We=He.split("_");$=2<=We.length&&We[1]=="type"?$+(He+"="+ie+"&"):$+(He+"=redacted&")}}else $=null;else $=O;return"XMLHTTP REQ ("+m+") [attempt "+x+"]: "+c+`
`+f+`
`+$})}function cE(a,c,f,m,x,O,$){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+x+"]: "+c+`
`+f+`
`+O+" "+$})}function ri(a,c,f,m){a.info(function(){return"XMLHTTP TEXT ("+c+"): "+dE(a,f)+(m?" "+m:"")})}function hE(a,c){a.info(function(){return"TIMEOUT: "+c})}ds.prototype.info=function(){};function dE(a,c){if(!a.g)return c;if(!c)return null;try{var f=JSON.parse(c);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var m=f[a];if(!(2>m.length)){var x=m[1];if(Array.isArray(x)&&!(1>x.length)){var O=x[0];if(O!="noop"&&O!="stop"&&O!="close")for(var $=1;$<x.length;$++)x[$]=""}}}}return Ru(f)}catch(le){return c}}var Go={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},fp={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Du;function Qo(){}A(Qo,Pu),Qo.prototype.g=function(){return new XMLHttpRequest},Qo.prototype.i=function(){return{}},Du=new Qo;function On(a,c,f,m){this.j=a,this.i=c,this.l=f,this.R=m||1,this.U=new ls(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new pp}function pp(){this.i=null,this.g="",this.h=!1}var mp={},Lu={};function Ou(a,c,f){a.L=1,a.v=Zo(fn(c)),a.m=f,a.P=!0,gp(a,null)}function gp(a,c){a.F=Date.now(),Yo(a),a.A=fn(a.v);var f=a.A,m=a.R;Array.isArray(m)||(m=[String(m)]),xp(f.i,"t",m),a.C=0,f=a.j.J,a.h=new pp,a.g=Gp(a.j,f?c:null,!a.m),0<a.O&&(a.M=new oE(g(a.Y,a,a.g),a.O)),c=a.U,f=a.g,m=a.ca;var x="readystatechange";Array.isArray(x)||(x&&(sp[0]=x.toString()),x=sp);for(var O=0;O<x.length;O++){var $=Zf(f,x[O],m||c.handleEvent,!1,c.h||c);if(!$)break;c.g[$.key]=$}c=a.H?v(a.H):{},a.m?(a.u||(a.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,c)):(a.u="GET",a.g.ea(a.A,a.u,null,c)),cs(),uE(a.i,a.u,a.A,a.l,a.R,a.m)}On.prototype.ca=function(a){a=a.target;const c=this.M;c&&pn(a)==3?c.j():this.Y(a)},On.prototype.Y=function(a){try{if(a==this.g)e:{const We=pn(this.g);var c=this.g.Ba();const oi=this.g.Z();if(!(3>We)&&(We!=3||this.g&&(this.h.h||this.g.oa()||Mp(this.g)))){this.J||We!=4||c==7||(c==8||0>=oi?cs(3):cs(2)),Vu(this);var f=this.g.Z();this.X=f;t:if(yp(this)){var m=Mp(this.g);a="";var x=m.length,O=pn(this.g)==4;if(!this.h.i){if(typeof TextDecoder=="undefined"){Sr(this),fs(this);var $="";break t}this.h.i=new l.TextDecoder}for(c=0;c<x;c++)this.h.h=!0,a+=this.h.i.decode(m[c],{stream:!(O&&c==x-1)});m.length=0,this.h.g+=a,this.C=0,$=this.h.g}else $=this.g.oa();if(this.o=f==200,cE(this.i,this.u,this.A,this.l,this.R,We,f),this.o){if(this.T&&!this.K){t:{if(this.g){var le,Me=this.g;if((le=Me.g?Me.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!w(le)){var ie=le;break t}}ie=null}if(f=ie)ri(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,bu(this,f);else{this.o=!1,this.s=3,rt(12),Sr(this),fs(this);break e}}if(this.P){f=!0;let Mt;for(;!this.J&&this.C<$.length;)if(Mt=fE(this,$),Mt==Lu){We==4&&(this.s=4,rt(14),f=!1),ri(this.i,this.l,null,"[Incomplete Response]");break}else if(Mt==mp){this.s=4,rt(15),ri(this.i,this.l,$,"[Invalid Chunk]"),f=!1;break}else ri(this.i,this.l,Mt,null),bu(this,Mt);if(yp(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),We!=4||$.length!=0||this.h.h||(this.s=1,rt(16),f=!1),this.o=this.o&&f,!f)ri(this.i,this.l,$,"[Invalid Chunked Response]"),Sr(this),fs(this);else if(0<$.length&&!this.W){this.W=!0;var He=this.j;He.g==this&&He.ba&&!He.M&&(He.j.info("Great, no buffering proxy detected. Bytes received: "+$.length),Bu(He),He.M=!0,rt(11))}}else ri(this.i,this.l,$,null),bu(this,$);We==4&&Sr(this),this.o&&!this.J&&(We==4?qp(this.j,this):(this.o=!1,Yo(this)))}else xE(this.g),f==400&&0<$.indexOf("Unknown SID")?(this.s=3,rt(12)):(this.s=0,rt(13)),Sr(this),fs(this)}}}catch(We){}finally{}};function yp(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function fE(a,c){var f=a.C,m=c.indexOf(`
`,f);return m==-1?Lu:(f=Number(c.substring(f,m)),isNaN(f)?mp:(m+=1,m+f>c.length?Lu:(c=c.slice(m,m+f),a.C=m+f,c)))}On.prototype.cancel=function(){this.J=!0,Sr(this)};function Yo(a){a.S=Date.now()+a.I,vp(a,a.I)}function vp(a,c){if(a.B!=null)throw Error("WatchDog timer not null");a.B=hs(g(a.ba,a),c)}function Vu(a){a.B&&(l.clearTimeout(a.B),a.B=null)}On.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(hE(this.i,this.A),this.L!=2&&(cs(),rt(17)),Sr(this),this.s=2,fs(this)):vp(this,this.S-a)};function fs(a){a.j.G==0||a.J||qp(a.j,a)}function Sr(a){Vu(a);var c=a.M;c&&typeof c.ma=="function"&&c.ma(),a.M=null,op(a.U),a.g&&(c=a.g,a.g=null,c.abort(),c.ma())}function bu(a,c){try{var f=a.j;if(f.G!=0&&(f.g==a||Mu(f.h,a))){if(!a.K&&Mu(f.h,a)&&f.G==3){try{var m=f.Da.g.parse(c)}catch(ie){m=null}if(Array.isArray(m)&&m.length==3){var x=m;if(x[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)sa(f),ra(f);else break e;$u(f),rt(18)}}else f.za=x[1],0<f.za-f.T&&37500>x[2]&&f.F&&f.v==0&&!f.C&&(f.C=hs(g(f.Za,f),6e3));if(1>=Ep(f.h)&&f.ca){try{f.ca()}catch(ie){}f.ca=void 0}}else Cr(f,11)}else if((a.K||f.g==a)&&sa(f),!w(c))for(x=f.Da.g.parse(c),c=0;c<x.length;c++){let ie=x[c];if(f.T=ie[0],ie=ie[1],f.G==2)if(ie[0]=="c"){f.K=ie[1],f.ia=ie[2];const He=ie[3];He!=null&&(f.la=He,f.j.info("VER="+f.la));const We=ie[4];We!=null&&(f.Aa=We,f.j.info("SVER="+f.Aa));const oi=ie[5];oi!=null&&typeof oi=="number"&&0<oi&&(m=1.5*oi,f.L=m,f.j.info("backChannelRequestTimeoutMs_="+m)),m=f;const Mt=a.g;if(Mt){const aa=Mt.g?Mt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(aa){var O=m.h;O.g||aa.indexOf("spdy")==-1&&aa.indexOf("quic")==-1&&aa.indexOf("h2")==-1||(O.j=O.l,O.g=new Set,O.h&&(Fu(O,O.h),O.h=null))}if(m.D){const zu=Mt.g?Mt.g.getResponseHeader("X-HTTP-Session-Id"):null;zu&&(m.ya=zu,ce(m.I,m.D,zu))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),m=f;var $=a;if(m.qa=Kp(m,m.J?m.ia:null,m.W),$.K){Ip(m.h,$);var le=$,Me=m.L;Me&&(le.I=Me),le.B&&(Vu(le),Yo(le)),m.g=$}else Bp(m);0<f.i.length&&ia(f)}else ie[0]!="stop"&&ie[0]!="close"||Cr(f,7);else f.G==3&&(ie[0]=="stop"||ie[0]=="close"?ie[0]=="stop"?Cr(f,7):Uu(f):ie[0]!="noop"&&f.l&&f.l.ta(ie),f.v=0)}}cs(4)}catch(ie){}}var pE=class{constructor(a,c){this.g=a,this.map=c}};function _p(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function wp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Ep(a){return a.h?1:a.g?a.g.size:0}function Mu(a,c){return a.h?a.h==c:a.g?a.g.has(c):!1}function Fu(a,c){a.g?a.g.add(c):a.h=c}function Ip(a,c){a.h&&a.h==c?a.h=null:a.g&&a.g.has(c)&&a.g.delete(c)}_p.prototype.cancel=function(){if(this.i=Tp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Tp(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let c=a.i;for(const f of a.g.values())c=c.concat(f.D);return c}return N(a.i)}function mE(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map!="undefined"&&a instanceof Map||typeof Set!="undefined"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var c=[],f=a.length,m=0;m<f;m++)c.push(a[m]);return c}c=[],f=0;for(m in a)c[f++]=a[m];return c}function gE(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map!="undefined"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set!="undefined"&&a instanceof Set)){if(u(a)||typeof a=="string"){var c=[];a=a.length;for(var f=0;f<a;f++)c.push(f);return c}c=[],f=0;for(const m in a)c[f++]=m;return c}}}function Sp(a,c){if(a.forEach&&typeof a.forEach=="function")a.forEach(c,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,c,void 0);else for(var f=gE(a),m=mE(a),x=m.length,O=0;O<x;O++)c.call(void 0,m[O],f&&f[O],a)}var kp=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function yE(a,c){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var m=a[f].indexOf("="),x=null;if(0<=m){var O=a[f].substring(0,m);x=a[f].substring(m+1)}else O=a[f];c(O,x?decodeURIComponent(x.replace(/\+/g," ")):"")}}}function kr(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof kr){this.h=a.h,Jo(this,a.j),this.o=a.o,this.g=a.g,Xo(this,a.s),this.l=a.l;var c=a.i,f=new gs;f.i=c.i,c.g&&(f.g=new Map(c.g),f.h=c.h),Cp(this,f),this.m=a.m}else a&&(c=String(a).match(kp))?(this.h=!1,Jo(this,c[1]||"",!0),this.o=ps(c[2]||""),this.g=ps(c[3]||"",!0),Xo(this,c[4]),this.l=ps(c[5]||"",!0),Cp(this,c[6]||"",!0),this.m=ps(c[7]||"")):(this.h=!1,this.i=new gs(null,this.h))}kr.prototype.toString=function(){var a=[],c=this.j;c&&a.push(ms(c,Ap,!0),":");var f=this.g;return(f||c=="file")&&(a.push("//"),(c=this.o)&&a.push(ms(c,Ap,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(ms(f,f.charAt(0)=="/"?wE:_E,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",ms(f,IE)),a.join("")};function fn(a){return new kr(a)}function Jo(a,c,f){a.j=f?ps(c,!0):c,a.j&&(a.j=a.j.replace(/:$/,""))}function Xo(a,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);a.s=c}else a.s=null}function Cp(a,c,f){c instanceof gs?(a.i=c,TE(a.i,a.h)):(f||(c=ms(c,EE)),a.i=new gs(c,a.h))}function ce(a,c,f){a.i.set(c,f)}function Zo(a){return ce(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function ps(a,c){return a?c?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function ms(a,c,f){return typeof a=="string"?(a=encodeURI(a).replace(c,vE),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function vE(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Ap=/[#\/\?@]/g,_E=/[#\?:]/g,wE=/[#\?]/g,EE=/[#\?@]/g,IE=/#/g;function gs(a,c){this.h=this.g=null,this.i=a||null,this.j=!!c}function Vn(a){a.g||(a.g=new Map,a.h=0,a.i&&yE(a.i,function(c,f){a.add(decodeURIComponent(c.replace(/\+/g," ")),f)}))}t=gs.prototype,t.add=function(a,c){Vn(this),this.i=null,a=ii(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(c),this.h+=1,this};function Rp(a,c){Vn(a),c=ii(a,c),a.g.has(c)&&(a.i=null,a.h-=a.g.get(c).length,a.g.delete(c))}function Pp(a,c){return Vn(a),c=ii(a,c),a.g.has(c)}t.forEach=function(a,c){Vn(this),this.g.forEach(function(f,m){f.forEach(function(x){a.call(c,x,m,this)},this)},this)},t.na=function(){Vn(this);const a=Array.from(this.g.values()),c=Array.from(this.g.keys()),f=[];for(let m=0;m<c.length;m++){const x=a[m];for(let O=0;O<x.length;O++)f.push(c[m])}return f},t.V=function(a){Vn(this);let c=[];if(typeof a=="string")Pp(this,a)&&(c=c.concat(this.g.get(ii(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)c=c.concat(a[f])}return c},t.set=function(a,c){return Vn(this),this.i=null,a=ii(this,a),Pp(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[c]),this.h+=1,this},t.get=function(a,c){return a?(a=this.V(a),0<a.length?String(a[0]):c):c};function xp(a,c,f){Rp(a,c),0<f.length&&(a.i=null,a.g.set(ii(a,c),N(f)),a.h+=f.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],c=Array.from(this.g.keys());for(var f=0;f<c.length;f++){var m=c[f];const O=encodeURIComponent(String(m)),$=this.V(m);for(m=0;m<$.length;m++){var x=O;$[m]!==""&&(x+="="+encodeURIComponent(String($[m]))),a.push(x)}}return this.i=a.join("&")};function ii(a,c){return c=String(c),a.j&&(c=c.toLowerCase()),c}function TE(a,c){c&&!a.j&&(Vn(a),a.i=null,a.g.forEach(function(f,m){var x=m.toLowerCase();m!=x&&(Rp(this,m),xp(this,x,f))},a)),a.j=c}function SE(a,c){const f=new ds;if(l.Image){const m=new Image;m.onload=S(bn,f,"TestLoadImage: loaded",!0,c,m),m.onerror=S(bn,f,"TestLoadImage: error",!1,c,m),m.onabort=S(bn,f,"TestLoadImage: abort",!1,c,m),m.ontimeout=S(bn,f,"TestLoadImage: timeout",!1,c,m),l.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else c(!1)}function kE(a,c){const f=new ds,m=new AbortController,x=setTimeout(()=>{m.abort(),bn(f,"TestPingServer: timeout",!1,c)},1e4);fetch(a,{signal:m.signal}).then(O=>{clearTimeout(x),O.ok?bn(f,"TestPingServer: ok",!0,c):bn(f,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(x),bn(f,"TestPingServer: error",!1,c)})}function bn(a,c,f,m,x){try{x&&(x.onload=null,x.onerror=null,x.onabort=null,x.ontimeout=null),m(f)}catch(O){}}function CE(){this.g=new lE}function AE(a,c,f){const m=f||"";try{Sp(a,function(x,O){let $=x;h(x)&&($=Ru(x)),c.push(m+O+"="+encodeURIComponent($))})}catch(x){throw c.push(m+"type="+encodeURIComponent("_badmap")),x}}function ea(a){this.l=a.Ub||null,this.j=a.eb||!1}A(ea,Pu),ea.prototype.g=function(){return new ta(this.l,this.j)},ea.prototype.i=function(a){return function(){return a}}({});function ta(a,c){qe.call(this),this.D=a,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}A(ta,qe),t=ta.prototype,t.open=function(a,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=c,this.readyState=1,vs(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(c.body=a),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ys(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,vs(this)),this.g&&(this.readyState=3,vs(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream!="undefined"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Np(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Np(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var c=a.value?a.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!a.done}))&&(this.response=this.responseText+=c)}a.done?ys(this):vs(this),this.readyState==3&&Np(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,ys(this))},t.Qa=function(a){this.g&&(this.response=a,ys(this))},t.ga=function(){this.g&&ys(this)};function ys(a){a.readyState=4,a.l=null,a.j=null,a.v=null,vs(a)}t.setRequestHeader=function(a,c){this.u.append(a,c)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],c=this.h.entries();for(var f=c.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=c.next();return a.join(`\r
`)};function vs(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ta.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Dp(a){let c="";return F(a,function(f,m){c+=m,c+=":",c+=f,c+=`\r
`}),c}function ju(a,c,f){e:{for(m in f){var m=!1;break e}m=!0}m||(f=Dp(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):ce(a,c,f))}function _e(a){qe.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}A(_e,qe);var RE=/^https?$/i,PE=["POST","PUT"];t=_e.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,c,f,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);c=c?c.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Du.g(),this.v=this.o?ap(this.o):ap(Du),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(c,String(a),!0),this.B=!1}catch(O){Lp(this,O);return}if(a=f||"",f=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var x in m)f.set(x,m[x]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const O of m.keys())f.set(O,m.get(O));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(f.keys()).find(O=>O.toLowerCase()=="content-type"),x=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(PE,c,void 0))||m||x||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[O,$]of f)this.g.setRequestHeader(O,$);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{bp(this),this.u=!0,this.g.send(a),this.u=!1}catch(O){Lp(this,O)}};function Lp(a,c){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=c,a.m=5,Op(a),na(a)}function Op(a){a.A||(a.A=!0,nt(a,"complete"),nt(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,nt(this,"complete"),nt(this,"abort"),na(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),na(this,!0)),_e.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Vp(this):this.bb())},t.bb=function(){Vp(this)};function Vp(a){if(a.h&&typeof o!="undefined"&&(!a.v[1]||pn(a)!=4||a.Z()!=2)){if(a.u&&pn(a)==4)rp(a.Ea,0,a);else if(nt(a,"readystatechange"),pn(a)==4){a.h=!1;try{const $=a.Z();e:switch($){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var f;if(!(f=c)){var m;if(m=$===0){var x=String(a.D).match(kp)[1]||null;!x&&l.self&&l.self.location&&(x=l.self.location.protocol.slice(0,-1)),m=!RE.test(x?x.toLowerCase():"")}f=m}if(f)nt(a,"complete"),nt(a,"success");else{a.m=6;try{var O=2<pn(a)?a.g.statusText:""}catch(le){O=""}a.l=O+" ["+a.Z()+"]",Op(a)}}finally{na(a)}}}}function na(a,c){if(a.g){bp(a);const f=a.g,m=a.v[0]?()=>{}:null;a.g=null,a.v=null,c||nt(a,"ready");try{f.onreadystatechange=m}catch(x){}}}function bp(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function pn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<pn(this)?this.g.status:-1}catch(a){return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch(a){return""}},t.Oa=function(a){if(this.g){var c=this.g.responseText;return a&&c.indexOf(a)==0&&(c=c.substring(a.length)),aE(c)}};function Mp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch(c){return null}}function xE(a){const c={};a=(a.g&&2<=pn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(w(a[m]))continue;var f=R(a[m]);const x=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const O=c[x]||[];c[x]=O,O.push(f)}E(c,function(m){return m.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function _s(a,c,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||c}function Fp(a){this.Aa=0,this.i=[],this.j=new ds,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=_s("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=_s("baseRetryDelayMs",5e3,a),this.cb=_s("retryDelaySeedMs",1e4,a),this.Wa=_s("forwardChannelMaxRetries",2,a),this.wa=_s("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new _p(a&&a.concurrentRequestLimit),this.Da=new CE,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Fp.prototype,t.la=8,t.G=1,t.connect=function(a,c,f,m){rt(0),this.W=a,this.H=c||{},f&&m!==void 0&&(this.H.OSID=f,this.H.OAID=m),this.F=this.X,this.I=Kp(this,null,this.W),ia(this)};function Uu(a){if(jp(a),a.G==3){var c=a.U++,f=fn(a.I);if(ce(f,"SID",a.K),ce(f,"RID",c),ce(f,"TYPE","terminate"),ws(a,f),c=new On(a,a.j,c),c.L=2,c.v=Zo(fn(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(c.v.toString(),"")}catch(m){}!f&&l.Image&&(new Image().src=c.v,f=!0),f||(c.g=Gp(c.j,null),c.g.ea(c.v)),c.F=Date.now(),Yo(c)}Wp(a)}function ra(a){a.g&&(Bu(a),a.g.cancel(),a.g=null)}function jp(a){ra(a),a.u&&(l.clearTimeout(a.u),a.u=null),sa(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function ia(a){if(!wp(a.h)&&!a.s){a.s=!0;var c=a.Ga;ln||J(),B||(ln(),B=!0),G.add(c,a),a.B=0}}function NE(a,c){return Ep(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=c.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=hs(g(a.Ga,a,c),Hp(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const x=new On(this,this.j,a);let O=this.o;if(this.S&&(O?(O=v(O),T(O,this.S)):O=this.S),this.m!==null||this.O||(x.H=O,O=null),this.P)e:{for(var c=0,f=0;f<this.i.length;f++){t:{var m=this.i[f];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break t}m=void 0}if(m===void 0)break;if(c+=m,4096<c){c=f;break e}if(c===4096||f===this.i.length-1){c=f+1;break e}}c=1e3}else c=1e3;c=$p(this,x,c),f=fn(this.I),ce(f,"RID",a),ce(f,"CVER",22),this.D&&ce(f,"X-HTTP-Session-Id",this.D),ws(this,f),O&&(this.O?c="headers="+encodeURIComponent(String(Dp(O)))+"&"+c:this.m&&ju(f,this.m,O)),Fu(this.h,x),this.Ua&&ce(f,"TYPE","init"),this.P?(ce(f,"$req",c),ce(f,"SID","null"),x.T=!0,Ou(x,f,null)):Ou(x,f,c),this.G=2}}else this.G==3&&(a?Up(this,a):this.i.length==0||wp(this.h)||Up(this))};function Up(a,c){var f;c?f=c.l:f=a.U++;const m=fn(a.I);ce(m,"SID",a.K),ce(m,"RID",f),ce(m,"AID",a.T),ws(a,m),a.m&&a.o&&ju(m,a.m,a.o),f=new On(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),c&&(a.i=c.D.concat(a.i)),c=$p(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Fu(a.h,f),Ou(f,m,c)}function ws(a,c){a.H&&F(a.H,function(f,m){ce(c,m,f)}),a.l&&Sp({},function(f,m){ce(c,m,f)})}function $p(a,c,f){f=Math.min(a.i.length,f);var m=a.l?g(a.l.Na,a.l,a):null;e:{var x=a.i;let O=-1;for(;;){const $=["count="+f];O==-1?0<f?(O=x[0].g,$.push("ofs="+O)):O=0:$.push("ofs="+O);let le=!0;for(let Me=0;Me<f;Me++){let ie=x[Me].g;const He=x[Me].map;if(ie-=O,0>ie)O=Math.max(0,x[Me].g-100),le=!1;else try{AE(He,$,"req"+ie+"_")}catch(We){m&&m(He)}}if(le){m=$.join("&");break e}}}return a=a.i.splice(0,f),c.D=a,m}function Bp(a){if(!a.g&&!a.u){a.Y=1;var c=a.Fa;ln||J(),B||(ln(),B=!0),G.add(c,a),a.v=0}}function $u(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=hs(g(a.Fa,a),Hp(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,zp(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=hs(g(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,rt(10),ra(this),zp(this))};function Bu(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function zp(a){a.g=new On(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var c=fn(a.qa);ce(c,"RID","rpc"),ce(c,"SID",a.K),ce(c,"AID",a.T),ce(c,"CI",a.F?"0":"1"),!a.F&&a.ja&&ce(c,"TO",a.ja),ce(c,"TYPE","xmlhttp"),ws(a,c),a.m&&a.o&&ju(c,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=Zo(fn(c)),f.m=null,f.P=!0,gp(f,a)}t.Za=function(){this.C!=null&&(this.C=null,ra(this),$u(this),rt(19))};function sa(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function qp(a,c){var f=null;if(a.g==c){sa(a),Bu(a),a.g=null;var m=2}else if(Mu(a.h,c))f=c.D,Ip(a.h,c),m=1;else return;if(a.G!=0){if(c.o)if(m==1){f=c.m?c.m.length:0,c=Date.now()-c.F;var x=a.B;m=Ko(),nt(m,new dp(m,f)),ia(a)}else Bp(a);else if(x=c.s,x==3||x==0&&0<c.X||!(m==1&&NE(a,c)||m==2&&$u(a)))switch(f&&0<f.length&&(c=a.h,c.i=c.i.concat(f)),x){case 1:Cr(a,5);break;case 4:Cr(a,10);break;case 3:Cr(a,6);break;default:Cr(a,2)}}}function Hp(a,c){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*c}function Cr(a,c){if(a.j.info("Error code "+c),c==2){var f=g(a.fb,a),m=a.Xa;const x=!m;m=new kr(m||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Jo(m,"https"),Zo(m),x?SE(m.toString(),f):kE(m.toString(),f)}else rt(2);a.G=0,a.l&&a.l.sa(c),Wp(a),jp(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),rt(2)):(this.j.info("Failed to ping google.com"),rt(1))};function Wp(a){if(a.G=0,a.ka=[],a.l){const c=Tp(a.h);(c.length!=0||a.i.length!=0)&&(L(a.ka,c),L(a.ka,a.i),a.h.i.length=0,N(a.i),a.i.length=0),a.l.ra()}}function Kp(a,c,f){var m=f instanceof kr?fn(f):new kr(f);if(m.g!="")c&&(m.g=c+"."+m.g),Xo(m,m.s);else{var x=l.location;m=x.protocol,c=c?c+"."+x.hostname:x.hostname,x=+x.port;var O=new kr(null);m&&Jo(O,m),c&&(O.g=c),x&&Xo(O,x),f&&(O.l=f),m=O}return f=a.D,c=a.ya,f&&c&&ce(m,f,c),ce(m,"VER",a.la),ws(a,m),m}function Gp(a,c,f){if(c&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=a.Ca&&!a.pa?new _e(new ea({eb:f})):new _e(a.pa),c.Ha(a.J),c}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Qp(){}t=Qp.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function oa(){}oa.prototype.g=function(a,c){return new yt(a,c)};function yt(a,c){qe.call(this),this.g=new Fp(c),this.l=a,this.h=c&&c.messageUrlParams||null,a=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(a?a["X-WebChannel-Content-Type"]=c.messageContentType:a={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(a?a["X-WebChannel-Client-Profile"]=c.va:a={"X-WebChannel-Client-Profile":c.va}),this.g.S=a,(a=c&&c.Sb)&&!w(a)&&(this.g.m=a),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!w(c)&&(this.g.D=c,a=this.h,a!==null&&c in a&&(a=this.h,c in a&&delete a[c])),this.j=new si(this)}A(yt,qe),yt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},yt.prototype.close=function(){Uu(this.g)},yt.prototype.o=function(a){var c=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=Ru(a),a=f);c.i.push(new pE(c.Ya++,a)),c.G==3&&ia(c)},yt.prototype.N=function(){this.g.l=null,delete this.j,Uu(this.g),delete this.g,yt.aa.N.call(this)};function Yp(a){xu.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var c=a.__sm__;if(c){e:{for(const f in c){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,c=c!==null&&a in c?c[a]:void 0),this.data=c}else this.data=a}A(Yp,xu);function Jp(){Nu.call(this),this.status=1}A(Jp,Nu);function si(a){this.g=a}A(si,Qp),si.prototype.ua=function(){nt(this.g,"a")},si.prototype.ta=function(a){nt(this.g,new Yp(a))},si.prototype.sa=function(a){nt(this.g,new Jp)},si.prototype.ra=function(){nt(this.g,"b")},oa.prototype.createWebChannel=oa.prototype.g,yt.prototype.send=yt.prototype.o,yt.prototype.open=yt.prototype.m,yt.prototype.close=yt.prototype.close,mw=function(){return new oa},pw=function(){return Ko()},fw=Tr,Fh={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Go.NO_ERROR=0,Go.TIMEOUT=8,Go.HTTP_ERROR=6,Wa=Go,fp.COMPLETE="complete",dw=fp,lp.EventType=us,us.OPEN="a",us.CLOSE="b",us.ERROR="c",us.MESSAGE="d",qe.prototype.listen=qe.prototype.K,Os=lp,_e.prototype.listenOnce=_e.prototype.L,_e.prototype.getLastError=_e.prototype.Ka,_e.prototype.getLastErrorCode=_e.prototype.Ba,_e.prototype.getStatus=_e.prototype.Z,_e.prototype.getResponseJson=_e.prototype.Oa,_e.prototype.getResponseText=_e.prototype.oa,_e.prototype.send=_e.prototype.ea,_e.prototype.setWithCredentials=_e.prototype.Ha,hw=_e}).apply(typeof Ca!="undefined"?Ca:typeof self!="undefined"?self:typeof window!="undefined"?window:{});const Hg="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ye.UNAUTHENTICATED=new Ye(null),Ye.GOOGLE_CREDENTIALS=new Ye("google-credentials-uid"),Ye.FIRST_PARTY=new Ye("first-party-uid"),Ye.MOCK_USER=new Ye("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let is="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wr=new ru("@firebase/firestore");function Ps(){return Wr.logLevel}function H(t,...e){if(Wr.logLevel<=Z.DEBUG){const n=e.map(gf);Wr.debug(`Firestore (${is}): ${t}`,...n)}}function Dn(t,...e){if(Wr.logLevel<=Z.ERROR){const n=e.map(gf);Wr.error(`Firestore (${is}): ${t}`,...n)}}function zi(t,...e){if(Wr.logLevel<=Z.WARN){const n=e.map(gf);Wr.warn(`Firestore (${is}): ${t}`,...n)}}function gf(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch(e){return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(t="Unexpected state"){const e=`FIRESTORE (${is}) INTERNAL ASSERTION FAILED: `+t;throw Dn(e),new Error(e)}function Ee(t,e){t||Y()}function te(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class q extends Gt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gw{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class GA{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Ye.UNAUTHENTICATED))}shutdown(){}}class QA{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class YA{constructor(e){this.t=e,this.currentUser=Ye.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Ee(this.o===void 0);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new cr;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new cr,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},l=u=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new cr)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Ee(typeof r.accessToken=="string"),new gw(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ee(e===null||typeof e=="string"),new Ye(e)}}class JA{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=Ye.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class XA{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new JA(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(Ye.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ZA{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class eR{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){Ee(this.o===void 0);const r=s=>{s.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,H("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Ee(typeof n.token=="string"),this.R=n.token,new ZA(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tR(t){const e=typeof self!="undefined"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=tR(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%e.length))}return r}}function se(t,e){return t<e?-1:t>e?1:0}function qi(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new q(U.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new q(U.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new q(U.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new q(U.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return be.fromMillis(Date.now())}static fromDate(e){return be.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new be(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?se(this.nanoseconds,e.nanoseconds):se(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Q(e)}static min(){return new Q(new be(0,0))}static max(){return new Q(new be(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{constructor(e,n,r){n===void 0?n=0:n>e.length&&Y(),r===void 0?r=e.length-n:r>e.length-n&&Y(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return So.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof So?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=e.get(i),o=n.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class de extends So{construct(e,n,r){return new de(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new q(U.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new de(n)}static emptyPath(){return new de([])}}const nR=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ze extends So{construct(e,n,r){return new Ze(e,n,r)}static isValidIdentifier(e){return nR.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ze.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ze(["__name__"])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new q(U.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new q(U.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new q(U.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(r+=l,i++):(s(),i++)}if(s(),o)throw new q(U.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ze(n)}static emptyPath(){return new Ze([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(de.fromString(e))}static fromName(e){return new W(de.fromString(e).popFirst(5))}static empty(){return new W(de.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&de.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return de.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new de(e.slice()))}}function rR(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=Q.fromTimestamp(r===1e9?new be(n+1,0):new be(n,r));return new mr(i,W.empty(),e)}function iR(t){return new mr(t.readTime,t.key,-1)}class mr{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new mr(Q.min(),W.empty(),-1)}static max(){return new mr(Q.max(),W.empty(),-1)}}function sR(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=W.comparator(t.documentKey,e.documentKey),n!==0?n:se(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oR="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class aR{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yf(t){if(t.code!==U.FAILED_PRECONDITION||t.message!==oR)throw t;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Y(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new M((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof M?n:M.resolve(n)}catch(n){return M.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):M.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):M.reject(n)}static resolve(e){return new M((n,r)=>{n(e)})}static reject(e){return new M((n,r)=>{r(e)})}static waitFor(e){return new M((n,r)=>{let i=0,s=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=M.resolve(!1);for(const r of e)n=n.next(i=>i?M.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new M((r,i)=>{const s=e.length,o=new Array(s);let l=0;for(let u=0;u<s;u++){const h=u;n(e[h]).next(d=>{o[h]=d,++l,l===s&&r(o)},d=>i(d))}})}static doWhile(e,n){return new M((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function lR(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Fo(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vf{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}vf.oe=-1;function au(t){return t==null}function Pl(t){return t===0&&1/t==-1/0}function uR(t){return typeof t=="number"&&Number.isInteger(t)&&!Pl(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wg(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function jo(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function vw(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e,n){this.comparator=e,this.root=n||je.EMPTY}insert(e,n){return new Ce(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,je.BLACK,null,null))}remove(e){return new Ce(this.comparator,this.root.remove(e,this.comparator).copy(null,null,je.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Aa(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Aa(this.root,e,this.comparator,!1)}getReverseIterator(){return new Aa(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Aa(this.root,e,this.comparator,!0)}}class Aa{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class je{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r!=null?r:je.RED,this.left=i!=null?i:je.EMPTY,this.right=s!=null?s:je.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new je(e!=null?e:this.key,n!=null?n:this.value,r!=null?r:this.color,i!=null?i:this.left,s!=null?s:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return je.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return je.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,je.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,je.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Y();const e=this.left.check();if(e!==this.right.check())throw Y();return e+(this.isRed()?0:1)}}je.EMPTY=null,je.RED=!0,je.BLACK=!1;je.EMPTY=new class{constructor(){this.size=0}get key(){throw Y()}get value(){throw Y()}get color(){throw Y()}get left(){throw Y()}get right(){throw Y()}copy(e,n,r,i,s){return this}insert(e,n,r){return new je(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e){this.comparator=e,this.data=new Ce(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Kg(this.data.getIterator())}getIteratorFrom(e){return new Kg(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof $e)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new $e(this.comparator);return n.data=e,n}}class Kg{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e){this.fields=e,e.sort(Ze.comparator)}static empty(){return new Yn([])}unionWith(e){let n=new $e(Ze.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Yn(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return qi(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _w extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException!="undefined"&&s instanceof DOMException?new _w("Invalid base64 string: "+s):s}}(e);return new ze(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new ze(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return se(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ze.EMPTY_BYTE_STRING=new ze("");const cR=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function gr(t){if(Ee(!!t),typeof t=="string"){let e=0;const n=cR.exec(t);if(Ee(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Te(t.seconds),nanos:Te(t.nanos)}}function Te(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Kr(t){return typeof t=="string"?ze.fromBase64String(t):ze.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _f(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function wf(t){const e=t.mapValue.fields.__previous_value__;return _f(e)?wf(e):e}function ko(t){const e=gr(t.mapValue.fields.__local_write_time__.timestampValue);return new be(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hR{constructor(e,n,r,i,s,o,l,u,h){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h}}class Co{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Co("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Co&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ra={mapValue:{}};function Gr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?_f(t)?4:fR(t)?9007199254740991:dR(t)?10:11:Y()}function on(t,e){if(t===e)return!0;const n=Gr(t);if(n!==Gr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return ko(t).isEqual(ko(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=gr(i.timestampValue),l=gr(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Kr(i.bytesValue).isEqual(Kr(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Te(i.geoPointValue.latitude)===Te(s.geoPointValue.latitude)&&Te(i.geoPointValue.longitude)===Te(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Te(i.integerValue)===Te(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Te(i.doubleValue),l=Te(s.doubleValue);return o===l?Pl(o)===Pl(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return qi(t.arrayValue.values||[],e.arrayValue.values||[],on);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},l=s.mapValue.fields||{};if(Wg(o)!==Wg(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!on(o[u],l[u])))return!1;return!0}(t,e);default:return Y()}}function Ao(t,e){return(t.values||[]).find(n=>on(n,e))!==void 0}function Hi(t,e){if(t===e)return 0;const n=Gr(t),r=Gr(e);if(n!==r)return se(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return se(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Te(s.integerValue||s.doubleValue),u=Te(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return Gg(t.timestampValue,e.timestampValue);case 4:return Gg(ko(t),ko(e));case 5:return se(t.stringValue,e.stringValue);case 6:return function(s,o){const l=Kr(s),u=Kr(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),u=o.split("/");for(let h=0;h<l.length&&h<u.length;h++){const d=se(l[h],u[h]);if(d!==0)return d}return se(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=se(Te(s.latitude),Te(o.latitude));return l!==0?l:se(Te(s.longitude),Te(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Qg(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,u,h,d;const p=s.fields||{},g=o.fields||{},S=(l=p.value)===null||l===void 0?void 0:l.arrayValue,A=(u=g.value)===null||u===void 0?void 0:u.arrayValue,N=se(((h=S==null?void 0:S.values)===null||h===void 0?void 0:h.length)||0,((d=A==null?void 0:A.values)===null||d===void 0?void 0:d.length)||0);return N!==0?N:Qg(S,A)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===Ra.mapValue&&o===Ra.mapValue)return 0;if(s===Ra.mapValue)return 1;if(o===Ra.mapValue)return-1;const l=s.fields||{},u=Object.keys(l),h=o.fields||{},d=Object.keys(h);u.sort(),d.sort();for(let p=0;p<u.length&&p<d.length;++p){const g=se(u[p],d[p]);if(g!==0)return g;const S=Hi(l[u[p]],h[d[p]]);if(S!==0)return S}return se(u.length,d.length)}(t.mapValue,e.mapValue);default:throw Y()}}function Gg(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return se(t,e);const n=gr(t),r=gr(e),i=se(n.seconds,r.seconds);return i!==0?i:se(n.nanos,r.nanos)}function Qg(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=Hi(n[i],r[i]);if(s)return s}return se(n.length,r.length)}function Wi(t){return jh(t)}function jh(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=gr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Kr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return W.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=jh(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${jh(n.fields[o])}`;return i+"}"}(t.mapValue):Y()}function Yg(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function Uh(t){return!!t&&"integerValue"in t}function Ef(t){return!!t&&"arrayValue"in t}function Jg(t){return!!t&&"nullValue"in t}function Xg(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Sc(t){return!!t&&"mapValue"in t}function dR(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function Qs(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return jo(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Qs(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Qs(t.arrayValue.values[n]);return e}return Object.assign({},t)}function fR(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xt{constructor(e){this.value=e}static empty(){return new Xt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Sc(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Qs(n)}setAll(e){let n=Ze.emptyPath(),r={},i=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=l.popLast()}o?r[l.lastSegment()]=Qs(o):i.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Sc(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return on(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Sc(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){jo(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new Xt(Qs(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e,n,r,i,s,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Xe(e,0,Q.min(),Q.min(),Q.min(),Xt.empty(),0)}static newFoundDocument(e,n,r,i){return new Xe(e,1,n,Q.min(),r,i,0)}static newNoDocument(e,n){return new Xe(e,2,n,Q.min(),Q.min(),Xt.empty(),0)}static newUnknownDocument(e,n){return new Xe(e,3,n,Q.min(),Q.min(),Xt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Xt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Xt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Xe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Xe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xl{constructor(e,n){this.position=e,this.inclusive=n}}function Zg(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=W.comparator(W.fromName(o.referenceValue),n.key):r=Hi(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function ey(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!on(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl{constructor(e,n="asc"){this.field=e,this.dir=n}}function pR(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ww{}class Pe extends ww{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new gR(e,n,r):n==="array-contains"?new _R(e,r):n==="in"?new wR(e,r):n==="not-in"?new ER(e,r):n==="array-contains-any"?new IR(e,r):new Pe(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new yR(e,r):new vR(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Hi(n,this.value)):n!==null&&Gr(this.value)===Gr(n)&&this.matchesComparison(Hi(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Y()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Kt extends ww{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new Kt(e,n)}matches(e){return Ew(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Ew(t){return t.op==="and"}function Iw(t){return mR(t)&&Ew(t)}function mR(t){for(const e of t.filters)if(e instanceof Kt)return!1;return!0}function $h(t){if(t instanceof Pe)return t.field.canonicalString()+t.op.toString()+Wi(t.value);if(Iw(t))return t.filters.map(e=>$h(e)).join(",");{const e=t.filters.map(n=>$h(n)).join(",");return`${t.op}(${e})`}}function Tw(t,e){return t instanceof Pe?function(r,i){return i instanceof Pe&&r.op===i.op&&r.field.isEqual(i.field)&&on(r.value,i.value)}(t,e):t instanceof Kt?function(r,i){return i instanceof Kt&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,l)=>s&&Tw(o,i.filters[l]),!0):!1}(t,e):void Y()}function Sw(t){return t instanceof Pe?function(n){return`${n.field.canonicalString()} ${n.op} ${Wi(n.value)}`}(t):t instanceof Kt?function(n){return n.op.toString()+" {"+n.getFilters().map(Sw).join(" ,")+"}"}(t):"Filter"}class gR extends Pe{constructor(e,n,r){super(e,n,r),this.key=W.fromName(r.referenceValue)}matches(e){const n=W.comparator(e.key,this.key);return this.matchesComparison(n)}}class yR extends Pe{constructor(e,n){super(e,"in",n),this.keys=kw("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class vR extends Pe{constructor(e,n){super(e,"not-in",n),this.keys=kw("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function kw(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>W.fromName(r.referenceValue))}class _R extends Pe{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Ef(n)&&Ao(n.arrayValue,this.value)}}class wR extends Pe{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Ao(this.value.arrayValue,n)}}class ER extends Pe{constructor(e,n){super(e,"not-in",n)}matches(e){if(Ao(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Ao(this.value.arrayValue,n)}}class IR extends Pe{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Ef(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>Ao(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TR{constructor(e,n=null,r=[],i=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=l,this.ue=null}}function ty(t,e=null,n=[],r=[],i=null,s=null,o=null){return new TR(t,e,n,r,i,s,o)}function If(t){const e=te(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>$h(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),au(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>Wi(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>Wi(r)).join(",")),e.ue=n}return e.ue}function Tf(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!pR(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Tw(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!ey(t.startAt,e.startAt)&&ey(t.endAt,e.endAt)}function Bh(t){return W.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(e,n=null,r=[],i=[],s=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function SR(t,e,n,r,i,s,o,l){return new Uo(t,e,n,r,i,s,o,l)}function Sf(t){return new Uo(t)}function ny(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function Cw(t){return t.collectionGroup!==null}function Ys(t){const e=te(t);if(e.ce===null){e.ce=[];const n=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new $e(Ze.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.ce.push(new Nl(s,r))}),n.has(Ze.keyField().canonicalString())||e.ce.push(new Nl(Ze.keyField(),r))}return e.ce}function rn(t){const e=te(t);return e.le||(e.le=kR(e,Ys(t))),e.le}function kR(t,e){if(t.limitType==="F")return ty(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Nl(i.field,s)});const n=t.endAt?new xl(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new xl(t.startAt.position,t.startAt.inclusive):null;return ty(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function zh(t,e){const n=t.filters.concat([e]);return new Uo(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function Dl(t,e,n){return new Uo(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function lu(t,e){return Tf(rn(t),rn(e))&&t.limitType===e.limitType}function Aw(t){return`${If(rn(t))}|lt:${t.limitType}`}function li(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>Sw(i)).join(", ")}]`),au(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>Wi(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>Wi(i)).join(",")),`Target(${r})`}(rn(t))}; limitType=${t.limitType})`}function uu(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):W.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of Ys(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,l,u){const h=Zg(o,l,u);return o.inclusive?h<=0:h<0}(r.startAt,Ys(r),i)||r.endAt&&!function(o,l,u){const h=Zg(o,l,u);return o.inclusive?h>=0:h>0}(r.endAt,Ys(r),i))}(t,e)}function CR(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function Rw(t){return(e,n)=>{let r=!1;for(const i of Ys(t)){const s=AR(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function AR(t,e,n){const r=t.field.isKeyField()?W.comparator(e.key,n.key):function(s,o,l){const u=o.data.field(s),h=l.data.field(s);return u!==null&&h!==null?Hi(u,h):Y()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return Y()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){jo(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return vw(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RR=new Ce(W.comparator);function yr(){return RR}const Pw=new Ce(W.comparator);function Vs(...t){let e=Pw;for(const n of t)e=e.insert(n.key,n);return e}function PR(t){let e=Pw;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function Lr(){return Js()}function xw(){return Js()}function Js(){return new ss(t=>t.toString(),(t,e)=>t.isEqual(e))}const xR=new $e(W.comparator);function ne(...t){let e=xR;for(const n of t)e=e.add(n);return e}const NR=new $e(se);function DR(){return NR}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kf(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Pl(e)?"-0":e}}function Nw(t){return{integerValue:""+t}}function LR(t,e){return uR(e)?Nw(e):kf(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{constructor(){this._=void 0}}function OR(t,e,n){return t instanceof qh?function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&_f(s)&&(s=wf(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(n,e):t instanceof Ll?Dw(t,e):t instanceof Ol?Lw(t,e):function(i,s){const o=bR(i,s),l=ry(o)+ry(i.Pe);return Uh(o)&&Uh(i.Pe)?Nw(l):kf(i.serializer,l)}(t,e)}function VR(t,e,n){return t instanceof Ll?Dw(t,e):t instanceof Ol?Lw(t,e):n}function bR(t,e){return t instanceof Hh?function(r){return Uh(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class qh extends cu{}class Ll extends cu{constructor(e){super(),this.elements=e}}function Dw(t,e){const n=Ow(e);for(const r of t.elements)n.some(i=>on(i,r))||n.push(r);return{arrayValue:{values:n}}}class Ol extends cu{constructor(e){super(),this.elements=e}}function Lw(t,e){let n=Ow(e);for(const r of t.elements)n=n.filter(i=>!on(i,r));return{arrayValue:{values:n}}}class Hh extends cu{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function ry(t){return Te(t.integerValue||t.doubleValue)}function Ow(t){return Ef(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function MR(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof Ll&&i instanceof Ll||r instanceof Ol&&i instanceof Ol?qi(r.elements,i.elements,on):r instanceof Hh&&i instanceof Hh?on(r.Pe,i.Pe):r instanceof qh&&i instanceof qh}(t.transform,e.transform)}class Ur{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Ur}static exists(e){return new Ur(void 0,e)}static updateTime(e){return new Ur(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Ka(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Cf{}function Vw(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new jR(t.key,Ur.none()):new Af(t.key,t.data,Ur.none());{const n=t.data,r=Xt.empty();let i=new $e(Ze.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new hu(t.key,r,new Yn(i.toArray()),Ur.none())}}function FR(t,e,n){t instanceof Af?function(i,s,o){const l=i.value.clone(),u=sy(i.fieldTransforms,s,o.transformResults);l.setAll(u),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof hu?function(i,s,o){if(!Ka(i.precondition,s))return void s.convertToUnknownDocument(o.version);const l=sy(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(bw(i)),u.setAll(l),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Xs(t,e,n,r){return t instanceof Af?function(s,o,l,u){if(!Ka(s.precondition,o))return l;const h=s.value.clone(),d=oy(s.fieldTransforms,u,o);return h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(t,e,n,r):t instanceof hu?function(s,o,l,u){if(!Ka(s.precondition,o))return l;const h=oy(s.fieldTransforms,u,o),d=o.data;return d.setAll(bw(s)),d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(p=>p.field))}(t,e,n,r):function(s,o,l){return Ka(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function iy(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&qi(r,i,(s,o)=>MR(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class Af extends Cf{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class hu extends Cf{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function bw(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function sy(t,e,n){const r=new Map;Ee(t.length===n.length);for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,l=e.data.field(s.field);r.set(s.field,VR(o,l,n[i]))}return r}function oy(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,OR(s,o,e))}return r}class jR extends Cf{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UR{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&FR(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=Xs(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=Xs(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=xw();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(i.key)?null:l;const u=Vw(o,l);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(Q.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),ne())}isEqual(e){return this.batchId===e.batchId&&qi(this.mutations,e.mutations,(n,r)=>iy(n,r))&&qi(this.baseMutations,e.baseMutations,(n,r)=>iy(n,r))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $R{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BR{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ae,ee;function Mw(t){if(t===void 0)return Dn("GRPC error has no .code"),U.UNKNOWN;switch(t){case Ae.OK:return U.OK;case Ae.CANCELLED:return U.CANCELLED;case Ae.UNKNOWN:return U.UNKNOWN;case Ae.DEADLINE_EXCEEDED:return U.DEADLINE_EXCEEDED;case Ae.RESOURCE_EXHAUSTED:return U.RESOURCE_EXHAUSTED;case Ae.INTERNAL:return U.INTERNAL;case Ae.UNAVAILABLE:return U.UNAVAILABLE;case Ae.UNAUTHENTICATED:return U.UNAUTHENTICATED;case Ae.INVALID_ARGUMENT:return U.INVALID_ARGUMENT;case Ae.NOT_FOUND:return U.NOT_FOUND;case Ae.ALREADY_EXISTS:return U.ALREADY_EXISTS;case Ae.PERMISSION_DENIED:return U.PERMISSION_DENIED;case Ae.FAILED_PRECONDITION:return U.FAILED_PRECONDITION;case Ae.ABORTED:return U.ABORTED;case Ae.OUT_OF_RANGE:return U.OUT_OF_RANGE;case Ae.UNIMPLEMENTED:return U.UNIMPLEMENTED;case Ae.DATA_LOSS:return U.DATA_LOSS;default:return Y()}}(ee=Ae||(Ae={}))[ee.OK=0]="OK",ee[ee.CANCELLED=1]="CANCELLED",ee[ee.UNKNOWN=2]="UNKNOWN",ee[ee.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ee[ee.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ee[ee.NOT_FOUND=5]="NOT_FOUND",ee[ee.ALREADY_EXISTS=6]="ALREADY_EXISTS",ee[ee.PERMISSION_DENIED=7]="PERMISSION_DENIED",ee[ee.UNAUTHENTICATED=16]="UNAUTHENTICATED",ee[ee.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ee[ee.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ee[ee.ABORTED=10]="ABORTED",ee[ee.OUT_OF_RANGE=11]="OUT_OF_RANGE",ee[ee.UNIMPLEMENTED=12]="UNIMPLEMENTED",ee[ee.INTERNAL=13]="INTERNAL",ee[ee.UNAVAILABLE=14]="UNAVAILABLE",ee[ee.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zR(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qR=new jr([4294967295,4294967295],0);function ay(t){const e=zR().encode(t),n=new cw;return n.update(e),new Uint8Array(n.digest())}function ly(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new jr([n,r],0),new jr([i,s],0)]}class Rf{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new bs(`Invalid padding: ${n}`);if(r<0)throw new bs(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new bs(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new bs(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=jr.fromNumber(this.Ie)}Ee(e,n,r){let i=e.add(n.multiply(jr.fromNumber(r)));return i.compare(qR)===1&&(i=new jr([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=ay(e),[r,i]=ly(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);if(!this.de(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Rf(s,i,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=ay(e),[r,i]=ly(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class bs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class du{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,$o.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new du(Q.min(),i,new Ce(se),yr(),ne())}}class $o{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new $o(r,n,ne(),ne(),ne())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(e,n,r,i){this.Re=e,this.removedTargetIds=n,this.key=r,this.Ve=i}}class Fw{constructor(e,n){this.targetId=e,this.me=n}}class jw{constructor(e,n,r=ze.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class uy{constructor(){this.fe=0,this.ge=hy(),this.pe=ze.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ne(),n=ne(),r=ne();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:Y()}}),new $o(this.pe,this.ye,e,n,r)}Ce(){this.we=!1,this.ge=hy()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Ee(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class HR{constructor(e){this.Le=e,this.Be=new Map,this.ke=yr(),this.qe=cy(),this.Qe=new Ce(se)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const r=this.Ge(n);switch(e.state){case 0:this.ze(n)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),r.De(e.resumeToken));break;default:Y()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((r,i)=>{this.ze(i)&&n(i)})}He(e){const n=e.targetId,r=e.me.count,i=this.Je(n);if(i){const s=i.target;if(Bh(s))if(r===0){const o=new W(s.path);this.Ue(n,o,Xe.newNoDocument(o,Q.min()))}else Ee(r===1);else{const o=this.Ye(n);if(o!==r){const l=this.Ze(e),u=l?this.Xe(l,e,o):1;if(u!==0){this.je(n);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,h)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,l;try{o=Kr(r).toUint8Array()}catch(u){if(u instanceof _w)return zi("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new Rf(o,i,s)}catch(u){return zi(u instanceof bs?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.Ie===0?null:l}Xe(e,n,r){return n.me.count===r-this.nt(e,n.targetId)?0:2}nt(e,n){const r=this.Le.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,s,null),i++)}),i}rt(e){const n=new Map;this.Be.forEach((s,o)=>{const l=this.Je(o);if(l){if(s.current&&Bh(l.target)){const u=new W(l.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,Xe.newNoDocument(u,e))}s.be&&(n.set(o,s.ve()),s.Ce())}});let r=ne();this.qe.forEach((s,o)=>{let l=!0;o.forEachWhile(u=>{const h=this.Je(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const i=new du(e,n,this.Qe,this.ke,r);return this.ke=yr(),this.qe=cy(),this.Qe=new Ce(se),i}$e(e,n){if(!this.ze(e))return;const r=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,r),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,r){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,n)?i.Fe(n,1):i.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),r&&(this.ke=this.ke.insert(n,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new uy,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new $e(se),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||H("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new uy),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function cy(){return new Ce(W.comparator)}function hy(){return new Ce(W.comparator)}const WR={asc:"ASCENDING",desc:"DESCENDING"},KR={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},GR={and:"AND",or:"OR"};class QR{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Wh(t,e){return t.useProto3Json||au(e)?e:{value:e}}function Kh(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Uw(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Oi(t){return Ee(!!t),Q.fromTimestamp(function(n){const r=gr(n);return new be(r.seconds,r.nanos)}(t))}function $w(t,e){return Gh(t,e).canonicalString()}function Gh(t,e){const n=function(i){return new de(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function Bw(t){const e=de.fromString(t);return Ee(Kw(e)),e}function kc(t,e){const n=Bw(e);if(n.get(1)!==t.databaseId.projectId)throw new q(U.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new q(U.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new W(qw(n))}function zw(t,e){return $w(t.databaseId,e)}function YR(t){const e=Bw(t);return e.length===4?de.emptyPath():qw(e)}function dy(t){return new de(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function qw(t){return Ee(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function JR(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:Y()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(h,d){return h.useProto3Json?(Ee(d===void 0||typeof d=="string"),ze.fromBase64String(d||"")):(Ee(d===void 0||d instanceof Buffer||d instanceof Uint8Array),ze.fromUint8Array(d||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const d=h.code===void 0?U.UNKNOWN:Mw(h.code);return new q(d,h.message||"")}(o);n=new jw(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=kc(t,r.document.name),s=Oi(r.document.updateTime),o=r.document.createTime?Oi(r.document.createTime):Q.min(),l=new Xt({mapValue:{fields:r.document.fields}}),u=Xe.newFoundDocument(i,s,o,l),h=r.targetIds||[],d=r.removedTargetIds||[];n=new Ga(h,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=kc(t,r.document),s=r.readTime?Oi(r.readTime):Q.min(),o=Xe.newNoDocument(i,s),l=r.removedTargetIds||[];n=new Ga([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=kc(t,r.document),s=r.removedTargetIds||[];n=new Ga([],s,i,null)}else{if(!("filter"in e))return Y();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new BR(i,s),l=r.targetId;n=new Fw(l,o)}}return n}function XR(t,e){return{documents:[zw(t,e.path)]}}function ZR(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=zw(t,i);const s=function(h){if(h.length!==0)return Ww(Kt.create(h,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(h){if(h.length!==0)return h.map(d=>function(g){return{field:ui(g.field),direction:nP(g.dir)}}(d))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Wh(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:n,parent:i}}function eP(t){let e=YR(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){Ee(r===1);const d=n.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let s=[];n.where&&(s=function(p){const g=Hw(p);return g instanceof Kt&&Iw(g)?g.getFilters():[g]}(n.where));let o=[];n.orderBy&&(o=function(p){return p.map(g=>function(A){return new Nl(ci(A.field),function(L){switch(L){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(A.direction))}(g))}(n.orderBy));let l=null;n.limit&&(l=function(p){let g;return g=typeof p=="object"?p.value:p,au(g)?null:g}(n.limit));let u=null;n.startAt&&(u=function(p){const g=!!p.before,S=p.values||[];return new xl(S,g)}(n.startAt));let h=null;return n.endAt&&(h=function(p){const g=!p.before,S=p.values||[];return new xl(S,g)}(n.endAt)),SR(e,i,o,s,l,"F",u,h)}function tP(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function Hw(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=ci(n.unaryFilter.field);return Pe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=ci(n.unaryFilter.field);return Pe.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=ci(n.unaryFilter.field);return Pe.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ci(n.unaryFilter.field);return Pe.create(o,"!=",{nullValue:"NULL_VALUE"});default:return Y()}}(t):t.fieldFilter!==void 0?function(n){return Pe.create(ci(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Y()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return Kt.create(n.compositeFilter.filters.map(r=>Hw(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return Y()}}(n.compositeFilter.op))}(t):Y()}function nP(t){return WR[t]}function rP(t){return KR[t]}function iP(t){return GR[t]}function ui(t){return{fieldPath:t.canonicalString()}}function ci(t){return Ze.fromServerFormat(t.fieldPath)}function Ww(t){return t instanceof Pe?function(n){if(n.op==="=="){if(Xg(n.value))return{unaryFilter:{field:ui(n.field),op:"IS_NAN"}};if(Jg(n.value))return{unaryFilter:{field:ui(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Xg(n.value))return{unaryFilter:{field:ui(n.field),op:"IS_NOT_NAN"}};if(Jg(n.value))return{unaryFilter:{field:ui(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ui(n.field),op:rP(n.op),value:n.value}}}(t):t instanceof Kt?function(n){const r=n.getFilters().map(i=>Ww(i));return r.length===1?r[0]:{compositeFilter:{op:iP(n.op),filters:r}}}(t):Y()}function Kw(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn{constructor(e,n,r,i,s=Q.min(),o=Q.min(),l=ze.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new Jn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Jn(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Jn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Jn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sP{constructor(e){this.ct=e}}function oP(t){const e=eP({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Dl(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aP{constructor(){this.un=new lP}addToCollectionParentIndex(e,n){return this.un.add(n),M.resolve()}getCollectionParents(e,n){return M.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return M.resolve()}deleteFieldIndex(e,n){return M.resolve()}deleteAllFieldIndexes(e){return M.resolve()}createTargetIndexes(e,n){return M.resolve()}getDocumentsMatchingTarget(e,n){return M.resolve(null)}getIndexType(e,n){return M.resolve(0)}getFieldIndexes(e,n){return M.resolve([])}getNextCollectionGroupToUpdate(e){return M.resolve(null)}getMinOffset(e,n){return M.resolve(mr.min())}getMinOffsetFromCollectionGroup(e,n){return M.resolve(mr.min())}updateCollectionGroup(e,n,r){return M.resolve()}updateIndexEntries(e,n){return M.resolve()}}class lP{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new $e(de.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new $e(de.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ki(0)}static kn(){return new Ki(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uP{constructor(){this.changes=new ss(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Xe.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?M.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cP{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hP{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&Xs(r.mutation,i,Yn.empty(),be.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,ne()).next(()=>r))}getLocalViewOfDocuments(e,n,r=ne()){const i=Lr();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=Vs();return s.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=Lr();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,ne()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,i){let s=yr();const o=Js(),l=function(){return Js()}();return n.forEach((u,h)=>{const d=r.get(h.key);i.has(h.key)&&(d===void 0||d.mutation instanceof hu)?s=s.insert(h.key,h):d!==void 0?(o.set(h.key,d.mutation.getFieldMask()),Xs(d.mutation,h,d.mutation.getFieldMask(),be.now())):o.set(h.key,Yn.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((h,d)=>o.set(h,d)),n.forEach((h,d)=>{var p;return l.set(h,new cP(d,(p=o.get(h))!==null&&p!==void 0?p:null))}),l))}recalculateAndSaveOverlays(e,n){const r=Js();let i=new Ce((o,l)=>o-l),s=ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const h=n.get(u);if(h===null)return;let d=r.get(u)||Yn.empty();d=l.applyToLocalView(h,d),r.set(u,d);const p=(i.get(l.batchId)||ne()).add(u);i=i.insert(l.batchId,p)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,d=u.value,p=xw();d.forEach(g=>{if(!s.has(g)){const S=Vw(n.get(g),r.get(g));S!==null&&p.set(g,S),s=s.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,p))}return M.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):Cw(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):M.resolve(Lr());let l=-1,u=s;return o.next(h=>M.forEach(h,(d,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),s.get(d)?M.resolve():this.remoteDocumentCache.getEntry(e,d).next(g=>{u=u.insert(d,g)}))).next(()=>this.populateOverlays(e,h,s)).next(()=>this.computeViews(e,u,h,ne())).next(d=>({batchId:l,changes:PR(d)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new W(n)).next(r=>{let i=Vs();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=Vs();return this.indexManager.getCollectionParents(e,s).next(l=>M.forEach(l,u=>{const h=function(p,g){return new Uo(g,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,h,r,i).next(d=>{d.forEach((p,g)=>{o=o.insert(p,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,h)=>{const d=h.getKey();o.get(d)===null&&(o=o.insert(d,Xe.newInvalidDocument(d)))});let l=Vs();return o.forEach((u,h)=>{const d=s.get(u);d!==void 0&&Xs(d.mutation,h,Yn.empty(),be.now()),uu(n,h)&&(l=l.insert(u,h))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dP{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return M.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:Oi(i.createTime)}}(n)),M.resolve()}getNamedQuery(e,n){return M.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(i){return{name:i.name,query:oP(i.bundledQuery),readTime:Oi(i.readTime)}}(n)),M.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fP{constructor(){this.overlays=new Ce(W.comparator),this.Ir=new Map}getOverlay(e,n){return M.resolve(this.overlays.get(n))}getOverlays(e,n){const r=Lr();return M.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.ht(e,n,s)}),M.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),M.resolve()}getOverlaysForCollection(e,n,r){const i=Lr(),s=n.length+1,o=new W(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return M.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new Ce((h,d)=>h-d);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let d=s.get(h.largestBatchId);d===null&&(d=Lr(),s=s.insert(h.largestBatchId,d)),d.set(h.getKey(),h)}}const l=Lr(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,d)=>l.set(h,d)),!(l.size()>=i)););return M.resolve(l)}ht(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new $R(n,r));let s=this.Ir.get(n);s===void 0&&(s=ne(),this.Ir.set(n,s)),this.Ir.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pP{constructor(){this.sessionToken=ze.EMPTY_BYTE_STRING}getSessionToken(e){return M.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,M.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{constructor(){this.Tr=new $e(De.Er),this.dr=new $e(De.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const r=new De(e,n);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Vr(new De(e,n))}mr(e,n){e.forEach(r=>this.removeReference(r,n))}gr(e){const n=new W(new de([])),r=new De(n,e),i=new De(n,e+1),s=[];return this.dr.forEachInRange([r,i],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new W(new de([])),r=new De(n,e),i=new De(n,e+1);let s=ne();return this.dr.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new De(e,0),r=this.Tr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class De{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return W.comparator(e.key,n.key)||se(e.wr,n.wr)}static Ar(e,n){return se(e.wr,n.wr)||W.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mP{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new $e(De.Er)}checkEmpty(e){return M.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new UR(s,n,r,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new De(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return M.resolve(o)}lookupMutationBatch(e,n){return M.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.vr(r),s=i<0?0:i;return M.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return M.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return M.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new De(n,0),i=new De(n,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],o=>{const l=this.Dr(o.wr);s.push(l)}),M.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new $e(se);return n.forEach(i=>{const s=new De(i,0),o=new De(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],l=>{r=r.add(l.wr)})}),M.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;W.isDocumentKey(s)||(s=s.child(""));const o=new De(new W(s),0);let l=new $e(se);return this.br.forEachWhile(u=>{const h=u.key.path;return!!r.isPrefixOf(h)&&(h.length===i&&(l=l.add(u.wr)),!0)},o),M.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){Ee(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return M.forEach(n.mutations,i=>{const s=new De(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,n){const r=new De(n,0),i=this.br.firstAfterOrEqual(r);return M.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,M.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gP{constructor(e){this.Mr=e,this.docs=function(){return new Ce(W.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.Mr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return M.resolve(r?r.document.mutableCopy():Xe.newInvalidDocument(n))}getEntries(e,n){let r=yr();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Xe.newInvalidDocument(i))}),M.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=yr();const o=n.path,l=new W(o.child("")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:d}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||sR(iR(d),r)<=0||(i.has(d.key)||uu(n,d))&&(s=s.insert(d.key,d.mutableCopy()))}return M.resolve(s)}getAllFromCollectionGroup(e,n,r,i){Y()}Or(e,n){return M.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new yP(this)}getSize(e){return M.resolve(this.size)}}class yP extends uP{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),M.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vP{constructor(e){this.persistence=e,this.Nr=new ss(n=>If(n),Tf),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Pf,this.targetCount=0,this.kr=Ki.Bn()}forEachTarget(e,n){return this.Nr.forEach((r,i)=>n(i)),M.resolve()}getLastRemoteSnapshotVersion(e){return M.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return M.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),M.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Lr&&(this.Lr=n),M.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Ki(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,M.resolve()}updateTargetData(e,n){return this.Kn(n),M.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,M.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),M.waitFor(s).next(()=>i)}getTargetCount(e){return M.resolve(this.targetCount)}getTargetData(e,n){const r=this.Nr.get(n)||null;return M.resolve(r)}addMatchingKeys(e,n,r){return this.Br.Rr(n,r),M.resolve()}removeMatchingKeys(e,n,r){this.Br.mr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),M.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),M.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Br.yr(n);return M.resolve(r)}containsKey(e,n){return M.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _P{constructor(e,n){this.qr={},this.overlays={},this.Qr=new vf(0),this.Kr=!1,this.Kr=!0,this.$r=new pP,this.referenceDelegate=e(this),this.Ur=new vP(this),this.indexManager=new aP,this.remoteDocumentCache=function(i){return new gP(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new sP(n),this.Gr=new dP(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new fP,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.qr[e.toKey()];return r||(r=new mP(n,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,r){H("MemoryPersistence","Starting transaction:",e);const i=new wP(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,n){return M.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,n)))}}class wP extends aR{constructor(e){super(),this.currentSequenceNumber=e}}class xf{constructor(e){this.persistence=e,this.Jr=new Pf,this.Yr=null}static Zr(e){return new xf(e)}get Xr(){if(this.Yr)return this.Yr;throw Y()}addReference(e,n,r){return this.Jr.addReference(r,n),this.Xr.delete(r.toString()),M.resolve()}removeReference(e,n,r){return this.Jr.removeReference(r,n),this.Xr.add(r.toString()),M.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),M.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return M.forEach(this.Xr,r=>{const i=W.fromPath(r);return this.ei(e,i).next(s=>{s||n.removeEntry(i,Q.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(r=>{r?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return M.or([()=>M.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.$i=r,this.Ui=i}static Wi(e,n){let r=ne(),i=ne();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Nf(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EP{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IP{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return PS()?8:lR(tt())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.Yi(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new EP;return this.Xi(e,n,o).next(l=>{if(s.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>s.result)}es(e,n,r,i){return r.documentReadCount<this.ji?(Ps()<=Z.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",li(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),M.resolve()):(Ps()<=Z.DEBUG&&H("QueryEngine","Query:",li(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(Ps()<=Z.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",li(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,rn(n))):M.resolve())}Yi(e,n){if(ny(n))return M.resolve(null);let r=rn(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=Dl(n,null,"F"),r=rn(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=ne(...s);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const h=this.ts(n,l);return this.ns(n,h,o,u.readTime)?this.Yi(e,Dl(n,null,"F")):this.rs(e,h,n,u)}))})))}Zi(e,n,r,i){return ny(n)||i.isEqual(Q.min())?M.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const o=this.ts(n,s);return this.ns(n,o,r,i)?M.resolve(null):(Ps()<=Z.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),li(n)),this.rs(e,o,n,rR(i,-1)).next(l=>l))})}ts(e,n){let r=new $e(Rw(e));return n.forEach((i,s)=>{uu(e,s)&&(r=r.add(s))}),r}ns(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,n,r){return Ps()<=Z.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",li(n)),this.Ji.getDocumentsMatchingQuery(e,n,mr.min(),r)}rs(e,n,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TP{constructor(e,n,r,i){this.persistence=e,this.ss=n,this.serializer=i,this.os=new Ce(se),this._s=new ss(s=>If(s),Tf),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new hP(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function SP(t,e,n,r){return new TP(t,e,n,r)}async function Gw(t,e){const n=te(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.ls(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],l=[];let u=ne();for(const h of i){o.push(h.batchId);for(const d of h.mutations)u=u.add(d.key)}for(const h of s){l.push(h.batchId);for(const d of h.mutations)u=u.add(d.key)}return n.localDocuments.getDocuments(r,u).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:l}))})})}function Qw(t){const e=te(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function kP(t,e){const n=te(t),r=e.snapshotVersion;let i=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});i=n.os;const l=[];e.targetChanges.forEach((d,p)=>{const g=i.get(p);if(!g)return;l.push(n.Ur.removeMatchingKeys(s,d.removedDocuments,p).next(()=>n.Ur.addMatchingKeys(s,d.addedDocuments,p)));let S=g.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?S=S.withResumeToken(ze.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):d.resumeToken.approximateByteSize()>0&&(S=S.withResumeToken(d.resumeToken,r)),i=i.insert(p,S),function(N,L,I){return N.resumeToken.approximateByteSize()===0||L.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=3e8?!0:I.addedDocuments.size+I.modifiedDocuments.size+I.removedDocuments.size>0}(g,S,d)&&l.push(n.Ur.updateTargetData(s,S))});let u=yr(),h=ne();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,d))}),l.push(CP(s,o,e.documentUpdates).next(d=>{u=d.Ps,h=d.Is})),!r.isEqual(Q.min())){const d=n.Ur.getLastRemoteSnapshotVersion(s).next(p=>n.Ur.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(d)}return M.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,h)).next(()=>u)}).then(s=>(n.os=i,s))}function CP(t,e,n){let r=ne(),i=ne();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=yr();return n.forEach((l,u)=>{const h=s.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(Q.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):H("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)}),{Ps:o,Is:i}})}function AP(t,e){const n=te(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.Ur.getTargetData(r,e).next(s=>s?(i=s,M.resolve(i)):n.Ur.allocateTargetId(r).next(o=>(i=new Jn(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Ur.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.os.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.os=n.os.insert(r.targetId,r),n._s.set(e,r.targetId)),r})}async function Qh(t,e,n){const r=te(t),i=r.os.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Fo(o))throw o;H("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function fy(t,e,n){const r=te(t);let i=Q.min(),s=ne();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,d){const p=te(u),g=p._s.get(d);return g!==void 0?M.resolve(p.os.get(g)):p.Ur.getTargetData(h,d)}(r,o,rn(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(o,l.targetId).next(u=>{s=u})}).next(()=>r.ss.getDocumentsMatchingQuery(o,e,n?i:Q.min(),n?s:ne())).next(l=>(RP(r,CR(e),l),{documents:l,Ts:s})))}function RP(t,e,n){let r=t.us.get(e)||Q.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.us.set(e,r)}class py{constructor(){this.activeTargetIds=DR()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class PP{constructor(){this.so=new py,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,r){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new py,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xP{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class my{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window!="undefined"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Pa=null;function Cc(){return Pa===null?Pa=function(){return 268435456+Math.round(2147483648*Math.random())}():Pa++,"0x"+Pa.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NP={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DP{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="WebChannelConnection";class LP extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+n.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(n,r,i,s,o){const l=Cc(),u=this.xo(n,r.toUriEncodedString());H("RestConnection",`Sending RPC '${n}' ${l}:`,u,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,s,o),this.No(n,u,h,i).then(d=>(H("RestConnection",`Received RPC '${n}' ${l}: `,d),d),d=>{throw zi("RestConnection",`RPC '${n}' ${l} failed with error: `,d,"url: ",u,"request:",i),d})}Lo(n,r,i,s,o,l){return this.Mo(n,r,i,s,o)}Oo(n,r,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+is}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>n[o]=s),i&&i.headers.forEach((s,o)=>n[o]=s)}xo(n,r){const i=NP[n];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,r,i){const s=Cc();return new Promise((o,l)=>{const u=new hw;u.setWithCredentials(!0),u.listenOnce(dw.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case Wa.NO_ERROR:const d=u.getResponseJson();H(Qe,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(d)),o(d);break;case Wa.TIMEOUT:H(Qe,`RPC '${e}' ${s} timed out`),l(new q(U.DEADLINE_EXCEEDED,"Request time out"));break;case Wa.HTTP_ERROR:const p=u.getStatus();if(H(Qe,`RPC '${e}' ${s} failed with status:`,p,"response text:",u.getResponseText()),p>0){let g=u.getResponseJson();Array.isArray(g)&&(g=g[0]);const S=g==null?void 0:g.error;if(S&&S.status&&S.message){const A=function(L){const I=L.toLowerCase().replace(/_/g,"-");return Object.values(U).indexOf(I)>=0?I:U.UNKNOWN}(S.status);l(new q(A,S.message))}else l(new q(U.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new q(U.UNAVAILABLE,"Connection failed."));break;default:Y()}}finally{H(Qe,`RPC '${e}' ${s} completed.`)}});const h=JSON.stringify(i);H(Qe,`RPC '${e}' ${s} sending request:`,i),u.send(n,"POST",h,r,15)})}Bo(e,n,r){const i=Cc(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=mw(),l=pw(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const d=s.join("");H(Qe,`Creating RPC '${e}' stream ${i}: ${d}`,u);const p=o.createWebChannel(d,u);let g=!1,S=!1;const A=new DP({Io:L=>{S?H(Qe,`Not sending because RPC '${e}' stream ${i} is closed:`,L):(g||(H(Qe,`Opening RPC '${e}' stream ${i} transport.`),p.open(),g=!0),H(Qe,`RPC '${e}' stream ${i} sending:`,L),p.send(L))},To:()=>p.close()}),N=(L,I,w)=>{L.listen(I,k=>{try{w(k)}catch(P){setTimeout(()=>{throw P},0)}})};return N(p,Os.EventType.OPEN,()=>{S||(H(Qe,`RPC '${e}' stream ${i} transport opened.`),A.yo())}),N(p,Os.EventType.CLOSE,()=>{S||(S=!0,H(Qe,`RPC '${e}' stream ${i} transport closed`),A.So())}),N(p,Os.EventType.ERROR,L=>{S||(S=!0,zi(Qe,`RPC '${e}' stream ${i} transport errored:`,L),A.So(new q(U.UNAVAILABLE,"The operation could not be completed")))}),N(p,Os.EventType.MESSAGE,L=>{var I;if(!S){const w=L.data[0];Ee(!!w);const k=w,P=k.error||((I=k[0])===null||I===void 0?void 0:I.error);if(P){H(Qe,`RPC '${e}' stream ${i} received error:`,P);const V=P.status;let F=function(_){const T=Ae[_];if(T!==void 0)return Mw(T)}(V),E=P.message;F===void 0&&(F=U.INTERNAL,E="Unknown error status: "+V+" with message "+P.message),S=!0,A.So(new q(F,E)),p.close()}else H(Qe,`RPC '${e}' stream ${i} received:`,w),A.bo(w)}}),N(l,fw.STAT_EVENT,L=>{L.stat===Fh.PROXY?H(Qe,`RPC '${e}' stream ${i} detected buffering proxy`):L.stat===Fh.NOPROXY&&H(Qe,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{A.wo()},0),A}}function Ac(){return typeof document!="undefined"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fu(t){return new QR(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yw{constructor(e,n,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,n-r);i>0&&H("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OP{constructor(e,n,r,i,s,o,l,u){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Yw(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===U.RESOURCE_EXHAUSTED?(Dn(n.toString()),Dn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===U.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===n&&this.P_(r,i)},r=>{e(()=>{const i=new q(U.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,n){const r=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class VP extends OP{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=JR(this.serializer,e),r=function(s){if(!("targetChange"in s))return Q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Q.min():o.readTime?Oi(o.readTime):Q.min()}(e);return this.listener.d_(n,r)}A_(e){const n={};n.database=dy(this.serializer),n.addTarget=function(s,o){let l;const u=o.target;if(l=Bh(u)?{documents:XR(s,u)}:{query:ZR(s,u)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=Uw(s,o.resumeToken);const h=Wh(s,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(Q.min())>0){l.readTime=Kh(s,o.snapshotVersion.toTimestamp());const h=Wh(s,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const r=tP(this.serializer,e);r&&(n.labels=r),this.a_(n)}R_(e){const n={};n.database=dy(this.serializer),n.removeTarget=e,this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bP extends class{}{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new q(U.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,Gh(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===U.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new q(U.UNKNOWN,s.toString())})}Lo(e,n,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,Gh(n,r),i,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===U.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new q(U.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class MP{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Dn(n),this.D_=!1):H("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FP{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{r.enqueueAndForget(async()=>{zo(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(u){const h=te(u);h.L_.add(4),await Bo(h),h.q_.set("Unknown"),h.L_.delete(4),await pu(h)}(this))})}),this.q_=new MP(r,i)}}async function pu(t){if(zo(t))for(const e of t.B_)await e(!0)}async function Bo(t){for(const e of t.B_)await e(!1)}function Jw(t,e){const n=te(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),Vf(n)?Of(n):os(n).r_()&&Lf(n,e))}function Df(t,e){const n=te(t),r=os(n);n.N_.delete(e),r.r_()&&Xw(n,e),n.N_.size===0&&(r.r_()?r.o_():zo(n)&&n.q_.set("Unknown"))}function Lf(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Q.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}os(t).A_(e)}function Xw(t,e){t.Q_.xe(e),os(t).R_(e)}function Of(t){t.Q_=new HR({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),os(t).start(),t.q_.v_()}function Vf(t){return zo(t)&&!os(t).n_()&&t.N_.size>0}function zo(t){return te(t).L_.size===0}function Zw(t){t.Q_=void 0}async function jP(t){t.q_.set("Online")}async function UP(t){t.N_.forEach((e,n)=>{Lf(t,e)})}async function $P(t,e){Zw(t),Vf(t)?(t.q_.M_(e),Of(t)):t.q_.set("Unknown")}async function BP(t,e,n){if(t.q_.set("Online"),e instanceof jw&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const l of s.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(t,e)}catch(r){H("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await gy(t,r)}else if(e instanceof Ga?t.Q_.Ke(e):e instanceof Fw?t.Q_.He(e):t.Q_.We(e),!n.isEqual(Q.min()))try{const r=await Qw(t.localStore);n.compareTo(r)>=0&&await function(s,o){const l=s.Q_.rt(o);return l.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const d=s.N_.get(h);d&&s.N_.set(h,d.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,h)=>{const d=s.N_.get(u);if(!d)return;s.N_.set(u,d.withResumeToken(ze.EMPTY_BYTE_STRING,d.snapshotVersion)),Xw(s,u);const p=new Jn(d.target,u,h,d.sequenceNumber);Lf(s,p)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){H("RemoteStore","Failed to raise snapshot:",r),await gy(t,r)}}async function gy(t,e,n){if(!Fo(e))throw e;t.L_.add(1),await Bo(t),t.q_.set("Offline"),n||(n=()=>Qw(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await pu(t)})}async function yy(t,e){const n=te(t);n.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const r=zo(n);n.L_.add(3),await Bo(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await pu(n)}async function zP(t,e){const n=te(t);e?(n.L_.delete(2),await pu(n)):e||(n.L_.add(2),await Bo(n),n.q_.set("Unknown"))}function os(t){return t.K_||(t.K_=function(n,r,i){const s=te(n);return s.w_(),new VP(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:jP.bind(null,t),Ro:UP.bind(null,t),mo:$P.bind(null,t),d_:BP.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),Vf(t)?Of(t):t.q_.set("Unknown")):(await t.K_.stop(),Zw(t))})),t.K_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new cr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,l=new bf(e,n,o,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new q(U.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function e1(t,e){if(Dn("AsyncQueue",`${e}: ${t}`),Fo(t))return new q(U.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(e){this.comparator=e?(n,r)=>e(n,r)||W.comparator(n.key,r.key):(n,r)=>W.comparator(n.key,r.key),this.keyedMap=Vs(),this.sortedSet=new Ce(this.comparator)}static emptySet(e){return new Vi(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Vi)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new Vi;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(){this.W_=new Ce(W.comparator)}track(e){const n=e.doc.key,r=this.W_.get(n);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(n,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(n):e.type===1&&r.type===2?this.W_=this.W_.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):Y():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,r)=>{e.push(r)}),e}}class Gi{constructor(e,n,r,i,s,o,l,u,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Gi(e,n,Vi.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&lu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qP{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class HP{constructor(){this.queries=_y(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,r){const i=te(n),s=i.queries;i.queries=_y(),s.forEach((o,l)=>{for(const u of l.j_)u.onError(r)})})(this,new q(U.ABORTED,"Firestore shutting down"))}}function _y(){return new ss(t=>Aw(t),lu)}async function t1(t,e){const n=te(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new qP,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await n.onListen(i,!0);break;case 1:s.z_=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const l=e1(o,`Initialization of query '${li(e.query)}' failed`);return void e.onError(l)}n.queries.set(i,s),s.j_.push(e),e.Z_(n.onlineState),s.z_&&e.X_(s.z_)&&Mf(n)}async function n1(t,e){const n=te(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function WP(t,e){const n=te(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const l of o.j_)l.X_(i)&&(r=!0);o.z_=i}}r&&Mf(n)}function KP(t,e,n){const r=te(t),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(n);r.queries.delete(e)}function Mf(t){t.Y_.forEach(e=>{e.next()})}var Yh,wy;(wy=Yh||(Yh={})).ea="default",wy.Cache="cache";class r1{constructor(e,n,r){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Gi(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const r=n!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=Gi.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Yh.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i1{constructor(e){this.key=e}}class s1{constructor(e){this.key=e}}class GP{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ne(),this.mutatedKeys=ne(),this.Aa=Rw(e),this.Ra=new Vi(this.Aa)}get Va(){return this.Ta}ma(e,n){const r=n?n.fa:new vy,i=n?n.Ra:this.Ra;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,p)=>{const g=i.get(d),S=uu(this.query,p)?p:null,A=!!g&&this.mutatedKeys.has(g.key),N=!!S&&(S.hasLocalMutations||this.mutatedKeys.has(S.key)&&S.hasCommittedMutations);let L=!1;g&&S?g.data.isEqual(S.data)?A!==N&&(r.track({type:3,doc:S}),L=!0):this.ga(g,S)||(r.track({type:2,doc:S}),L=!0,(u&&this.Aa(S,u)>0||h&&this.Aa(S,h)<0)&&(l=!0)):!g&&S?(r.track({type:0,doc:S}),L=!0):g&&!S&&(r.track({type:1,doc:g}),L=!0,(u||h)&&(l=!0)),L&&(S?(o=o.add(S),s=N?s.add(d):s.delete(d)):(o=o.delete(d),s=s.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),s=s.delete(d.key),r.track({type:1,doc:d})}return{Ra:o,fa:r,ns:l,mutatedKeys:s}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,p)=>function(S,A){const N=L=>{switch(L){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y()}};return N(S)-N(A)}(d.type,p.type)||this.Aa(d.doc,p.doc)),this.pa(r),i=i!=null&&i;const l=n&&!i?this.ya():[],u=this.da.size===0&&this.current&&!i?1:0,h=u!==this.Ea;return this.Ea=u,o.length!==0||h?{snapshot:new Gi(this.query,e.Ra,s,o,e.mutatedKeys,u===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new vy,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ne(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const n=[];return e.forEach(r=>{this.da.has(r)||n.push(new s1(r))}),this.da.forEach(r=>{e.has(r)||n.push(new i1(r))}),n}ba(e){this.Ta=e.Ts,this.da=ne();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return Gi.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class QP{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class YP{constructor(e){this.key=e,this.va=!1}}class JP{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new ss(l=>Aw(l),lu),this.Ma=new Map,this.xa=new Set,this.Oa=new Ce(W.comparator),this.Na=new Map,this.La=new Pf,this.Ba={},this.ka=new Map,this.qa=Ki.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function XP(t,e,n=!0){const r=c1(t);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await o1(r,e,n,!0),i}async function ZP(t,e){const n=c1(t);await o1(n,e,!0,!1)}async function o1(t,e,n,r){const i=await AP(t.localStore,rn(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return r&&(l=await ex(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&Jw(t.remoteStore,i),l}async function ex(t,e,n,r,i){t.Ka=(p,g,S)=>async function(N,L,I,w){let k=L.view.ma(I);k.ns&&(k=await fy(N.localStore,L.query,!1).then(({documents:E})=>L.view.ma(E,k)));const P=w&&w.targetChanges.get(L.targetId),V=w&&w.targetMismatches.get(L.targetId)!=null,F=L.view.applyChanges(k,N.isPrimaryClient,P,V);return Iy(N,L.targetId,F.wa),F.snapshot}(t,p,g,S);const s=await fy(t.localStore,e,!0),o=new GP(e,s.Ts),l=o.ma(s.documents),u=$o.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),h=o.applyChanges(l,t.isPrimaryClient,u);Iy(t,n,h.wa);const d=new QP(e,n,o);return t.Fa.set(e,d),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),h.snapshot}async function tx(t,e,n){const r=te(t),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(o=>!lu(o,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Qh(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Df(r.remoteStore,i.targetId),Jh(r,i.targetId)}).catch(yf)):(Jh(r,i.targetId),await Qh(r.localStore,i.targetId,!0))}async function nx(t,e){const n=te(t),r=n.Fa.get(e),i=n.Ma.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Df(n.remoteStore,r.targetId))}async function a1(t,e){const n=te(t);try{const r=await kP(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Na.get(s);o&&(Ee(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?Ee(o.va):i.removedDocuments.size>0&&(Ee(o.va),o.va=!1))}),await u1(n,r,e)}catch(r){await yf(r)}}function Ey(t,e,n){const r=te(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Fa.forEach((s,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const u=te(o);u.onlineState=l;let h=!1;u.queries.forEach((d,p)=>{for(const g of p.j_)g.Z_(l)&&(h=!0)}),h&&Mf(u)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function rx(t,e,n){const r=te(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Na.get(e),s=i&&i.key;if(s){let o=new Ce(W.comparator);o=o.insert(s,Xe.newNoDocument(s,Q.min()));const l=ne().add(s),u=new du(Q.min(),new Map,new Ce(se),o,l);await a1(r,u),r.Oa=r.Oa.remove(s),r.Na.delete(e),Ff(r)}else await Qh(r.localStore,e,!1).then(()=>Jh(r,e,n)).catch(yf)}function Jh(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Ma.get(e))t.Fa.delete(r),n&&t.Ca.$a(r,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(r=>{t.La.containsKey(r)||l1(t,r)})}function l1(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(Df(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),Ff(t))}function Iy(t,e,n){for(const r of n)r instanceof i1?(t.La.addReference(r.key,e),ix(t,r)):r instanceof s1?(H("SyncEngine","Document no longer in limbo: "+r.key),t.La.removeReference(r.key,e),t.La.containsKey(r.key)||l1(t,r.key)):Y()}function ix(t,e){const n=e.key,r=n.path.canonicalString();t.Oa.get(n)||t.xa.has(r)||(H("SyncEngine","New document in limbo: "+n),t.xa.add(r),Ff(t))}function Ff(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new W(de.fromString(e)),r=t.qa.next();t.Na.set(r,new YP(n)),t.Oa=t.Oa.insert(n,r),Jw(t.remoteStore,new Jn(rn(Sf(n.path)),r,"TargetPurposeLimboResolution",vf.oe))}}async function u1(t,e,n){const r=te(t),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((l,u)=>{o.push(r.Ka(u,e,n).then(h=>{var d;if((h||n)&&r.isPrimaryClient){const p=h?!h.fromCache:(d=n==null?void 0:n.targetChanges.get(u.targetId))===null||d===void 0?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(h){i.push(h);const p=Nf.Wi(u.targetId,h);s.push(p)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(u,h){const d=te(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>M.forEach(h,g=>M.forEach(g.$i,S=>d.persistence.referenceDelegate.addReference(p,g.targetId,S)).next(()=>M.forEach(g.Ui,S=>d.persistence.referenceDelegate.removeReference(p,g.targetId,S)))))}catch(p){if(!Fo(p))throw p;H("LocalStore","Failed to update sequence numbers: "+p)}for(const p of h){const g=p.targetId;if(!p.fromCache){const S=d.os.get(g),A=S.snapshotVersion,N=S.withLastLimboFreeSnapshotVersion(A);d.os=d.os.insert(g,N)}}}(r.localStore,s))}async function sx(t,e){const n=te(t);if(!n.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const r=await Gw(n.localStore,e);n.currentUser=e,function(s,o){s.ka.forEach(l=>{l.forEach(u=>{u.reject(new q(U.CANCELLED,o))})}),s.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await u1(n,r.hs)}}function ox(t,e){const n=te(t),r=n.Na.get(e);if(r&&r.va)return ne().add(r.key);{let i=ne();const s=n.Ma.get(e);if(!s)return i;for(const o of s){const l=n.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function c1(t){const e=te(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=a1.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=ox.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=rx.bind(null,e),e.Ca.d_=WP.bind(null,e.eventManager),e.Ca.$a=KP.bind(null,e.eventManager),e}class Vl{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=fu(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return SP(this.persistence,new IP,e.initialUser,this.serializer)}Ga(e){return new _P(xf.Zr,this.serializer)}Wa(e){return new PP}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Vl.provider={build:()=>new Vl};class Xh{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Ey(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=sx.bind(null,this.syncEngine),await zP(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new HP}()}createDatastore(e){const n=fu(e.databaseInfo.databaseId),r=function(s){return new LP(s)}(e.databaseInfo);return function(s,o,l,u){return new bP(s,o,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,l){return new FP(r,i,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>Ey(this.syncEngine,n,0),function(){return my.D()?new my:new xP}())}createSyncEngine(e,n){return function(i,s,o,l,u,h,d){const p=new JP(i,s,o,l,u,h);return d&&(p.Qa=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=te(i);H("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Bo(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}Xh.provider={build:()=>new Xh};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h1{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Dn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ax{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=Ye.UNAUTHENTICATED,this.clientId=yw.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{H("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(H("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new cr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=e1(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Rc(t,e){t.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await Gw(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Ty(t,e){t.asyncQueue.verifyOperationInProgress();const n=await lx(t);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>yy(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>yy(e.remoteStore,i)),t._onlineComponents=e}async function lx(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await Rc(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===U.FAILED_PRECONDITION||i.code===U.UNIMPLEMENTED:!(typeof DOMException!="undefined"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;zi("Error using user provided cache. Falling back to memory cache: "+n),await Rc(t,new Vl)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await Rc(t,new Vl);return t._offlineComponents}async function ux(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await Ty(t,t._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await Ty(t,new Xh))),t._onlineComponents}async function d1(t){const e=await ux(t),n=e.eventManager;return n.onListen=XP.bind(null,e.syncEngine),n.onUnlisten=tx.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=ZP.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=nx.bind(null,e.syncEngine),n}function cx(t,e,n={}){const r=new cr;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,h){const d=new h1({next:g=>{d.Za(),o.enqueueAndForget(()=>n1(s,p));const S=g.docs.has(l);!S&&g.fromCache?h.reject(new q(U.UNAVAILABLE,"Failed to get document because the client is offline.")):S&&g.fromCache&&u&&u.source==="server"?h.reject(new q(U.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(g)},error:g=>h.reject(g)}),p=new r1(Sf(l.path),d,{includeMetadataChanges:!0,_a:!0});return t1(s,p)}(await d1(t),t.asyncQueue,e,n,r)),r.promise}function hx(t,e,n={}){const r=new cr;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,h){const d=new h1({next:g=>{d.Za(),o.enqueueAndForget(()=>n1(s,p)),g.fromCache&&u.source==="server"?h.reject(new q(U.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(g)},error:g=>h.reject(g)}),p=new r1(l,d,{includeMetadataChanges:!0,_a:!0});return t1(s,p)}(await d1(t),t.asyncQueue,e,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f1(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sy=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p1(t,e,n){if(!n)throw new q(U.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function dx(t,e,n,r){if(e===!0&&r===!0)throw new q(U.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function ky(t){if(!W.isDocumentKey(t))throw new q(U.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Cy(t){if(W.isDocumentKey(t))throw new q(U.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function mu(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Y()}function Ro(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new q(U.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=mu(t);throw new q(U.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function fx(t,e){if(e<=0)throw new q(U.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ay{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new q(U.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new q(U.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}dx("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=f1((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new q(U.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new q(U.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new q(U.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class gu{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ay({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new q(U.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new q(U.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ay(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new GA;switch(r.type){case"firstParty":return new XA(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new q(U.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=Sy.get(n);r&&(H("ComponentProvider","Removing Datastore"),Sy.delete(n),r.terminate())}(this),Promise.resolve()}}function px(t,e,n,r={}){var i;const s=(t=Ro(t,gu))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&zi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let l,u;if(typeof r.mockUserToken=="string")l=r.mockUserToken,u=Ye.MOCK_USER;else{l=TS(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const h=r.mockUserToken.sub||r.mockUserToken.user_id;if(!h)throw new q(U.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Ye(h)}t._authCredentials=new QA(new gw(l,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new ni(this.firestore,e,this._query)}}class It{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new hr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new It(this.firestore,e,this._key)}}class hr extends ni{constructor(e,n,r){super(e,n,Sf(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new It(this.firestore,null,new W(e))}withConverter(e){return new hr(this.firestore,e,this._path)}}function wt(t,e,...n){if(t=lt(t),p1("collection","path",e),t instanceof gu){const r=de.fromString(e,...n);return Cy(r),new hr(t,null,r)}{if(!(t instanceof It||t instanceof hr))throw new q(U.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(de.fromString(e,...n));return Cy(r),new hr(t.firestore,null,r)}}function Qa(t,e,...n){if(t=lt(t),arguments.length===1&&(e=yw.newId()),p1("doc","path",e),t instanceof gu){const r=de.fromString(e,...n);return ky(r),new It(t,null,new W(r))}{if(!(t instanceof It||t instanceof hr))throw new q(U.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(de.fromString(e,...n));return ky(r),new It(t.firestore,t instanceof hr?t.converter:null,new W(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ry{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Yw(this,"async_queue_retry"),this.Vu=()=>{const r=Ac();r&&H("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=Ac();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Ac();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new cr;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Fo(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(r);throw Dn("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const i=bf.createAndSchedule(this,e,n,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&Y()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class jf extends gu{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new Ry,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ry(e),this._firestoreClient=void 0,await e}}}function mx(t,e){const n=typeof t=="object"?t:af(),r=typeof t=="string"?t:"(default)",i=ti(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=ES("firestore");s&&px(i,...s)}return i}function m1(t){if(t._terminated)throw new q(U.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||gx(t),t._firestoreClient}function gx(t){var e,n,r;const i=t._freezeSettings(),s=function(l,u,h,d){return new hR(l,u,h,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,f1(d.experimentalLongPollingOptions),d.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new ax(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Qi(ze.fromBase64String(e))}catch(n){throw new q(U.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Qi(ze.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g1{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new q(U.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ze(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y1{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new q(U.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new q(U.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return se(this._lat,e._lat)||se(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $f{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yx=/^__.*__$/;function v1(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y()}}class Bf{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Bf(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Zh(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(v1(this.Cu)&&yx.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class vx{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||fu(e)}Qu(e,n,r,i=!1){return new Bf({Cu:e,methodName:n,qu:r,path:Ze.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function _x(t){const e=t._freezeSettings(),n=fu(t._databaseId);return new vx(t._databaseId,!!e.ignoreUndefinedProperties,n)}function wx(t,e,n,r=!1){return zf(n,t.Qu(r?4:3,e))}function zf(t,e){if(_1(t=lt(t)))return Ix("Unsupported field value:",e,t),Ex(t,e);if(t instanceof y1)return function(r,i){if(!v1(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const l of r){let u=zf(l,i.Lu(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=lt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return LR(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=be.fromDate(r);return{timestampValue:Kh(i.serializer,s)}}if(r instanceof be){const s=new be(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Kh(i.serializer,s)}}if(r instanceof Uf)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Qi)return{bytesValue:Uw(i.serializer,r._byteString)};if(r instanceof It){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:$w(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof $f)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw l.Bu("VectorValues must only contain numeric values.");return kf(l.serializer,u)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${mu(r)}`)}(t,e)}function Ex(t,e){const n={};return vw(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):jo(t,(r,i)=>{const s=zf(i,e.Mu(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function _1(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof be||t instanceof Uf||t instanceof Qi||t instanceof It||t instanceof y1||t instanceof $f)}function Ix(t,e,n){if(!_1(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const r=mu(n);throw r==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+r)}}const Tx=new RegExp("[~\\*/\\[\\]]");function Sx(t,e,n){if(e.search(Tx)>=0)throw Zh(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new g1(...e.split("."))._internalPath}catch(r){throw Zh(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Zh(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new q(U.INVALID_ARGUMENT,l+t+u)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w1{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new It(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new kx(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(qf("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class kx extends w1{data(){return super.data()}}function qf(t,e){return typeof e=="string"?Sx(t,e):e instanceof g1?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cx(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new q(U.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Hf{}class E1 extends Hf{}function st(t,e,...n){let r=[];e instanceof Hf&&r.push(e),r=r.concat(n),function(s){const o=s.filter(u=>u instanceof Wf).length,l=s.filter(u=>u instanceof yu).length;if(o>1||o>0&&l>0)throw new q(U.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)t=i._apply(t);return t}class yu extends E1{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new yu(e,n,r)}_apply(e){const n=this._parse(e);return I1(e._query,n),new ni(e.firestore,e.converter,zh(e._query,n))}_parse(e){const n=_x(e.firestore);return function(s,o,l,u,h,d,p){let g;if(h.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new q(U.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){xy(p,d);const S=[];for(const A of p)S.push(Py(u,s,A));g={arrayValue:{values:S}}}else g=Py(u,s,p)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||xy(p,d),g=wx(l,o,p,d==="in"||d==="not-in");return Pe.create(h,d,g)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function Or(t,e,n){const r=e,i=qf("where",t);return yu._create(i,r,n)}class Wf extends Hf{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new Wf(e,n)}_parse(e){const n=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return n.length===1?n[0]:Kt.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(i,s){let o=i;const l=s.getFlattenedFilters();for(const u of l)I1(o,u),o=zh(o,u)}(e._query,n),new ni(e.firestore,e.converter,zh(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Kf extends E1{constructor(e,n,r){super(),this.type=e,this._limit=n,this._limitType=r}static _create(e,n,r){return new Kf(e,n,r)}_apply(e){return new ni(e.firestore,e.converter,Dl(e._query,this._limit,this._limitType))}}function Vr(t){return fx("limit",t),Kf._create("limit",t,"F")}function Py(t,e,n){if(typeof(n=lt(n))=="string"){if(n==="")throw new q(U.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Cw(e)&&n.indexOf("/")!==-1)throw new q(U.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(de.fromString(n));if(!W.isDocumentKey(r))throw new q(U.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Yg(t,new W(r))}if(n instanceof It)return Yg(t,n._key);throw new q(U.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${mu(n)}.`)}function xy(t,e){if(!Array.isArray(t)||t.length===0)throw new q(U.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function I1(t,e){const n=function(i,s){for(const o of i)for(const l of o.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new q(U.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new q(U.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class Ax{convertValue(e,n="none"){switch(Gr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Te(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Kr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw Y()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return jo(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var n,r,i;const s=(i=(r=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>Te(o.doubleValue));return new $f(s)}convertGeoPoint(e){return new Uf(Te(e.latitude),Te(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=wf(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(ko(e));default:return null}}convertTimestamp(e){const n=gr(e);return new be(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=de.fromString(e);Ee(Kw(r));const i=new Co(r.get(1),r.get(3)),s=new W(r.popFirst(5));return i.isEqual(n)||Dn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class T1 extends w1{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Ya(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(qf("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class Ya extends T1{data(e={}){return super.data(e)}}class Rx{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new Ms(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new Ya(this._firestore,this._userDataWriter,r.key,r,new Ms(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new q(U.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const u=new Ya(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Ms(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const u=new Ya(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Ms(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,d=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),d=o.indexOf(l.doc.key)),{type:Px(l.type),doc:u,oldIndex:h,newIndex:d}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function Px(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ja(t){t=Ro(t,It);const e=Ro(t.firestore,jf);return cx(m1(e),t._key).then(n=>xx(e,t,n))}class S1 extends Ax{constructor(e){super(),this.firestore=e}convertBytes(e){return new Qi(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new It(this.firestore,null,n)}}function ot(t){t=Ro(t,ni);const e=Ro(t.firestore,jf),n=m1(e),r=new S1(e);return Cx(t._query),hx(n,t._query).then(i=>new Rx(e,r,t,i))}function xx(t,e,n){const r=n.docs.get(e._key),i=new S1(t);return new T1(t,i,e._key,r,new Ms(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){(function(i){is=i})(ts),sn(new Wt("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),l=new jf(new YA(r.getProvider("auth-internal")),new eR(r.getProvider("app-check-internal")),function(h,d){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new q(U.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Co(h.options.projectId,d)}(o,i),o);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),Ot(Hg,"4.7.3",e),Ot(Hg,"4.7.3","esm2017")})();const k1="@firebase/installations",Gf="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C1=1e4,A1=`w:${Gf}`,R1="FIS_v2",Nx="https://firebaseinstallations.googleapis.com/v1",Dx=60*60*1e3,Lx="installations",Ox="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vx={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Qr=new ei(Lx,Ox,Vx);function P1(t){return t instanceof Gt&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x1({projectId:t}){return`${Nx}/projects/${t}/installations`}function N1(t){return{token:t.token,requestStatus:2,expiresIn:Mx(t.expiresIn),creationTime:Date.now()}}async function D1(t,e){const r=(await e.json()).error;return Qr.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function L1({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function bx(t,{refreshToken:e}){const n=L1(t);return n.append("Authorization",Fx(e)),n}async function O1(t){const e=await t();return e.status>=500&&e.status<600?t():e}function Mx(t){return Number(t.replace("s","000"))}function Fx(t){return`${R1} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jx({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=x1(t),i=L1(t),s=e.getImmediate({optional:!0});if(s){const h=await s.getHeartbeatsHeader();h&&i.append("x-firebase-client",h)}const o={fid:n,authVersion:R1,appId:t.appId,sdkVersion:A1},l={method:"POST",headers:i,body:JSON.stringify(o)},u=await O1(()=>fetch(r,l));if(u.ok){const h=await u.json();return{fid:h.fid||n,registrationStatus:2,refreshToken:h.refreshToken,authToken:N1(h.authToken)}}else throw await D1("Create Installation",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V1(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ux(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $x=/^[cdef][\w-]{21}$/,ed="";function Bx(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=zx(t);return $x.test(n)?n:ed}catch(t){return ed}}function zx(t){return Ux(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vu(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b1=new Map;function M1(t,e){const n=vu(t);F1(n,e),qx(n,e)}function F1(t,e){const n=b1.get(t);if(n)for(const r of n)r(e)}function qx(t,e){const n=Hx();n&&n.postMessage({key:t,fid:e}),Wx()}let br=null;function Hx(){return!br&&"BroadcastChannel"in self&&(br=new BroadcastChannel("[Firebase] FID Change"),br.onmessage=t=>{F1(t.data.key,t.data.fid)}),br}function Wx(){b1.size===0&&br&&(br.close(),br=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kx="firebase-installations-database",Gx=1,Yr="firebase-installations-store";let Pc=null;function Qf(){return Pc||(Pc=k_(Kx,Gx,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(Yr)}}})),Pc}async function bl(t,e){const n=vu(t),i=(await Qf()).transaction(Yr,"readwrite"),s=i.objectStore(Yr),o=await s.get(n);return await s.put(e,n),await i.done,(!o||o.fid!==e.fid)&&M1(t,e.fid),e}async function j1(t){const e=vu(t),r=(await Qf()).transaction(Yr,"readwrite");await r.objectStore(Yr).delete(e),await r.done}async function _u(t,e){const n=vu(t),i=(await Qf()).transaction(Yr,"readwrite"),s=i.objectStore(Yr),o=await s.get(n),l=e(o);return l===void 0?await s.delete(n):await s.put(l,n),await i.done,l&&(!o||o.fid!==l.fid)&&M1(t,l.fid),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yf(t){let e;const n=await _u(t.appConfig,r=>{const i=Qx(r),s=Yx(t,i);return e=s.registrationPromise,s.installationEntry});return n.fid===ed?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function Qx(t){const e=t||{fid:Bx(),registrationStatus:0};return U1(e)}function Yx(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(Qr.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=Jx(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Xx(t)}:{installationEntry:e}}async function Jx(t,e){try{const n=await jx(t,e);return bl(t.appConfig,n)}catch(n){throw P1(n)&&n.customData.serverCode===409?await j1(t.appConfig):await bl(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function Xx(t){let e=await Ny(t.appConfig);for(;e.registrationStatus===1;)await V1(100),e=await Ny(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await Yf(t);return r||n}return e}function Ny(t){return _u(t,e=>{if(!e)throw Qr.create("installation-not-found");return U1(e)})}function U1(t){return Zx(t)?{fid:t.fid,registrationStatus:0}:t}function Zx(t){return t.registrationStatus===1&&t.registrationTime+C1<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eN({appConfig:t,heartbeatServiceProvider:e},n){const r=tN(t,n),i=bx(t,n),s=e.getImmediate({optional:!0});if(s){const h=await s.getHeartbeatsHeader();h&&i.append("x-firebase-client",h)}const o={installation:{sdkVersion:A1,appId:t.appId}},l={method:"POST",headers:i,body:JSON.stringify(o)},u=await O1(()=>fetch(r,l));if(u.ok){const h=await u.json();return N1(h)}else throw await D1("Generate Auth Token",u)}function tN(t,{fid:e}){return`${x1(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jf(t,e=!1){let n;const r=await _u(t.appConfig,s=>{if(!$1(s))throw Qr.create("not-registered");const o=s.authToken;if(!e&&iN(o))return s;if(o.requestStatus===1)return n=nN(t,e),s;{if(!navigator.onLine)throw Qr.create("app-offline");const l=oN(s);return n=rN(t,l),l}});return n?await n:r.authToken}async function nN(t,e){let n=await Dy(t.appConfig);for(;n.authToken.requestStatus===1;)await V1(100),n=await Dy(t.appConfig);const r=n.authToken;return r.requestStatus===0?Jf(t,e):r}function Dy(t){return _u(t,e=>{if(!$1(e))throw Qr.create("not-registered");const n=e.authToken;return aN(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function rN(t,e){try{const n=await eN(t,e),r=Object.assign(Object.assign({},e),{authToken:n});return await bl(t.appConfig,r),n}catch(n){if(P1(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await j1(t.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await bl(t.appConfig,r)}throw n}}function $1(t){return t!==void 0&&t.registrationStatus===2}function iN(t){return t.requestStatus===2&&!sN(t)}function sN(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+Dx}function oN(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function aN(t){return t.requestStatus===1&&t.requestTime+C1<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lN(t){const e=t,{installationEntry:n,registrationPromise:r}=await Yf(e);return r?r.catch(console.error):Jf(e).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uN(t,e=!1){const n=t;return await cN(n),(await Jf(n,e)).token}async function cN(t){const{registrationPromise:e}=await Yf(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hN(t){if(!t||!t.options)throw xc("App Configuration");if(!t.name)throw xc("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw xc(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function xc(t){return Qr.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B1="installations",dN="installations-internal",fN=t=>{const e=t.getProvider("app").getImmediate(),n=hN(e),r=ti(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},pN=t=>{const e=t.getProvider("app").getImmediate(),n=ti(e,B1).getImmediate();return{getId:()=>lN(n),getToken:i=>uN(n,i)}};function mN(){sn(new Wt(B1,fN,"PUBLIC")),sn(new Wt(dN,pN,"PRIVATE"))}mN();Ot(k1,Gf);Ot(k1,Gf,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml="analytics",gN="firebase_id",yN="origin",vN=60*1e3,_N="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Xf="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gt=new ru("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wN={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Tt=new ei("analytics","Analytics",wN);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EN(t){if(!t.startsWith(Xf)){const e=Tt.create("invalid-gtag-resource",{gtagURL:t});return gt.warn(e.message),""}return t}function z1(t){return Promise.all(t.map(e=>e.catch(n=>n)))}function IN(t,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(t,e)),n}function TN(t,e){const n=IN("firebase-js-sdk-policy",{createScriptURL:EN}),r=document.createElement("script"),i=`${Xf}?l=${t}&id=${e}`;r.src=n?n==null?void 0:n.createScriptURL(i):i,r.async=!0,document.head.appendChild(r)}function SN(t){let e=[];return Array.isArray(window[t])?e=window[t]:window[t]=e,e}async function kN(t,e,n,r,i,s){const o=r[i];try{if(o)await e[o];else{const u=(await z1(n)).find(h=>h.measurementId===i);u&&await e[u.appId]}}catch(l){gt.error(l)}t("config",i,s)}async function CN(t,e,n,r,i){try{let s=[];if(i&&i.send_to){let o=i.send_to;Array.isArray(o)||(o=[o]);const l=await z1(n);for(const u of o){const h=l.find(p=>p.measurementId===u),d=h&&e[h.appId];if(d)s.push(d);else{s=[];break}}}s.length===0&&(s=Object.values(e)),await Promise.all(s),t("event",r,i||{})}catch(s){gt.error(s)}}function AN(t,e,n,r){async function i(s,...o){try{if(s==="event"){const[l,u]=o;await CN(t,e,n,l,u)}else if(s==="config"){const[l,u]=o;await kN(t,e,n,r,l,u)}else if(s==="consent"){const[l,u]=o;t("consent",l,u)}else if(s==="get"){const[l,u,h]=o;t("get",l,u,h)}else if(s==="set"){const[l]=o;t("set",l)}else t(s,...o)}catch(l){gt.error(l)}}return i}function RN(t,e,n,r,i){let s=function(...o){window[r].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=AN(s,t,e,n),{gtagCore:s,wrappedGtag:window[i]}}function PN(t){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(Xf)&&n.src.includes(t))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xN=30,NN=1e3;class DN{constructor(e={},n=NN){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const q1=new DN;function LN(t){return new Headers({Accept:"application/json","x-goog-api-key":t})}async function ON(t){var e;const{appId:n,apiKey:r}=t,i={method:"GET",headers:LN(r)},s=_N.replace("{app-id}",n),o=await fetch(s,i);if(o.status!==200&&o.status!==304){let l="";try{const u=await o.json();!((e=u.error)===null||e===void 0)&&e.message&&(l=u.error.message)}catch(u){}throw Tt.create("config-fetch-failed",{httpStatus:o.status,responseMessage:l})}return o.json()}async function VN(t,e=q1,n){const{appId:r,apiKey:i,measurementId:s}=t.options;if(!r)throw Tt.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:r};throw Tt.create("no-api-key")}const o=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},l=new FN;return setTimeout(async()=>{l.abort()},vN),H1({appId:r,apiKey:i,measurementId:s},o,l,e)}async function H1(t,{throttleEndTimeMillis:e,backoffCount:n},r,i=q1){var s;const{appId:o,measurementId:l}=t;try{await bN(r,e)}catch(u){if(l)return gt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:o,measurementId:l};throw u}try{const u=await ON(t);return i.deleteThrottleMetadata(o),u}catch(u){const h=u;if(!MN(h)){if(i.deleteThrottleMetadata(o),l)return gt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:o,measurementId:l};throw u}const d=Number((s=h==null?void 0:h.customData)===null||s===void 0?void 0:s.httpStatus)===503?yg(n,i.intervalMillis,xN):yg(n,i.intervalMillis),p={throttleEndTimeMillis:Date.now()+d,backoffCount:n+1};return i.setThrottleMetadata(o,p),gt.debug(`Calling attemptFetch again in ${d} millis`),H1(t,p,r,i)}}function bN(t,e){return new Promise((n,r)=>{const i=Math.max(e-Date.now(),0),s=setTimeout(n,i);t.addEventListener(()=>{clearTimeout(s),r(Tt.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function MN(t){if(!(t instanceof Gt)||!t.customData)return!1;const e=Number(t.customData.httpStatus);return e===429||e===500||e===503||e===504}class FN{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function jN(t,e,n,r,i){if(i&&i.global){t("event",n,r);return}else{const s=await e,o=Object.assign(Object.assign({},r),{send_to:s});t("event",n,o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function UN(){if(rf())try{await sf()}catch(t){return gt.warn(Tt.create("indexeddb-unavailable",{errorInfo:t==null?void 0:t.toString()}).message),!1}else return gt.warn(Tt.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function $N(t,e,n,r,i,s,o){var l;const u=VN(t);u.then(S=>{n[S.measurementId]=S.appId,t.options.measurementId&&S.measurementId!==t.options.measurementId&&gt.warn(`The measurement ID in the local Firebase config (${t.options.measurementId}) does not match the measurement ID fetched from the server (${S.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(S=>gt.error(S)),e.push(u);const h=UN().then(S=>{if(S)return r.getId()}),[d,p]=await Promise.all([u,h]);PN(s)||TN(s,d.measurementId),i("js",new Date);const g=(l=o==null?void 0:o.config)!==null&&l!==void 0?l:{};return g[yN]="firebase",g.update=!0,p!=null&&(g[gN]=p),i("config",d.measurementId,g),d.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BN{constructor(e){this.app=e}_delete(){return delete Zs[this.app.options.appId],Promise.resolve()}}let Zs={},Ly=[];const Oy={};let Nc="dataLayer",zN="gtag",Vy,W1,by=!1;function qN(){const t=[];if(nf()&&t.push("This is a browser extension environment."),I_()||t.push("Cookies are not available."),t.length>0){const e=t.map((r,i)=>`(${i+1}) ${r}`).join(" "),n=Tt.create("invalid-analytics-context",{errorInfo:e});gt.warn(n.message)}}function HN(t,e,n){qN();const r=t.options.appId;if(!r)throw Tt.create("no-app-id");if(!t.options.apiKey)if(t.options.measurementId)gt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${t.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Tt.create("no-api-key");if(Zs[r]!=null)throw Tt.create("already-exists",{id:r});if(!by){SN(Nc);const{wrappedGtag:s,gtagCore:o}=RN(Zs,Ly,Oy,Nc,zN);W1=s,Vy=o,by=!0}return Zs[r]=$N(t,Ly,Oy,e,Vy,Nc,n),new BN(t)}function WN(t=af()){t=lt(t);const e=ti(t,Ml);return e.isInitialized()?e.getImmediate():KN(t)}function KN(t,e={}){const n=ti(t,Ml);if(n.isInitialized()){const i=n.getImmediate();if(wo(e,n.getOptions()))return i;throw Tt.create("already-initialized")}return n.initialize({options:e})}async function GN(){if(nf()||!I_()||!rf())return!1;try{return await sf()}catch(t){return!1}}function QN(t,e,n,r){t=lt(t),jN(W1,Zs[t.app.options.appId],e,n,r).catch(i=>gt.error(i))}const My="@firebase/analytics",Fy="0.10.8";function YN(){sn(new Wt(Ml,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return HN(r,i,n)},"PUBLIC")),sn(new Wt("analytics-internal",t,"PRIVATE")),Ot(My,Fy),Ot(My,Fy,"esm2017");function t(e){try{const n=e.getProvider(Ml).getImmediate();return{logEvent:(r,i,s)=>QN(n,r,i,s)}}catch(n){throw Tt.create("interop-component-reg-failed",{reason:n})}}}YN();const td={apiKey:"AIzaSyD1TjtSC-Mukd2EdNtiuQq-u3l3gdMP0dc",authDomain:"homefoods-16e56.firebaseapp.com",projectId:"homefoods-16e56",storageBucket:"homefoods-16e56.firebasestorage.app",messagingSenderId:"495709118320",appId:"1:495709118320:web:6fe3b7ec2b7c19d66cf9b5",measurementId:"G-6MR0ED1C3E"},JN=["apiKey","authDomain","projectId","appId"],Nt=JN.some(t=>!td[t]);let Si,Oe,jy;Nt?Promise.resolve(null):(Si=Tg().length?Tg()[0]:C_(td),uw(Si),Oe=mx(Si),td.measurementId?GN().then(t=>t?(jy=WN(Si),jy):null):Promise.resolve(null));const K1=b.createContext(null),Rt=Si?uw(Si):null;function XN({children:t}){const[e,n]=b.useState(null),[r,i]=b.useState(!0);b.useEffect(()=>{if(Nt||!Rt){i(!1);return}const d=VC(Rt,p=>{n(p||null),i(!1)});return()=>d()},[Rt]);const s=b.useCallback(async()=>{if(Nt||!Rt){console.info("Auth disabled: anonymous sign-in skipped");return}await PC(Rt)},[Rt]),o=b.useCallback(()=>{const d="your_wechat_app_id",p=encodeURIComponent("https://your.domain.com/wechat/callback"),g="snsapi_userinfo",S="we_"+Math.random().toString(36).slice(2);window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${d}&redirect_uri=${p}&response_type=code&scope=${g}&state=${S}#wechat_redirect`},[]),l=b.useCallback(async d=>{console.log("WeChat code obtained:",d);const g=new Gs("wechat").credential({accessToken:"placeholder_access_token"});!Nt&&Rt?await DC(Rt,g).catch(S=>{console.warn("WeChat credential sign-in failed (expected in placeholder):",S.message)}):console.info("Auth disabled: skipping credential sign-in (placeholder)")},[Rt]),u=b.useCallback(async()=>{if(!(Nt||!Rt))return bC(Rt)},[Rt]),h={user:e,initializing:r,authDisabled:Nt,signInAnonymously:s,signInWithWeChatPopup:o,handleWeChatCallback:l,signOut:u};return y.jsx(K1.Provider,{value:h,children:t})}function wu(){const t=b.useContext(K1);if(!t)throw new Error("useAuth must be used within AuthProvider");return t}function ZN(){const{user:t,signOut:e,authDisabled:n}=wu();return y.jsxs("div",{className:"container py-3",children:[y.jsxs("h1",{className:"h4 mb-3",children:["Welcome ",(t==null?void 0:t.displayName)||"User"]}),y.jsx("p",{className:"text-secondary small mb-4",children:"This is a mobile-first boilerplate."}),n&&y.jsx("div",{className:"alert alert-warning p-2 small",role:"alert",children:"Firebase auth disabled (placeholder config). Add real env values to enable."}),y.jsx("button",{className:"btn btn-outline-danger btn-sm",onClick:e,children:"Sign out"})]})}const e3="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='512'%20height='512'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='1.2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3ccircle%20cx='9'%20cy='10'%20r='1'/%3e%3ccircle%20cx='15'%20cy='10'%20r='1'/%3e%3cpath%20d='M5%2015c-1.143-1.012-2-2.547-2-4.25C3%207.798%205.91%205%209.5%205s6.5%202.798%206.5%205.75S13.09%2016.5%209.5%2016.5c-.517%200-1.02-.057-1.5-.165L5%2018l.8-2.4'/%3e%3cpath%20d='M16.5%208.5c2.485%200%204.5%201.79%204.5%204s-2.015%204-4.5%204c-.275%200-.544-.02-.805-.06L14%2018l.6-1.8'/%3e%3c/svg%3e";function t3(){const{signInWithWeChatPopup:t,signInAnonymously:e}=wu();return y.jsxs("div",{className:"container py-5",children:[y.jsx("h1",{className:"h5 mb-4 text-center",children:"Sign In"}),y.jsxs("div",{className:"d-grid gap-3",children:[y.jsxs("button",{className:"btn btn-success d-flex align-items-center justify-content-center gap-2",onClick:t,children:[y.jsx("img",{src:e3,alt:"WeChat",style:{width:20,height:20}}),y.jsx("span",{children:"Continue with WeChat"})]}),y.jsx("button",{className:"btn btn-outline-secondary",onClick:e,children:"Continue as Guest"})]})]})}function n3(){const[t]=m_(),e=tu(),{handleWeChatCallback:n}=wu();return b.useEffect(()=>{const r=t.get("code");r&&n(r).then(()=>e("/",{replace:!0}))},[t,n,e]),y.jsx("div",{className:"d-flex vh-100 align-items-center justify-content-center",children:"Authorizing..."})}function Uy(){return y.jsxs("div",{className:"container py-3",children:[y.jsx("h1",{className:"h5 mb-3",children:"Foods"}),y.jsx("p",{className:"text-secondary small mb-4",children:"Public listing of available foods (placeholder)."}),y.jsxs("ul",{className:"list-group small",children:[y.jsx("li",{className:"list-group-item",children:"Sample Food A"}),y.jsx("li",{className:"list-group-item",children:"Sample Food B"}),y.jsx("li",{className:"list-group-item",children:"Sample Food C"})]})]})}const G1="/assets/product-BvDHopBm.png",r3="/assets/user1-DLLHbfvd.svg";async function Q1(t,e=null,n=20){if(console.log(`[getFoodReviews] Starting fetch for foodId: "${t}", kitchenId: "${e}", limit: ${n}`),Nt)return console.warn("[getFoodReviews] Firebase disabled, returning mock data"),By(t);if(!t||t.trim()==="")return console.log("[getFoodReviews] No foodId provided, returning empty array"),[];const r=t.trim();console.log(`[getFoodReviews] Cleaned foodId: "${r}"`);try{let i=[];if(e){console.log(`[getFoodReviews] Searching reviews in kitchen: ${e}`);const s=wt(Oe,"kitchens",e,"reviews"),o=st(s,Or("foodId","==",r),Vr(n));i=(await ot(o)).docs.map(u=>({id:u.id,kitchenId:e,...u.data()})),console.log(`[getFoodReviews] Found ${i.length} reviews in kitchen ${e}`)}else{console.log("[getFoodReviews] Searching reviews across all kitchens...");const s=st(wt(Oe,"kitchens")),o=await ot(s);console.log(`[getFoodReviews] Found ${o.size} kitchens to search`);for(const l of o.docs)try{const u=wt(Oe,"kitchens",l.id,"reviews"),h=st(u,Or("foodId","==",r),Vr(n)),p=(await ot(h)).docs.map(g=>({id:g.id,kitchenId:l.id,...g.data()}));if(i.push(...p),console.log(`[getFoodReviews] Found ${p.length} reviews in kitchen ${l.id}`),i.length>=n)break}catch(u){console.warn(`[getFoodReviews] Error searching kitchen ${l.id}:`,u);continue}}return i.length>0&&(i=i.sort((s,o)=>{const l=d=>d?typeof d=="string"?d.includes(" at ")?new Date(d.replace(" at "," ").replace(" UTC+5","")):new Date(d):d.seconds?new Date(d.seconds*1e3):new Date(d):new Date(0),u=l(s.timeStamp);return l(o.timeStamp)-u}),i=i.slice(0,n)),console.log(`[getFoodReviews] Final result - Found ${i.length} reviews for food '${r}':`,i),i}catch(i){return console.error("[getFoodReviews] Error fetching food reviews:",i),console.log("[getFoodReviews] Returning mock data due to error"),By(r)}}async function i3(t,e=null){if(console.log(`[debugReviewsQuery] Testing query for foodId: ${t}, kitchenId: ${e}`),Nt)return console.warn("[debugReviewsQuery] Firebase disabled"),{status:"disabled"};try{let n=[],r=[];const i=st(wt(Oe,"kitchens")),s=await ot(i);console.log(`[debugReviewsQuery] Found ${s.size} kitchens`);for(const l of s.docs)try{r.push(l.id);const u=wt(Oe,"kitchens",l.id,"reviews"),d=(await ot(st(u,Vr(50)))).docs.map(p=>({id:p.id,kitchenId:l.id,...p.data()}));if(console.log(`[debugReviewsQuery] Kitchen ${l.id} has ${d.length} total reviews`),d.length>0&&console.log(`[debugReviewsQuery] Sample reviews from kitchen ${l.id}:`,d.slice(0,2)),t){const p=st(u,Or("foodId","==",t)),S=(await ot(p)).docs.map(A=>({id:A.id,kitchenId:l.id,...A.data()}));S.length>0&&(console.log(`[debugReviewsQuery] Found ${S.length} reviews for foodId '${t}' in kitchen ${l.id}:`,S),n.push(...S))}n.push(...d)}catch(u){console.warn(`[debugReviewsQuery] Error checking kitchen ${l.id}:`,u);continue}const o=[...new Set(n.map(l=>l.foodId))];return console.log("[debugReviewsQuery] All unique foodIds in reviews:",o),{status:"success",requestedFoodId:t,kitchensSearched:r,allReviewsCount:n.length,matchingReviewsCount:n.filter(l=>l.foodId===t).length,uniqueFoodIds:o,sampleReviews:n.slice(0,5)}}catch(n){return console.error("[debugReviewsQuery] Error:",n),{status:"error",error:n.message}}}async function Y1(t,e=null){if(console.log(`[getFoodLikes] Starting fetch for foodId: ${t}, kitchenId: ${e}`),Nt)return console.warn("[getFoodLikes] Firebase disabled, returning mock data"),$y(t);if(!t||t.trim()==="")return console.log("[getFoodLikes] No foodId provided, returning empty array"),[];try{let n=[];if(e)try{console.log(`[getFoodLikes] Searching likes in kitchen ${e} subcollection`);const l=wt(Oe,"kitchens",e,"Likes");let u=st(l,Or("foodId","==",t)),h=await ot(u),d=h.docs.map(p=>({id:p.id,kitchenId:e,...p.data()}));d.length===0&&(u=st(l,Or("productId","==",t)),h=await ot(u),d=h.docs.map(p=>({id:p.id,kitchenId:e,...p.data()}))),n.push(...d),console.log(`[getFoodLikes] Found ${d.length} likes in kitchen subcollection`)}catch(l){console.warn("[getFoodLikes] Error searching kitchen subcollection:",l)}console.log("[getFoodLikes] Querying top-level Likes collection");let r=st(wt(Oe,"Likes"),Or("foodId","==",t)),i=await ot(r),s=i.docs.map(l=>({id:l.id,...l.data()}));s.length===0&&(console.log("[getFoodLikes] No results with foodId, trying productId in top-level..."),r=st(wt(Oe,"Likes"),Or("productId","==",t)),i=await ot(r),s=i.docs.map(l=>({id:l.id,...l.data()}))),n.push(...s),console.log(`[getFoodLikes] Found ${s.length} likes in top-level collection`);const o=n.filter((l,u,h)=>h.findIndex(d=>d.id===l.id)===u);return console.log(`[getFoodLikes] Total unique likes: ${o.length}`),o}catch(n){return console.error("[getFoodLikes] Error fetching food likes:",n),console.log("[getFoodLikes] Returning mock data due to error"),$y(t)}}async function s3(){if(Nt)return console.log("Firebase is disabled - check your .env file"),{status:"disabled"};try{console.log("Testing Firestore connection...");const t=wt(Oe,"kitchens"),e=await ot(st(t,Vr(5))),n=e.docs.map(h=>({id:h.id,...h.data()}));let r=[],i=[];for(const h of n)try{const d=wt(Oe,"kitchens",h.id,"reviews"),g=(await ot(st(d,Vr(5)))).docs.map(L=>({id:L.id,kitchenId:h.id,...L.data()}));r.push(...g);const S=wt(Oe,"kitchens",h.id,"Likes"),N=(await ot(st(S,Vr(5)))).docs.map(L=>({id:L.id,kitchenId:h.id,...L.data()}));i.push(...N),console.log(`Kitchen ${h.id}: ${g.length} reviews, ${N.length} likes`)}catch(d){console.warn(`Error testing kitchen ${h.id} subcollections:`,d)}const s=wt(Oe,"Likes"),l=(await ot(st(s,Vr(10)))).docs.map(h=>({id:h.id,...h.data()}));console.log("Reviews found in kitchen subcollections:",r),console.log("Likes found in kitchen subcollections:",i),console.log("Likes found in top-level collection:",l);const u={status:"connected",collections:{kitchens:{count:e.size,samples:n,sampleIds:n.map(h=>h.id)},reviews:{source:"kitchen_subcollections",count:r.length,samples:r,sampleIds:r.map(h=>h.id),foodIds:r.map(h=>h.foodId)},likes:{subcollectionCount:i.length,topLevelCount:l.length,samples:[...i,...l],foodIds:[...i,...l].map(h=>h.foodId||h.productId)}}};return console.log("Firestore Test Results:",u),u}catch(t){return console.error("Firestore connection test failed:",t),{status:"error",error:t.message}}}async function o3(t,e=null){console.log(`[getFoodDetailWithKitchenAndReviews] Fetching food: ${t}, kitchen: ${e}`);try{const n=await J1(t,e),r=e||n.kitchenId;console.log(`[getFoodDetailWithKitchenAndReviews] Using kitchenId: ${r}`);const[i,s,o]=await Promise.all([r?X1(r):Promise.resolve(null),Y1(t,r),Q1(t,r)]),l=Z1(o),u={food:n,kitchen:i,likes:s,reviews:o,totalLikes:s.length,reviewStats:l};return console.log("[getFoodDetailWithKitchenAndReviews] Complete result:",u),u}catch(n){throw console.error("[getFoodDetailWithKitchenAndReviews] Error fetching food detail:",n),n}}async function J1(t,e=null){if(console.log(`[getFoodById] Starting fetch for foodId: ${t}, kitchenId: ${e}`),Nt)return console.warn("[getFoodById] Firebase disabled, returning mock data"),Dc(t);if(!t||t.trim()==="")throw console.error("[getFoodById] Invalid foodId provided:",t),new Error("Food ID is required and cannot be empty");try{let n,r=null,i=null;if(e&&(console.log(`[getFoodById] Querying kitchens/${e}/foodItems/${t}`),n=await Ja(Qa(Oe,"kitchens",e,"foodItems",t)),n.exists()))return r={id:n.id,...n.data()},i=e,console.log("[getFoodById] Found in specific kitchen subcollection:",r),{...r,kitchenId:i};if(!r){console.log("[getFoodById] Searching across all kitchen subcollections...");const s=st(wt(Oe,"kitchens")),o=await ot(s);for(const l of o.docs)try{const u=Qa(Oe,"kitchens",l.id,"foodItems",t),h=await Ja(u);if(h.exists())return r={id:h.id,...h.data()},i=l.id,console.log(`[getFoodById] Found in kitchen ${l.id}:`,r),{...r,kitchenId:i}}catch(u){console.warn(`[getFoodById] Error checking kitchen ${l.id}:`,u);continue}}if(console.log(`[getFoodById] Trying top-level foodItems/${t}`),n=await Ja(Qa(Oe,"foodItems",t)),n.exists()){const s={id:n.id,...n.data()};return console.log("[getFoodById] Found in top-level collection:",s),s}return console.warn(`[getFoodById] Food item with ID '${t}' not found anywhere`),Dc(t)}catch(n){return console.error("[getFoodById] Error fetching food item:",n),Dc(t)}}async function X1(t){if(console.log(`[getKitchenById] Starting fetch for kitchenId: ${t}`),Nt)return console.warn("[getKitchenById] Firebase disabled, returning mock data"),Lc(t);if(!t||t.trim()==="")throw console.error("[getKitchenById] Invalid kitchenId provided:",t),new Error("Kitchen ID is required and cannot be empty");try{console.log(`[getKitchenById] Querying Firestore collection 'kitchens' for document: ${t}`);const e=await Ja(Qa(Oe,"kitchens",t));if(console.log(`[getKitchenById] Document exists: ${e.exists()}`),!e.exists())return console.warn(`[getKitchenById] Kitchen with ID '${t}' not found in Firestore`),console.log("[getKitchenById] Returning mock data as fallback"),Lc(t);const n={id:e.id,...e.data()};return console.log("[getKitchenById] Successfully fetched kitchen data:",n),n}catch(e){return console.error("[getKitchenById] Error fetching kitchen:",e),console.log("[getKitchenById] Returning mock data due to error"),Lc(t)}}function Z1(t){if(!t||t.length===0)return{totalReviews:0,averageRating:0,ratingBreakdown:{5:0,4:0,3:0,2:0,1:0},ratingPercentages:{5:0,4:0,3:0,2:0,1:0}};const e=t.length,n={5:0,4:0,3:0,2:0,1:0};let r=0;t.forEach(o=>{const l=Math.floor(o.rating||0);l>=1&&l<=5&&(n[l]++,r+=o.rating)});const i=e>0?r/e:0,s={};for(let o=1;o<=5;o++)s[o]=e>0?n[o]/e*100:0;return{totalReviews:e,averageRating:parseFloat(i.toFixed(1)),ratingBreakdown:n,ratingPercentages:s}}function Dc(t){return{id:t,name:"Dim Sum (Dumplings)",description:"A timeless delicacy from Chinese cuisine, Dim Sum dumplings are handcrafted pockets of flavor, delicately wrapped in thin, translucent dough. Each dumpling is steamed to perfection, preserving the juicy, savory filling inside.",cost:150,foodCategory:"1, 2",foodType:"Chinese",imageUrl:"/src/assets/images/product.png",kitchenId:"mock-kitchen-1",kitchenName:"Resto Parmato Bapo",isFeatured:!0,availability:{numAvailable:15,numOfSoldItem:85},engagement:{numOfLike:127,rating:4.9,numRatings:1247,countRating:1247}}}function Lc(t){return{id:t,name:"Resto Parmato Bapo",address:"Lahore-Sialkot Motorway",city:"San Francisco",cuisine:"Thai",description:"This is the kitchen of James done. This is the kitchen of James done, This is the kitchen of James done.This is the kitchen of James done",ownerId:"mock-owner-1",location:{latitude:37.5485,longitude:-121.9886},rating:4.9,ratingCount:1247}}function $y(t){return[{id:"like-1",userID:"user-1",foodId:t,status:"liked",timestamp:"2025-08-01T10:00:00Z"},{id:"like-2",userID:"user-2",foodId:t,status:"liked",timestamp:"2025-08-02T15:30:00Z"}]}function By(t){return[{id:"review-1",foodId:t,userId:"z6HJ9L3KS3XR9yLZ9rexp7K4Eo43",userName:"Testing55",userProfile:"",rating:4,message:"Testing",timeStamp:"July 7, 2025 at 6:06:01 PM UTC+5",orderId:"PrH8qFuHeHDlpfAw6c9"},{id:"review-2",foodId:t,userId:"user-456",userName:"John Doe",userProfile:"",rating:5,message:"Great food, would definitely order again!",timeStamp:"2025-07-07T15:30:00Z",orderId:"order-456"},{id:"review-3",foodId:t,userId:"user-789",userName:"Jane Smith",userProfile:"",rating:5,message:"Perfect! Exceeded my expectations.",timeStamp:"2025-07-06T10:15:30Z",orderId:"order-789"}]}function a3(t,e){const[n,r]=b.useState(null),[i,s]=b.useState(null),[o,l]=b.useState([]),[u,h]=b.useState([]),[d,p]=b.useState(null),[g,S]=b.useState(!0),[A,N]=b.useState(null);return b.useEffect(()=>{async function I(){if(console.log(`[useFoodDetail] Starting fetch for foodId: ${t}, kitchenId: ${e}`),!t){console.log("[useFoodDetail] No foodId provided, skipping fetch"),S(!1);return}try{S(!0),N(null),r(null),s(null),l([]),h([]),p(null),console.log("[useFoodDetail] Using getFoodDetailWithKitchenAndReviews for optimized fetch");const{food:w,kitchen:k,likes:P,reviews:V,reviewStats:F}=await o3(t,e);console.log("[useFoodDetail] Setting state with fetched data"),r(w),s(k),l(P),h(V),p(F)}catch(w){console.error("[useFoodDetail] Error in fetchData:",w),N(w.message);try{console.log("[useFoodDetail] Attempting fallback fetch approach");const k=await J1(t);r(k);const P=e||k.kitchenId;if(P)try{const V=await X1(P);s(V)}catch(V){console.warn("[useFoodDetail] Kitchen fetch failed:",V)}try{const[V,F]=await Promise.all([Y1(t),Q1(t)]);l(V),h(F),p(Z1(F))}catch(V){console.warn("[useFoodDetail] Data fetch failed:",V)}N(null)}catch(k){console.error("[useFoodDetail] Fallback approach also failed:",k),N(k.message)}}finally{S(!1)}}I()},[t,e]),{food:n,kitchen:i,likes:o,reviews:u,reviewStats:d,loading:g,error:A,displayData:(()=>{var I,w,k,P;return n?{...n,kitchenName:(i==null?void 0:i.name)||n.kitchenName||"Unknown Kitchen",kitchenCity:(i==null?void 0:i.city)||(i==null?void 0:i.address)||"Unknown Location",totalLikes:o.length||((I=n.engagement)==null?void 0:I.numOfLike)||0,rating:(d==null?void 0:d.averageRating)||((w=n.engagement)==null?void 0:w.rating)||(i==null?void 0:i.rating)||4.5,reviewCount:(d==null?void 0:d.totalReviews)||((k=n.engagement)==null?void 0:k.numRatings)||((P=n.engagement)==null?void 0:P.countRating)||0}:null})(),hasData:!!n,totalLikes:o.length}}function l3({isLoading:t=!0,text:e="Loading...",overlay:n=!0,size:r="medium"}){if(!t)return null;const i={small:"spinner-sm",medium:"spinner-md",large:"spinner-lg"},s=()=>y.jsx("div",{className:`mobile-loader-content ${n?"overlay":"inline"}`,children:y.jsxs("div",{className:"loader-spinner-wrapper",children:[y.jsxs("div",{className:`custom-spinner ${i[r]}`,children:[y.jsx("div",{className:"spinner-ring"}),y.jsx("div",{className:"spinner-ring"}),y.jsx("div",{className:"spinner-ring"})]}),e&&y.jsx("p",{className:"loader-text",children:e})]})});return n?y.jsx("div",{className:"mobile-loader-overlay",children:y.jsx(s,{})}):y.jsx(s,{})}const u3=({src:t,alt:e,fallbackSrc:n=G1,className:r=""})=>{const[i,s]=b.useState(null),[o,l]=b.useState(),[u,h]=b.useState(!1),[d,p]=b.useState(!1),g=b.useRef(),S=b.useCallback(L=>{g.current&&g.current.disconnect(),g.current=new IntersectionObserver(I=>{I.forEach(w=>{w.isIntersecting&&(s(t),g.current.disconnect())})},{threshold:.1,rootMargin:"50px"}),L&&g.current.observe(L),l(L)},[t]),A=()=>{h(!0)},N=()=>{p(!0),s(n),h(!0)};return y.jsxs("div",{className:"lazy-image-container",style:{position:"relative"},children:[!u&&y.jsx("div",{className:"image-placeholder",children:y.jsx("div",{className:"image-skeleton"})}),y.jsx("img",{ref:S,src:i||n,alt:e,className:`${r} ${u?"loaded":"loading"}`,onLoad:A,onError:N,loading:"lazy",style:{opacity:u?1:0,transition:"opacity 0.3s ease-in-out"}}),d&&y.jsx("div",{className:"image-error-indicator",children:y.jsx("small",{children:"Using fallback image"})})]})},zy=({rating:t=0,maxStars:e=5,size:n="small",showRating:r=!1,reviewCount:i=null,className:s=""})=>{const o=Math.max(0,Math.min(t,e)),l={small:{width:12,height:12,gap:"2px"},medium:{width:16,height:17,gap:"3px"},large:{width:20,height:21,gap:"4px"}},{width:u,height:h,gap:d}=l[n]||l.small,p=()=>{const g=[];for(let S=1;S<=e;S++){const A=Math.max(0,Math.min(1,o-(S-1)));g.push(y.jsxs("div",{className:"star-container",style:{position:"relative"},children:[y.jsx("svg",{width:u,height:h,viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"star-empty",children:y.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M5.8542 1.20117C5.80112 1.20117 5.67045 1.21576 5.60103 1.35459L4.53587 3.48434C4.36728 3.82092 4.04237 4.05484 3.6667 4.10851L1.28203 4.45209C1.12453 4.47484 1.07087 4.59151 1.05453 4.6405C1.03995 4.68776 1.01662 4.80792 1.12512 4.91176L2.84945 6.56842C3.1242 6.83267 3.24903 7.21359 3.1837 7.58634L2.7777 9.9255C2.75262 10.0719 2.8442 10.1571 2.88503 10.1863C2.9282 10.2189 3.0437 10.2837 3.18662 10.209L5.3187 9.10359C5.6547 8.93034 6.05487 8.93034 6.3897 9.10359L8.5212 10.2084C8.6647 10.2825 8.7802 10.2178 8.82395 10.1863C8.86478 10.1571 8.95637 10.0719 8.93128 9.9255L8.52412 7.58634C8.45878 7.21359 8.58362 6.83267 8.85837 6.56842L10.5827 4.91176C10.6918 4.80792 10.6684 4.68717 10.6533 4.6405C10.6375 4.59151 10.5839 4.47484 10.4264 4.45209L8.0417 4.10851C7.66662 4.05484 7.3417 3.82092 7.17312 3.48376L6.10678 1.35459C6.03795 1.21576 5.90728 1.20117 5.8542 1.20117Z",fill:"#E5E7EB",stroke:"#E5E7EB",strokeWidth:"0.2"})}),A>0&&y.jsx("div",{className:"star-filled",style:{position:"absolute",top:0,left:0,width:`${A*100}%`,overflow:"hidden"},children:y.jsx("svg",{width:u,height:h,viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M9.45251 6.92967C9.30143 7.07609 9.23201 7.28784 9.26643 7.4955L9.78502 10.3655C9.82876 10.6088 9.7261 10.8549 9.52251 10.9955C9.32301 11.1413 9.0576 11.1588 8.84001 11.0422L6.25643 9.69467C6.1666 9.64684 6.06685 9.62117 5.96476 9.61825H5.80668C5.75185 9.62642 5.69818 9.64392 5.64918 9.67075L3.06501 11.0247C2.93726 11.0888 2.7926 11.1116 2.65085 11.0888C2.30551 11.0235 2.0751 10.6945 2.13168 10.3474L2.65085 7.47742C2.68526 7.268 2.61585 7.05509 2.46476 6.90633L0.358348 4.86467C0.182181 4.69375 0.120931 4.43709 0.201431 4.2055C0.279598 3.9745 0.479098 3.80592 0.720015 3.768L3.61918 3.34742C3.83968 3.32467 4.03335 3.1905 4.13251 2.99217L5.41001 0.373001C5.44035 0.314668 5.47943 0.261001 5.52668 0.215501L5.57918 0.174668C5.6066 0.144335 5.6381 0.119251 5.6731 0.0988346L5.73668 0.0755013L5.83585 0.034668H6.08143C6.30076 0.057418 6.49385 0.188668 6.59476 0.384668L7.88918 2.99217C7.98251 3.18292 8.16393 3.31533 8.37335 3.34742L11.2725 3.768C11.5175 3.803 11.7223 3.97217 11.8033 4.2055C11.8798 4.43942 11.8138 4.69608 11.6342 4.86467L9.45251 6.92967Z",fill:"#FF981F"})})})]},S))}return g};return y.jsxs("div",{className:`star-rating ${n} ${s}`,children:[y.jsx("div",{className:"stars-container",style:{gap:d},children:p()}),(r||i)&&y.jsxs("div",{className:"rating-info",children:[r&&y.jsx("span",{className:"rating-value",children:y.jsx("strong",{children:o.toFixed(1)})}),i&&y.jsxs("span",{className:"review-count",children:["(",i>1e3?`${(i/1e3).toFixed(1)}k`:i,"+ reviews)"]})]})]})};function c3({food:t,kitchen:e,selectedDate:n=null,initialQuantity:r=1,onQuantityChange:i=null,onError:s=null,onWarning:o=null}){const[l,u]=b.useState(r),[h,d]=b.useState(null),[p,g]=b.useState(null),S=n?"PRE_ORDER":"GO_GRAB",A=b.useMemo(()=>{var P,V;if(!t)return{isAvailable:!1,maxQuantity:0,minQuantity:1,orderType:"UNKNOWN",reason:"Food data not available"};if(console.log(`[useQuantityManager] Calculating availability for ${S}`,{food:t.name,selectedDate:n,kitchen:e==null?void 0:e.name}),S==="GO_GRAB"){const F=t.numAvailable||((P=t.availability)==null?void 0:P.numAvailable)||0;return{isAvailable:F>0,maxQuantity:Math.max(0,F),minQuantity:1,orderType:"GO_GRAB",reason:F<=0?"Out of stock":null,availableItems:F}}else{if(!e||!e.preorderSchedule)return{isAvailable:!1,maxQuantity:0,minQuantity:1,orderType:"PRE_ORDER",reason:"Pre-order schedule not available"};const E=(V=e.preorderSchedule.dates)==null?void 0:V[n];if(!E)return{isAvailable:!1,maxQuantity:0,minQuantity:1,orderType:"PRE_ORDER",reason:`No schedule available for ${n}`};if(!(E.foodItemId===t.id))return{isAvailable:!1,maxQuantity:0,minQuantity:1,orderType:"PRE_ORDER",reason:`Food not available for pre-order on ${n}`};if(E.isLimitedOrder===!1)return{isAvailable:!0,maxQuantity:1/0,minQuantity:1,orderType:"PRE_ORDER",isUnlimited:!0,reason:null};{const R=E.numOfAvailableItems||0;return{isAvailable:R>0,maxQuantity:Math.max(0,R),minQuantity:1,orderType:"PRE_ORDER",availableItems:R,reason:R<=0?"No items available for pre-order":null}}}},[t,e,n,S]),N=P=>{const{isAvailable:V,maxQuantity:F,minQuantity:E,reason:v,isUnlimited:_}=A;return V?P<E?{isValid:!1,error:`Minimum quantity is ${E}`,correctedQuantity:E}:!_&&P>F?{isValid:!1,error:`Maximum available quantity is ${F}`,correctedQuantity:F,warning:`Only ${F} items available`}:{isValid:!0,error:null,warning:null,correctedQuantity:P}:{isValid:!1,error:v||"Item not available",correctedQuantity:0}},L=()=>{const P=l+1,V=N(P);V.isValid?(u(P),d(null),g(V.warning),i==null||i(P)):(V.correctedQuantity>l&&(u(V.correctedQuantity),i==null||i(V.correctedQuantity)),d(V.error),g(V.warning),s==null||s(V.error),o==null||o(V.warning))},I=()=>{const P=l-1,V=N(P);V.isValid?(u(P),d(null),g(null),i==null||i(P)):(V.correctedQuantity>=A.minQuantity&&(u(V.correctedQuantity),i==null||i(V.correctedQuantity)),d(V.error),s==null||s(V.error))},w=P=>{const V=N(P);V.isValid?(u(P),d(null),g(V.warning),i==null||i(P)):(u(V.correctedQuantity),d(V.error),g(V.warning),i==null||i(V.correctedQuantity),s==null||s(V.error),o==null||o(V.warning))},k=()=>{const P=N(r);u(P.correctedQuantity),d(null),g(null),i==null||i(P.correctedQuantity)};return b.useEffect(()=>{if(t&&A){const P=N(l);!P.isValid&&P.correctedQuantity!==l&&(u(P.correctedQuantity),d(P.error),g(P.warning),i==null||i(P.correctedQuantity),s==null||s(P.error),o==null||o(P.warning))}},[t,e,n,A.isAvailable,A.maxQuantity]),{quantity:l,increment:L,decrement:I,setQuantity:w,resetQuantity:k,error:h,warning:p,availabilityInfo:A,canIncrement:A.isAvailable&&(A.isUnlimited||l<A.maxQuantity),canDecrement:l>A.minQuantity,isValid:A.isAvailable&&l>=A.minQuantity&&(A.isUnlimited||l<=A.maxQuantity)}}function h3({food:t,kitchen:e,selectedDate:n=null,initialQuantity:r=1,onQuantityChange:i=null,onError:s=null,onWarning:o=null,onAvailabilityChange:l=null,showAvailabilityInfo:u=!1,showErrorMessages:h=!0,className:d="",size:p="medium"}){const{quantity:g,increment:S,decrement:A,error:N,warning:L,availabilityInfo:I,canIncrement:w,canDecrement:k,isValid:P}=c3({food:t,kitchen:e,selectedDate:n,initialQuantity:r,onQuantityChange:i,onError:s,onWarning:o});return od.useEffect(()=>{l&&l({isAvailable:I.isAvailable,quantity:g,orderType:I.orderType,maxQuantity:I.maxQuantity,availableItems:I.availableItems,isUnlimited:I.isUnlimited})},[I.isAvailable,g,l]),I.isAvailable?y.jsxs("div",{className:`quantity-selector-wrapper ${d} ${P?"":"invalid"}`,children:[u&&y.jsxs("div",{className:"availability-info",children:[y.jsx("div",{className:"order-type",children:I.orderType==="GO_GRAB"?y.jsx("span",{className:"tag go-grab",children:"Go & Grab"}):y.jsxs("span",{className:"tag pre-order",children:["Pre-Order (",n,")"]})}),I.isUnlimited?y.jsx("div",{className:"availability unlimited",children:"Unlimited Available"}):y.jsxs("div",{className:"availability limited",children:[I.availableItems," Available"]})]}),y.jsxs("div",{className:"right",children:[y.jsx("div",{className:"count",children:g}),y.jsxs("div",{className:"counter",children:[y.jsx("div",{className:`button ${k?"":"disabled"}`,onClick:k?A:void 0,title:k?"Decrease quantity":`Minimum quantity is ${I.minQuantity}`,children:y.jsx("svg",{width:"13",height:"2",viewBox:"0 0 13 2",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("rect",{x:"0.887695",width:"11.6854",height:"1.46067",fill:"white"})})}),y.jsx("div",{className:`button dark ${w?"":"disabled"}`,onClick:w?S:void 0,title:w?"Increase quantity":I.isUnlimited?"":`Maximum available quantity is ${I.maxQuantity}`,children:y.jsxs("svg",{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[y.jsx("path",{d:"M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z",fill:"white"}),y.jsx("path",{d:"M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z",fill:"white"})]})})]})]}),h&&(N||L)&&y.jsxs("div",{className:"messages",children:[N&&y.jsx("div",{className:"error-message",children:N}),L&&y.jsx("div",{className:"warning-message",children:L})]})]}):y.jsxs("div",{className:`quantity-selector-wrapper unavailable ${d}`,children:[u&&I.reason&&y.jsx("div",{className:"availability-error",children:I.reason}),y.jsxs("div",{className:"right disabled",children:[y.jsx("div",{className:"count",children:"0"}),y.jsxs("div",{className:"counter",children:[y.jsx("div",{className:"button disabled",children:y.jsx("svg",{width:"13",height:"2",viewBox:"0 0 13 2",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("rect",{x:"0.887695",width:"11.6854",height:"1.46067",fill:"white"})})}),y.jsx("div",{className:"button disabled",children:y.jsxs("svg",{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[y.jsx("path",{d:"M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z",fill:"white"}),y.jsx("path",{d:"M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z",fill:"white"})]})})]})]})]})}function d3(){const{foodId:t,kitchenId:e}=F2(),[n]=m_(),r=n.get("date"),[i,s]=b.useState("description"),[o,l]=b.useState(1),[u,h]=b.useState({isAvailable:!0,quantity:1,orderType:"GO_GRAB"}),{food:d,kitchen:p,likes:g,reviews:S,reviewStats:A,loading:N,error:L}=a3(t,e);console.log("FoodDetailPage data:",{food:d,kitchen:p,likes:g,reviews:S,reviewStats:A,loading:N,error:L,selectedDate:r});const I=_=>{console.log(`[FoodDetailPage] Quantity changed to: ${_}`),l(_)},w=_=>{console.log("[FoodDetailPage] Availability changed:",_),h(_)},k=_=>{console.error(`[FoodDetailPage] Quantity error: ${_}`)},P=_=>{console.warn(`[FoodDetailPage] Quantity warning: ${_}`)};b.useEffect(()=>{(async()=>{console.log("=== DEBUGGING REVIEWS ==="),console.log("URL params - foodId:",t,"kitchenId:",e,"selectedDate:",r);const T=await s3();if(console.log("Connection test:",T),t){const R=await i3(t);console.log("Debug reviews result:",R)}})()},[t,e,r]);const V=(A==null?void 0:A.averageRating)||4.5,F=(A==null?void 0:A.totalReviews)||0,E=(A==null?void 0:A.ratingPercentages)||{5:90,4:70,3:40,2:20,1:8},v=(S==null?void 0:S.length)>0?S.map(_=>({id:_.id,image:_.userProfile||r3,date:_.timeStamp?(()=>{try{let T;return typeof _.timeStamp=="string"?_.timeStamp.includes(" at ")?T=new Date(_.timeStamp.replace(" at "," ").replace(" UTC+5","")):T=new Date(_.timeStamp):_.timeStamp.seconds?T=new Date(_.timeStamp.seconds*1e3):T=new Date(_.timeStamp),T.toLocaleDateString()}catch(T){return console.warn("Error parsing timestamp:",_.timeStamp),"Unknown date"}})():"Unknown date",name:_.userName||"Anonymous User",rating:_.rating||5,description:_.message||"No comment provided"})):[];return N?y.jsx("div",{className:"container",children:y.jsx("div",{className:"mobile-container",children:y.jsx(l3,{isLoading:N,text:"Loading food details...",overlay:!0,size:"medium"})})}):y.jsx("div",{className:"container",children:y.jsx("div",{className:"mobile-container",children:y.jsxs("div",{className:"product-detail",children:[y.jsxs("div",{className:"padding-20",children:[y.jsx("h2",{className:"title text-center",children:d==null?void 0:d.name}),y.jsxs("h2",{className:"text text-center",children:["By ",d==null?void 0:d.kitchenName]}),r&&y.jsx("div",{className:"order-type-info",children:y.jsxs("div",{className:"order-type-badge pre-order",children:["Pre-Order • ",r]})}),y.jsxs("div",{className:"review-info",children:[y.jsxs("div",{className:"left",children:[y.jsx("div",{children:y.jsx("svg",{width:"15",height:"14",viewBox:"0 0 15 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M13.7499 4.80322L9.97336 4.26881L8.28761 0.940677C8.12458 0.667862 7.82468 0.5 7.50028 0.5C7.17588 0.5 6.87597 0.667862 6.71295 0.940677L5.02719 4.26966L1.25064 4.80322C0.920725 4.84924 0.64636 5.07363 0.543084 5.38188C0.439808 5.69013 0.525567 6.02868 0.764246 6.25497L3.49628 8.84616L2.85154 12.5053C2.79531 12.8246 2.93026 13.1472 3.19965 13.3375C3.46905 13.5279 3.82617 13.553 4.12089 13.4022L7.50028 11.6739L10.8779 13.4005C11.1726 13.5513 11.5298 13.5262 11.7992 13.3358C12.0685 13.1455 12.2035 12.8229 12.1473 12.5036L11.5025 8.84446L14.2363 6.25497C14.4744 6.02885 14.56 5.69094 14.4572 5.38312C14.3543 5.0753 14.0809 4.85087 13.7517 4.80407L13.7499 4.80322Z",fill:"#FBBC04"})})}),y.jsxs("div",{className:"text",children:[y.jsx("strong",{children:p!=null&&p.rating&&(p!=null&&p.ratingCount)?parseFloat(parseInt(p==null?void 0:p.rating)/parseInt(p==null?void 0:p.ratingCount)).toFixed(1):"No ratings yet"}),"(1K+ Reviews)"]})]}),y.jsx("div",{className:"line"}),y.jsxs("div",{className:"left",children:[y.jsx("div",{children:y.jsxs("svg",{width:"17",height:"16",viewBox:"0 0 17 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[y.jsx("path",{d:"M10.1667 6.00016C10.1667 6.92063 9.42051 7.66683 8.50004 7.66683C7.57957 7.66683 6.83337 6.92063 6.83337 6.00016C6.83337 5.07969 7.57957 4.3335 8.50004 4.3335C9.42051 4.3335 10.1667 5.07969 10.1667 6.00016Z",stroke:"#3FC045"}),y.jsx("path",{d:"M12.6481 11.3335C13.5778 12.6592 14.0225 13.3652 13.7576 13.9334C13.731 13.9904 13.6999 14.0454 13.6646 14.098C13.2816 14.6668 12.2916 14.6668 10.3118 14.6668H6.68811C4.7083 14.6668 3.71839 14.6668 3.33536 14.098C3.29999 14.0454 3.26888 13.9904 3.24232 13.9334C2.97742 13.3652 3.42213 12.6592 4.35181 11.3335",stroke:"#3FC045","stroke-linecap":"round","stroke-linejoin":"round"}),y.jsx("path",{d:"M9.33831 11.6626C9.11344 11.8791 8.81291 12.0002 8.50017 12.0002C8.18737 12.0002 7.88684 11.8791 7.66197 11.6626C5.60291 9.66736 2.8435 7.4385 4.18918 4.20265C4.91677 2.45304 6.66333 1.3335 8.50017 1.3335C10.337 1.3335 12.0835 2.45305 12.8111 4.20265C14.1551 7.43443 11.4024 9.67423 9.33831 11.6626Z",stroke:"#3FC045"})]})}),y.jsx("div",{className:"text",children:(p==null?void 0:p.address)||"Unknown location"})]})]}),y.jsxs("div",{className:"product-image",children:[y.jsx("div",{className:"icon",children:y.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M9.80568 16.3852C9.53252 16.4816 9.08261 16.4816 8.80945 16.3852C6.47955 15.5898 1.27344 12.2717 1.27344 6.64781C1.27344 4.16527 3.27393 2.15674 5.74041 2.15674C7.20262 2.15674 8.49612 2.86374 9.30756 3.95638C10.119 2.86374 11.4205 2.15674 12.8747 2.15674C15.3412 2.15674 17.3417 4.16527 17.3417 6.64781C17.3417 12.2717 12.1356 15.5898 9.80568 16.3852Z",stroke:"#FF5555","stroke-width":"1.20512","stroke-linecap":"round","stroke-linejoin":"round"})})}),y.jsx(u3,{src:d==null?void 0:d.imageUrl,alt:(d==null?void 0:d.name)||"Product",fallbackSrc:G1,className:""})]}),y.jsxs("div",{className:"quantity-warpper",children:[y.jsxs("div",{className:"price",children:[y.jsx("sup",{children:"$"}),(d==null?void 0:d.cost)&&parseFloat(d==null?void 0:d.cost).toFixed(2)]}),y.jsx(h3,{food:d,kitchen:p,selectedDate:r,initialQuantity:1,onQuantityChange:I,onAvailabilityChange:w,onError:k,onWarning:P,showAvailabilityInfo:!1,showErrorMessages:!0,size:"medium",className:"food-detail-quantity"})]})]}),y.jsx("div",{className:"hr"}),y.jsxs("div",{className:"padding-20",children:[y.jsx("h3",{className:"small-title mb-8",children:"Special Instruction"}),y.jsx("p",{className:"body-text mb-16",children:"Please let us know if you are allergic to anything or if we need to avoid anything ."}),y.jsx("div",{className:"product-info mb-20"}),y.jsxs("div",{className:"custom-accordian",children:[y.jsx("button",{className:`button${i==="description"?" active":""}`,onClick:()=>s("description"),children:"Description"}),y.jsx("button",{className:`button${i==="reviews"?" active":""}`,onClick:()=>s("reviews"),children:"Reviews"})]}),y.jsxs("div",{className:"accordian-content",children:[i==="description"&&y.jsx("div",{className:"description-content",children:(d==null?void 0:d.description)||"No description available."}),i==="reviews"&&y.jsxs("div",{className:"reviews-content",children:[y.jsxs("div",{className:"overall-reviews",children:[y.jsxs("div",{className:"left",children:[y.jsx("div",{className:"bold",children:V>0?V.toFixed(1):"No ratings yet"}),y.jsx(zy,{rating:V,size:"small",showRating:!1}),y.jsxs("div",{className:"body-text",children:["(",F,"+ reviews)"]})]}),y.jsx("div",{className:"line"}),y.jsx("div",{className:"right",children:[5,4,3,2,1].map(_=>y.jsxs("div",{className:"review",children:[y.jsx("div",{className:"text",children:_}),y.jsx("div",{className:"progress-bar",children:y.jsx("div",{className:"fill",style:{width:`${E[_]}%`}})})]},_))})]}),y.jsx("div",{className:"reviews-list",children:v.map((_,T)=>y.jsxs("div",{className:"review-item",children:[y.jsxs("div",{className:"header",children:[y.jsxs("div",{className:"profile",children:[y.jsx("img",{src:_.image,alt:_.name,className:"image"}),y.jsxs("div",{className:"data",children:[y.jsx("div",{className:"name",children:_.name}),y.jsx("div",{className:"rating",children:y.jsx(zy,{rating:_.rating||5,size:"small",showRating:!1})}),y.jsx("div",{className:"date",children:_.date})]})]}),y.jsx("div",{className:"icon"})]}),y.jsx("div",{className:"description",children:_.description})]},_.id||T))})]})]}),y.jsxs("div",{className:"add-to-cart-action",children:[y.jsx("button",{className:"button",children:"Add to Cart"}),y.jsx("div",{className:"icon",children:y.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[y.jsx("path",{d:"M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z",stroke:"white","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"}),y.jsx("path",{d:"M3 6H21",stroke:"white","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"}),y.jsx("path",{d:"M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10",stroke:"white","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"})]})})]})]})]})})})}const f3="/assets/order1-D4-quvXg.png",p3="/assets/order2-CvB8ifzw.png";function m3(){return y.jsx("div",{className:"container",children:y.jsx("div",{className:"mobile-container",children:y.jsxs("div",{className:"padding-20 order-page",children:[y.jsxs("div",{className:"top",children:[y.jsxs("div",{className:"back-link-title",children:[y.jsx(tf,{className:"back-link",children:y.jsx("svg",{width:"9",height:"14",viewBox:"0 0 9 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M7.94194 0.51631C8.18602 0.760388 8.18602 1.15612 7.94194 1.40019L2.34222 6.99992L7.94194 12.5996C8.18602 12.8437 8.18602 13.2394 7.94194 13.4835C7.69786 13.7276 7.30214 13.7276 7.05806 13.4835L1.01639 7.44186C0.772315 7.19778 0.772315 6.80205 1.01639 6.55798L7.05806 0.51631C7.30214 0.272233 7.69786 0.272233 7.94194 0.51631Z",fill:"#212226"})})}),y.jsx("div",{className:"title",children:"Order"})]}),y.jsxs("div",{className:"orders-top",children:[y.jsx("div",{className:"text",children:"3 Item in the Cart"}),y.jsx("div",{className:"action",children:"Remove all"})]}),y.jsxs("div",{className:"order-item",children:[y.jsxs("div",{className:"left",children:[y.jsx("div",{className:"image",children:y.jsx("img",{src:f3,alt:"Order image"})}),y.jsxs("div",{className:"data",children:[y.jsx("div",{className:"title",children:"Dim Sum (Dumplings)"}),y.jsx("div",{className:"cusine",children:"Chinese"}),y.jsx("div",{className:"price",children:"$18.2"})]})]}),y.jsxs("div",{className:"counter",children:[y.jsx("div",{className:"action dec",children:y.jsx("svg",{width:"12",height:"2",viewBox:"0 0 12 2",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M1.33325 1H10.6666",stroke:"#3FC045","stroke-width":"0.875","stroke-linecap":"round"})})}),y.jsx("div",{className:"count",children:"1"}),y.jsx("div",{className:"action inc",children:y.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M1.33325 6.00016H10.6666M5.99992 10.6668V6.00016L5.99992 1.3335",stroke:"white","stroke-width":"0.875","stroke-linecap":"round"})})})]})]}),y.jsxs("div",{className:"order-item",children:[y.jsxs("div",{className:"left",children:[y.jsx("div",{className:"image",children:y.jsx("img",{src:p3,alt:"Order image"})}),y.jsxs("div",{className:"data",children:[y.jsx("div",{className:"title",children:"Margherita Pizza"}),y.jsx("div",{className:"cusine",children:"Chinese"}),y.jsx("div",{className:"price",children:"$10.21"})]})]}),y.jsxs("div",{className:"counter",children:[y.jsx("div",{className:"action dec",children:y.jsx("svg",{width:"12",height:"2",viewBox:"0 0 12 2",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M1.33325 1H10.6666",stroke:"#3FC045","stroke-width":"0.875","stroke-linecap":"round"})})}),y.jsx("div",{className:"count",children:"2"}),y.jsx("div",{className:"action inc",children:y.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M1.33325 6.00016H10.6666M5.99992 10.6668V6.00016L5.99992 1.3335",stroke:"white","stroke-width":"0.875","stroke-linecap":"round"})})})]})]})]}),y.jsx("button",{className:"action-button",children:"Continue"})]})})})}const g3="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M6.66675%201.6665V4.1665'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.66675%201.6665V4.1665'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.66675%201.6665V4.1665'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M13.3333%201.6665V4.1665'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M13.3333%201.6665V4.1665'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M13.3333%201.6665V4.1665'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M2.91675%207.5752H17.0834'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M2.91675%207.5752H17.0834'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M2.91675%207.5752H17.0834'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M17.5%207.08317V14.1665C17.5%2016.6665%2016.25%2018.3332%2013.3333%2018.3332H6.66667C3.75%2018.3332%202.5%2016.6665%202.5%2014.1665V7.08317C2.5%204.58317%203.75%202.9165%206.66667%202.9165H13.3333C16.25%202.9165%2017.5%204.58317%2017.5%207.08317Z'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M17.5%207.08317V14.1665C17.5%2016.6665%2016.25%2018.3332%2013.3333%2018.3332H6.66667C3.75%2018.3332%202.5%2016.6665%202.5%2014.1665V7.08317C2.5%204.58317%203.75%202.9165%206.66667%202.9165H13.3333C16.25%202.9165%2017.5%204.58317%2017.5%207.08317Z'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M17.5%207.08317V14.1665C17.5%2016.6665%2016.25%2018.3332%2013.3333%2018.3332H6.66667C3.75%2018.3332%202.5%2016.6665%202.5%2014.1665V7.08317C2.5%204.58317%203.75%202.9165%206.66667%202.9165H13.3333C16.25%202.9165%2017.5%204.58317%2017.5%207.08317Z'%20stroke='%233FC045'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M9.99632%2011.4167H10.0038'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M9.99632%2011.4167H10.0038'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M9.99632%2011.4167H10.0038'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.91185%2011.4167H6.91933'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.91185%2011.4167H6.91933'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.91185%2011.4167H6.91933'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.91185%2013.9167H6.91933'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.91185%2013.9167H6.91933'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.91185%2013.9167H6.91933'%20stroke='%233FC045'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",y3="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M9.16675%201.66699H7.50008C3.33341%201.66699%201.66675%203.33366%201.66675%207.50033V12.5003C1.66675%2016.667%203.33341%2018.3337%207.50008%2018.3337H12.5001C16.6667%2018.3337%2018.3334%2016.667%2018.3334%2012.5003V10.8337'%20stroke='%233FC045'%20stroke-width='1.25'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M13.3668%202.51639L6.80014%209.08306C6.55014%209.33306%206.30014%209.82472%206.25014%2010.1831L5.89181%2012.6914C5.75848%2013.5997%206.40014%2014.2331%207.30848%2014.1081L9.81681%2013.7497C10.1668%2013.6997%2010.6585%2013.4497%2010.9168%2013.1997L17.4835%206.63306C18.6168%205.49972%2019.1501%204.18306%2017.4835%202.51639C15.8168%200.849722%2014.5001%201.38306%2013.3668%202.51639Z'%20stroke='%233FC045'%20stroke-width='1.25'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M12.425%203.45801C12.9834%205.44967%2014.5417%207.00801%2016.5417%207.57467'%20stroke='%233FC045'%20stroke-width='1.25'%20stroke-miterlimit='10'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",v3="/assets/map-D7B-IPhe.png";/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _3=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w3=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,n,r)=>r?r.toUpperCase():n.toLowerCase()),qy=t=>{const e=w3(t);return e.charAt(0).toUpperCase()+e.slice(1)},eE=(...t)=>t.filter((e,n,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===n).join(" ").trim(),E3=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var I3={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T3=b.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:i="",children:s,iconNode:o,...l},u)=>b.createElement("svg",{ref:u,...I3,width:e,height:e,stroke:t,strokeWidth:r?Number(n)*24/Number(e):n,className:eE("lucide",i),...!s&&!E3(l)&&{"aria-hidden":"true"},...l},[...o.map(([h,d])=>b.createElement(h,d)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S3=(t,e)=>{const n=b.forwardRef(({className:r,...i},s)=>b.createElement(T3,{ref:s,iconNode:e,className:eE(`lucide-${_3(qy(t))}`,`lucide-${t}`,r),...i}));return n.displayName=qy(t),n};/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k3=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],Hy=S3("copy",k3);function C3(){const[t,e]=b.useState(!1);return y.jsx("div",{className:"container",children:y.jsx("div",{className:"mobile-container",children:y.jsxs("div",{className:"padding-20 order-page",children:[y.jsxs("div",{className:"top",children:[y.jsxs("div",{className:"back-link-title",children:[y.jsx(tf,{className:"back-link",children:y.jsx("svg",{width:"9",height:"14",viewBox:"0 0 9 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M7.94194 0.51631C8.18602 0.760388 8.18602 1.15612 7.94194 1.40019L2.34222 6.99992L7.94194 12.5996C8.18602 12.8437 8.18602 13.2394 7.94194 13.4835C7.69786 13.7276 7.30214 13.7276 7.05806 13.4835L1.01639 7.44186C0.772315 7.19778 0.772315 6.80205 1.01639 6.55798L7.05806 0.51631C7.30214 0.272233 7.69786 0.272233 7.94194 0.51631Z",fill:"#212226"})})}),y.jsx("div",{className:"title",children:"Checkout"})]}),y.jsx("h3",{className:"medium-title mb-16",children:"Select Pickup Date & Time"}),y.jsxs("div",{className:"date-selection",children:[y.jsxs("div",{className:"left",children:[y.jsx("button",{className:"action",children:y.jsx("img",{src:g3,alt:""})}),y.jsxs("div",{className:"data",children:[y.jsx("div",{className:"title",children:"Select Pickup Date & Time"}),y.jsx("div",{className:"date",children:"Date , Time"})]})]}),y.jsx("button",{className:"action",children:y.jsx("img",{src:y3,alt:""})})]}),y.jsx("h4",{className:"medium-title mb-12",children:"Pickup Address"}),y.jsx("p",{className:"body-text-med mb-20",children:"120 Lane San Fransisco , East Falmouth MA"}),y.jsx("div",{className:"map-container",children:y.jsx("img",{src:v3,alt:""})}),y.jsx("div",{className:"hr mb-18"}),y.jsxs("button",{className:"add-address mb-20",children:[y.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M3 9H15M9 15V9L9 3",stroke:"#3FC045","stroke-width":"1.5","stroke-linecap":"round"})}),"Add New Address"]}),y.jsxs("div",{className:"payment-method mb-20",children:[y.jsx("h5",{className:"medium-title mb-20",children:"Payment Method"}),y.jsx("div",{className:"hr mb-20"}),y.jsxs("div",{className:"other-payment-fee",children:[y.jsxs("div",{className:"left",children:[y.jsx("div",{className:"icon",children:"$"}),y.jsx("span",{children:"Other Pyaments (No Fee)"})]}),y.jsx("input",{type:"radio",className:"input",checked:t,onChange:()=>e(!0)})]})]}),t&&y.jsxs("div",{className:"other-payments-wrapper mb-20",children:[y.jsx("h2",{className:"title",children:"Other Payments acceptable to James Kitchen Kitchen"}),y.jsxs("div",{className:"item-flex",children:[y.jsxs("div",{className:"left",children:[y.jsx("div",{className:"text",children:"PayPal to"}),y.jsx("a",{className:"email",children:"jamesPayPal00@gmail.com"})]}),y.jsxs("div",{className:"copy",children:[y.jsx(Hy,{}),"  Copy"]})]}),y.jsxs("div",{className:"item-flex",children:[y.jsxs("div",{className:"left",children:[y.jsx("div",{className:"text",children:"Venmo to"}),y.jsx("a",{className:"email",children:"jamesVenmo00@gmail.com"})]}),y.jsxs("div",{className:"copy",children:[y.jsx(Hy,{}),"  Copy"]})]})]}),y.jsxs("div",{className:"payment-method mb-20",children:[y.jsx("h5",{className:"medium-title mb-20",children:"Payment Details"}),y.jsx("div",{className:"hr mb-20"}),y.jsxs("div",{className:"item-flex",children:[y.jsx("span",{children:"Sales Tax (7.25%)"}),y.jsx("span",{children:"$6.00"})]}),y.jsxs("div",{className:"item-flex",children:[y.jsx("span",{children:"Service Fee (10%)"}),y.jsx("span",{children:"$6.00"})]}),y.jsxs("div",{className:"item-flex",children:[y.jsx("span",{children:"Grand Subtotal"}),y.jsx("span",{children:"$6.00"})]}),y.jsxs("div",{className:"item-flex",children:[y.jsx("span",{children:"Service Fee"}),y.jsx("span",{children:"$1.00"})]}),y.jsx("div",{className:"hr mb-12"}),y.jsxs("div",{className:"item-flex bold",children:[y.jsx("span",{children:"Total Payment"}),y.jsx("span",{children:"$19.00"})]})]})]}),y.jsx("button",{className:"action-button",children:"Place My Order"})]})})})}function A3(){return y.jsxs("div",{className:"container py-5 text-center",children:[y.jsx("div",{className:"display-6 mb-3",style:{fontSize:"2rem"},children:"✅ Success"}),y.jsx("p",{className:"text-secondary small mb-4",children:"Your order has been placed (placeholder confirmation)."}),y.jsx(tf,{to:"/foods",className:"btn btn-outline-primary btn-sm",children:"Back to Listing"})]})}function R3(){const{user:t,initializing:e}=wu(),n=Zr();return e?y.jsx("div",{className:"d-flex vh-100 align-items-center justify-content-center",children:"Loading..."}):t?y.jsx(eS,{}):y.jsx(Z2,{to:"/login",replace:!0,state:{from:n}})}function P3(){return y.jsxs(nS,{children:[y.jsx(jt,{path:"/",element:y.jsx(Uy,{})}),y.jsx(jt,{path:"/foods",element:y.jsx(Uy,{})}),y.jsx(jt,{path:"/food/:kitchenId/:foodId",element:y.jsx(d3,{})}),y.jsx(jt,{path:"/order",element:y.jsx(m3,{})}),y.jsx(jt,{path:"/payment",element:y.jsx(C3,{})}),y.jsx(jt,{path:"/success",element:y.jsx(A3,{})}),y.jsx(jt,{path:"/login",element:y.jsx(t3,{})}),y.jsx(jt,{path:"/wechat/callback",element:y.jsx(n3,{})}),y.jsx(jt,{element:y.jsx(R3,{}),children:y.jsx(jt,{path:"/home",element:y.jsx(ZN,{})})})]})}i_(document.getElementById("root")).render(y.jsx(od.StrictMode,{children:y.jsx(cS,{children:y.jsx(XN,{children:y.jsx(P3,{})})})}));
