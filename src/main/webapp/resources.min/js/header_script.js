"use strict";function initUserMenu(){const n=document.querySelector(".user-account .user"),i=document.querySelector(".user-account .menu");null!==n&&null!==i&&(n.addEventListener("click",function(n){i.style.display="block"}),document.addEventListener("click",function(n){i.style.display="none"},!0))}const notifications={loading:!1,init:!1};function initUserNotifications(){"-1"!==appConf.user_id&&(notifications.container=document.querySelector(".user-notifications"),notifications.btn=notifications.container.querySelector(".action"),notifications.panel=notifications.container.querySelector(".panel"),notifications.loader=notifications.container.querySelector(".loader"),notifications.empty=notifications.container.querySelector(".empty"),notifications.error=notifications.container.querySelector(".error"),notifications.btn.addEventListener("click",function(){notifications.loading||notifications.init?notifications.panel.style.display="block":(notifications.panel.style.display="block",notifications.loading=!0,notifications.loader.style.display="flex",xhr.request({method:"GET",path:"/services/users/notices/"+appConf.user_id},function(n,i){if(n){const i=JSON.parse(n);if(0===i.length)notifications.empty.style.display="block";else for(let n=0;n<i.length;n++){let t=document.createElement("div");t.classList.add("element"),t.innerHTML=i[n].message,notifications.panel.insertBefore(t,notifications.loader)}notifications.container.querySelector(".nums").style.display="none",notifications.init=!0}else i&&(notifications.error.style.display="block");notifications.loading=!1,notifications.loader.style.display="none"}))}),document.addEventListener("click",function(){notifications.panel.style.display="none"},!0))}function initMaterialize(){let n=document.querySelectorAll(".sidenav");M.Sidenav.init(n,{});let i=document.querySelectorAll(".collapsible"),t=null;i.length>0&&(t=i[0].querySelector(".collapsible-body")),M.Collapsible.init(i,{accordion:!1,onCloseEnd:function(){t.style.display="none"},onOpenStart:function(){t.style.display="block"}})}document.addEventListener("DOMContentLoaded",function(){initUserMenu(),initUserNotifications(),initMaterialize()});