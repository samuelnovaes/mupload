parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"GUTg":[function(require,module,exports) {
"use strict";!function(){var n=function(n){var e=document.createElement("div");return Object.assign(e.style,{zIndex:"100000",position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",backgroundColor:"rgba(0, 0, 0, 0.1)"}),n.appendChild(e),e},e=function(n){var e=document.createElement("div");return Object.assign(e.style,{padding:"16px",position:"fixed",left:"50%",top:"50%",transform:"translate(-50%, -50%)",width:"383px",maxWidth:"calc(100% - 20px)",wordWrap:"break-word",boxSizing:"border-box",backgroundColor:"#f5f5f5",borderRadius:"3px",fontFamily:"Arial, Helvetica, sans-serif",fontSize:"11pt",border:"1px solid #888",boxShadow:"0 0 10px rgba(0, 0, 0, 0.5)"}),n.appendChild(e),e},o=function(n){var e=document.createElement("button");return Object.assign(e.style,{padding:"6px",width:"80px",border:"1px solid #888",borderRadius:"2px",boxSizing:"border-box",backgroundColor:"rgba(0, 0, 0, 0)"}),n.appendChild(e),e},t=function(n){var e=o(n);return e.innerText="OK",Object.assign(e.style,{float:"right",backgroundColor:"#1976D2",borderColor:"#1976D2",color:"#fff"}),e},i=function(n){var e=document.createElement("p");return Object.assign(e.style,{marginTop:"0",maxHeight:"200px",overflow:"auto"}),n.appendChild(e),e},r=function(n){var e=o(n);return e.innerText="Cancel",Object.assign(e.style,{float:"right",marginRight:"8px"}),e};window._alert=function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=n(document.body),d=e(r),c=i(d),a=t(d);return c.innerText=o,a.focus(),new Promise(function(n){a.onclick=function(){document.body.removeChild(r),n()}})},window._confirm=function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",d=n(document.body),c=e(d),a=i(c),u=t(c),l=r(c);return a.innerText=o,u.focus(),new Promise(function(n){u.onclick=function(){document.body.removeChild(d),n(!0)},l.onclick=function(){document.body.removeChild(d),n(!1)}})},window._prompt=function(){var o,d,c=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",u=n(document.body),l=e(u),b=i(l),p=(o=l,(d=document.createElement("input")).type="text",Object.assign(d.style,{width:"100%",padding:"5px",boxSizing:"border-box",marginBottom:"16px",border:"1px solid #888"}),o.appendChild(d),d),s=t(l),f=r(l);return b.innerText=c,p.value=a,p.focus(),new Promise(function(n){p.onkeyup=function(e){13===e.keyCode&&(document.body.removeChild(u),n(p.value))},s.onclick=function(){document.body.removeChild(u),n(p.value)},f.onclick=function(){document.body.removeChild(u),n(null)}})}}();
},{}]},{},["GUTg"], null)
//# sourceMappingURL=/nbdialog.f595ea3f.js.map