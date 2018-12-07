"use strict";let freeEmail=!0,freeLogin=!0,lastEmail="",lastLogin="";document.addEventListener("DOMContentLoaded",function(){const e={loginInput:document.getElementById("login"),loginError:document.getElementById("login_error"),passwordInput:document.getElementById("password"),passwordError:document.getElementById("password_error"),confirmPasswordInput:document.getElementById("confirm-password"),confirmPasswordError:document.getElementById("confirm_password_error"),emailInput:document.getElementById("email"),emailError:document.getElementById("email_error")};function t(e){let t=e.input.value;if("email"===e.type){if(freeEmail=!0,!o()||""===t||t===lastEmail)return;lastEmail=t}else if("login"===e.type){if(freeLogin=!0,!r()||""===t||t===lastLogin)return;lastLogin=t}xhr.request({method:"POST",path:"/services/register/exists",headers:{"Content-Type":"application/json"},content:JSON.stringify({type:e.type,value:e.input.value})},function(t,n,r){204!==r?(e.label.innerText=e.text,e.label.style.display="block",i(e.input),"email"===e.type?freeEmail=!1:(e.type="login")&&(freeLogin=!1)):"email"===e.type?freeEmail=!0:(e.type="login")&&(freeLogin=!0)})}function n(e){e.addEventListener("focus",function e(t){const n=t.currentTarget.parentElement.querySelector(".server-error");null!=n&&(n.style.display="none");t.currentTarget.removeEventListener("focus",e)})}function r(){return l({elem:e.loginInput,error:e.loginError,check:[{bool:e.loginInput.value.length>=5&&e.loginInput.value.length<=32,text:"Длина логина должна быть от 5 до 32 символов"},{bool:/^[A-z|0-9|_]+$/.test(e.loginInput.value),text:"Логин может состоять только из символов A-z, 0-9, _"}]})&&freeLogin}function o(){return l({elem:e.emailInput,error:e.emailError,check:[{bool:e.emailInput.value.length>=5&&e.emailInput.value.length<=50,text:"Длина e-mail должна быть от 5 до 50 символов"},{bool:/^[A-z|0-9|_|.]+?@[A-z]+?\.[A-z]+?$/.test(e.emailInput.value),text:"Неверный формат e-mail"}]})&&freeEmail}function l(e){let t=!0,n=e.check;for(let r=0;r<n.length;r++)if(!n[r].bool)return e.error.innerText=n[r].text,e.error.style.display="block",i(e.elem),t=!1,!1;return t}function i(e){e.addEventListener("focus",function e(t){t.currentTarget.nextElementSibling.style.display="none";t.currentTarget.removeEventListener("focus",e)})}e.submit=document.querySelector(".actions .send input"),e.form=document.querySelector(".reg-form"),e.submit.addEventListener("click",function(t){r()&&l({elem:e.passwordInput,error:e.passwordError,check:[{bool:e.passwordInput.value.length>=5&&e.passwordInput.value.length<=32,text:"Длина пароля должна быть от 5 до 32 символов"},{bool:/^[A-z|А-я|0-9|_]+$/.test(e.passwordInput.value),text:"Пароль может состоять только из символов A-z, А-я, 0-9, _"}]})&&l({elem:e.confirmPasswordInput,error:e.confirmPasswordError,check:[{bool:e.passwordInput.value===e.confirmPasswordInput.value,text:"Пароли не совпадают"}]})&&o()?e.form.submit():t.preventDefault()}),e.emailInput.addEventListener("blur",function(){t({type:"email",label:e.emailError,input:e.emailInput,text:"Аккаунт с таким email уже существует"})}),e.loginInput.addEventListener("blur",function(){t({type:"login",label:e.loginError,input:e.loginInput,text:"Логин уже занят"})}),n(e.loginInput),n(e.passwordInput),n(e.confirmPasswordInput),n(e.emailInput)});