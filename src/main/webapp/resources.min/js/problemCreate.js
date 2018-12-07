"use strict";const editors={quillOptions:{theme:"bubble",placeholder:"Опишите условия задачи",fontSize:"20",modules:{toolbar:[[{size:["small",!1,"large","huge"]}],["bold","italic","underline","strike"],["direction",{align:["","center","right","justify"]}],["code-block","blockquote",{list:"ordered"},{list:"bullet"}],["link","image"]]}},problemEditor:document.querySelector("#problem-editor"),solutionEditor:document.querySelector("#solution-editor"),panelSelectors:document.querySelectorAll(".panels .top .select")},selectDifficult={selectTitle:document.querySelector(".select-difficult .title"),selectTitleSpan:document.querySelector(".select-difficult .title span"),selectContent:document.querySelector(".select-difficult .content"),options:document.querySelectorAll(".select-difficult .select-element")},inputs={difficultSpan:document.querySelector(".select-difficult .title span"),titleInput:document.querySelector("#title"),tagsObjects:tags.tagsCount,qlProblemEditor:null,qlSolutionEditor:null,answerInput:document.querySelector(".answer input"),edit:!0};function initIfEdit(){if(null===document.getElementById("_edit"))return void(inputs.edit=!1);let e=document.getElementById("difficult_edit"),t=document.getElementById("title_edit"),i=document.getElementById("tags_edit"),l=i.children,n=document.getElementById("problem_edit"),o=document.getElementById("answer_edit");inputs.problemId=document.getElementById("problem_id").getAttribute("content"),inputs.difficultSpan.innerText=e.innerText,selectDifficult.difficult=e.getAttribute("content"),inputs.titleInput.value=t.innerText;for(let e=0;e<l.length;e++){let t=l[e],i=document.createElement("div"),n=t.getAttribute("name"),o=t.getAttribute("color"),r=t.getAttribute("content");i.classList.add("selected-tag","chip"),i.style.background=o,i.innerText=n,i.style.color="#ffffff",i.setAttribute("content",r),i.addEventListener("click",deleteTagOnClick),tags.tagsCount[r]=1,tags.tagsInputContainer.insertBefore(i,tags.tagsInputContainer.lastElementChild)}upPlaceholder(),inputs.qlProblemEditor.innerHTML=n.innerHTML.trim(),inputs.answerInput.value=o.innerText.trim(),e.parentNode.removeChild(e),t.parentNode.removeChild(t),i.parentNode.removeChild(i),n.parentNode.removeChild(n),o.parentNode.removeChild(o)}function initEditors(){editors.quillProblem=new Quill(editors.problemEditor,editors.quillOptions),editors.quillOptions.placeholder="Опишите решение задачи",editors.quillSolution=new Quill(editors.solutionEditor,editors.quillOptions),initQuillEditor(editors.problemEditor),editors.currentSelector=editors.panelSelectors[0],inputs.qlProblemEditor=document.querySelector("#problem-panel .ql-editor");let e=editors.panelSelectors;for(let t=0;t<e.length;t++)e[t].addEventListener("click",function(e){let t=editors.currentSelector,i=e.currentTarget;document.getElementById(t.getAttribute("content")).style.display="none",t.classList.remove("active"),document.getElementById(i.getAttribute("content")).style.display="block",i.classList.add("active"),editors.currentSelector=i});editors.panelSelectors[1].addEventListener("click",function e(){initQuillEditor(editors.solutionEditor);inputs.qlSolutionEditor=document.querySelector("#solution-panel .ql-editor");if(inputs.edit){let e=document.getElementById("solution_edit");inputs.qlSolutionEditor.innerHTML=e.innerHTML.trim(),e.parentNode.removeChild(e)}editors.panelSelectors[1].removeEventListener("click",e)})}function initDifficultSelect(){selectDifficult.selectTitle.addEventListener("click",function(){selectDifficult.selectContent.style.display="block"});let e=selectDifficult.options;for(let t=0;t<e.length;t++)e[t].addEventListener("click",function(e){selectDifficult.difficult=e.currentTarget.getAttribute("content"),selectDifficult.selectTitleSpan.innerText=e.currentTarget.innerText});document.addEventListener("click",function(){selectDifficult.selectContent.style.display="none"},!0)}let creating=!1;function initCreator(){document.querySelector("#create-problem").addEventListener("click",function(e){if(creating)return;let t=selectDifficult.difficult,i=inputs.titleInput.value,l=Object.keys(inputs.tagsObjects),n=editors.quillProblem.getText(),o=editors.quillSolution.getText(),r=inputs.answerInput.value;if(void 0===t)return void modal.error("Вы не выбрали уровень задачи");if(i.length<10||i.length>100)return void modal.error("Длина заголовка должна быть от 10 до 100 символов");if(l.length<3||l.length>5)return void modal.error("Количество тегов должно быть от 3-х до 5");if(n.length<100||n.length>1e4)return void modal.error("Количество символов в условии задачи не может быть меньше 100 и превышать 10000");if(o.length<100||o.length>1e4)return void modal.error("Количество символов в решении задачи не может быть меньше 100 и превышать 10000");if(r.length<1||r.length>100)return void modal.error("Длина ответа задачи не может быть больше 100 символов");creating=!0;const c={title:i,tags:l,difficult:t,problemContent:inputs.qlProblemEditor.innerHTML,solutionContent:inputs.qlSolutionEditor.innerHTML,answer:r};inputs.edit?updateProblem(c):createProblem(c)})}function createProblem(e){modal.load("Идёт создание задачи..."),xhr.request({path:"/services/problems",method:"POST",headers:{"Content-Type":"application/json"},content:JSON.stringify(e)},function(e,t){if(e){let t=JSON.parse(e);location.href="http://localhost/problems/"+t.id}t&&(modal.error("Не удалось создать новую задачу"),creating=!1)})}function updateProblem(e){e.problemId=inputs.problemId,modal.load("Идёт обновление задачи..."),xhr.request({path:"/services/problems",method:"PUT",headers:{"Content-Type":"application/json"},content:JSON.stringify(e)},function(e,t){e&&(location.href="http://localhost:80/problems/"+inputs.problemId),t&&(modal.error("Не удалось обновить задачу"),creating=!1)})}initTags(),initEditors(),initIfEdit(),initDifficultSelect(),initCreator();