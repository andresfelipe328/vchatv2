"use strict";(self.webpackChunkvchat=self.webpackChunkvchat||[]).push([[734],{9734:function(e,s,i){i.r(s);var t=i(2791),n=i(7689),l=i(5331),o=i(9126),a=i(8617),m=i(7069),r=i(184);s.default=function(e){var s=e.data,i=e.messages,c=e.setShowReply,u=e.setReplyToMsg,d=(0,n.UO)(),x=d.id,f=d.subID,h=(0,t.useRef)(null);(0,t.useEffect)((function(){l.ZP.fromTo(h.current,{x:-10,opacity:0},{duration:1,x:0,opacity:1,delay:.15,ease:"elastic.out(1, 0.75)"})}),[x,f]);var g=function(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{className:"flex items-end gap-2",children:[(0,r.jsx)("div",{className:"relative w-[7.05rem] h-[7.05rem] rounded-full bg-mainBg flex items-center justify-center",children:(0,r.jsx)("img",{src:s.roomIcon,alt:"user Icon",className:"w-[6.75rem] h-[6.75rem] rounded-full object-cover"})}),(0,r.jsxs)("h1",{children:[" ",s.roomName," "]})]}),(0,r.jsxs)("h4",{className:"mb-2 text-light_1/[.65] text-xs",children:[" This is the beginning of ",s.roomName," Room."]})]})},v=function(){for(var e,i,t,n,l=0;l<s.mainRooms.length&&!(n=s.mainRooms[l].miniRooms.find((function(e){return e.miniRoomID===f})));++l);var m="text"===(null===(e=n)||void 0===e?void 0:e.miniRoomType)?(0,r.jsx)(o.Ohv,{className:"text-light_1/[.65]"}):(0,r.jsx)(a.xkz,{className:"text-light_1/[.65]"});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"flex items-end gap-2",children:(0,r.jsxs)("h1",{className:"flex items-center gap-2",children:["Welcome to - ",m," ",null===(i=n)||void 0===i?void 0:i.miniRoomName]})}),(0,r.jsxs)("h4",{className:"mb-2 text-light_1/[.65] text-xs",children:[" This is the beginning of ",null===(t=n)||void 0===t?void 0:t.miniRoomName," mini Room."]})]})};return(0,r.jsxs)("div",{className:"flex flex-col h-full justify-start overflow-auto p-2",ref:h,children:[(0,r.jsx)("div",{className:"flex flex-col gap-2 border-b-2 border-light_1/[.7] mt-auto",children:function(){if(s)return f===s.mainMiniRoom?g():v()}()}),i&&(0,r.jsx)("ul",{className:"flex flex-col gap-1 p-2",id:"messages",children:i.map((function(e){return(0,r.jsx)(m.Z,{messages:i,message:e,setShowReply:c,setReplyToMsg:u},e.msgID)}))})]})}}}]);
//# sourceMappingURL=734.fa961b35.chunk.js.map