'use strict';
const editors = {
    quillOptions: {
        theme: 'bubble',
        placeholder: 'Опишите условия задачи',
        fontSize: '25',
        modules: {
            toolbar: [
                [{size : ['small', false, 'large', 'huge']}],
                ['bold', 'italic', 'underline', 'strike'],
                ['direction', {align: ['','center', 'right', 'justify']}],
                ['code-block', 'blockquote', {'list': 'ordered'}, {'list': 'bullet'}],
                ['link', 'image']
            ]
        }
    },
    problemEditor: document.querySelector('#problem-editor'),
    solutionEditor: document.querySelector('#solution-editor'),
    panelSelectors: document.querySelectorAll('.panels .top .select'),
};

const selectDifficult = {
    selectTitle: document.querySelector('.select-difficult .title'),
    selectTitleSpan: document.querySelector('.select-difficult .title span'),
    selectContent: document.querySelector('.select-difficult .content'),
    options: document.querySelectorAll('.select-difficult .select-element')
};

const inputs = {
    difficultSpan: document.querySelector('.select-difficult .title span'),
    titleInput: document.querySelector('#title'),
    tagsObjects: tags.tagsCount,
    qlProblemEditor: null,
    qlSolutionEditor: null,
    answerInput: document.querySelector('.answer input'),
    edit: true
};

function initIfEdit() {
    if(document.getElementById('_edit') === null){
        inputs.edit = false;
        return;
    }

    let  difficultEdit = document.getElementById('difficult_edit'),
        titleEdit = document.getElementById('title_edit'),
        tagsEdit = document.getElementById('tags_edit'),
        tagsEditChilds = tagsEdit.children,
        problemEdit = document.getElementById('problem_edit'),
        answerEdit = document.getElementById('answer_edit');

    inputs.problemId = document.getElementById("problem_id").getAttribute("content");

    inputs.difficultSpan.innerText = difficultEdit.innerText;
    selectDifficult.difficult = difficultEdit.getAttribute('content');
    inputs.titleInput.value = titleEdit.innerText;
    for(let i = 0; i < tagsEditChilds.length; i++){
        let tag = tagsEditChilds[i],
            selectedTag = document.createElement('div'),
            name = tag.getAttribute('name'),
            color = tag.getAttribute('color'),
            id = tag.getAttribute('content');
        selectedTag.classList.add('selected-tag', 'chip');
        selectedTag.style.background = color;
        selectedTag.innerText = name;
        selectedTag.style.color = '#ffffff';
        selectedTag.setAttribute('content', id);
        selectedTag.addEventListener('click',  deleteTagOnClick);
        tags.tagsCount[id] = 1;
        tags.tagsInputContainer.insertBefore(selectedTag, tags.tagsInputContainer.lastElementChild);
    }
    upPlaceholder();
    inputs.qlProblemEditor.innerHTML = problemEdit.innerHTML.trim();
    inputs.answerInput.value = answerEdit.innerText.trim();

    difficultEdit.parentNode.removeChild(difficultEdit);
    titleEdit.parentNode.removeChild(titleEdit);
    tagsEdit.parentNode.removeChild(tagsEdit);
    problemEdit.parentNode.removeChild(problemEdit);
    answerEdit.parentNode.removeChild(answerEdit);
}

function initEditors() {
    editors.quillProblem = new Quill(editors.problemEditor, editors.quillOptions);
    editors.quillOptions.placeholder = 'Опишите решение задачи';
    editors.quillSolution = new Quill(editors.solutionEditor, editors.quillOptions);

    initQuillEditor(editors.problemEditor);
    editors.currentSelector = editors.panelSelectors[0];
    inputs.qlProblemEditor = document.querySelector('#problem-panel .ql-editor');

    let panelSelectors = editors.panelSelectors;
    for(let i = 0; i < panelSelectors.length; i++) {
        panelSelectors[i].addEventListener('click', function (e) {
            let current = editors.currentSelector,
                target = e.currentTarget;
            document.getElementById(current.getAttribute('content')).style.display = 'none';
            current.classList.remove('active');
            document.getElementById(target.getAttribute('content')).style.display = 'block';
            target.classList.add('active');
            editors.currentSelector = target;
        })
    };
    editors.panelSelectors[1].addEventListener('click', initSolutionEditor);
    function initSolutionEditor() {
        initQuillEditor(editors.solutionEditor);
        inputs.qlSolutionEditor = document.querySelector('#solution-panel .ql-editor');
        if(inputs.edit){
            let solutionEdit = document.getElementById('solution_edit');
            inputs.qlSolutionEditor.innerHTML = solutionEdit.innerHTML.trim();
            solutionEdit.parentNode.removeChild(solutionEdit);
        }
        editors.panelSelectors[1].removeEventListener('click', initSolutionEditor);
    }
}
function initDifficultSelect() {
    selectDifficult.selectTitle.addEventListener('click', function () {
        selectDifficult.selectContent.style.display = 'block';
    });
    let difficultOptions = selectDifficult.options;
    for(let i = 0; i < difficultOptions.length; i++){
        difficultOptions[i].addEventListener('click', function (e) {
            selectDifficult.difficult = e.currentTarget.getAttribute('content');
            selectDifficult.selectTitleSpan.innerText = e.currentTarget.innerText;
        });
    }
    document.addEventListener('click', function () {
        selectDifficult.selectContent.style.display = 'none';
    }, true);
}

let creating = false;
function initCreator(){

    document.querySelector('#create-problem').addEventListener('click', function (e) {
        if(creating)
            return;

        let difficult = selectDifficult.difficult,
            title = inputs.titleInput.value,
            tagsIDS = Object.keys(inputs.tagsObjects),
            problemText = editors.quillProblem.getText(),
            solutionText = editors.quillSolution.getText(),
            answer = inputs.answerInput.value;
        if(difficult === undefined){
            modal.error('Вы не выбрали уровень задачи');
            return;
        }else if(title.length < 10 || title.length > 100){
            modal.error('Длина заголовка должна быть от 10 до 100 символов');
            return;
        }else if(!title.match(/^[А-я|Ё|ё|\w|\s|\d|.|,|:|-]+$/)){
	    modal.error('Заголовок может содержать только буквы, цифры и знаки препинания');
	    return;
	}else if(tagsIDS.length < 2 || tagsIDS.length > 5){
            modal.error('Количество тегов должно быть от 2-х до 5');
            return;
        }else if(problemText.length < 100 || problemText.length > 10000){
            modal.error('Количество символов в условии задачи не может быть меньше 100 и превышать 10000');
            return;
        } else if(solutionText.length < 100 || solutionText.length > 100000){
            modal.error('Количество символов в решении задачи не может быть меньше 100 и превышать 100000');
            return;
        }else if(answer.length < 1 || answer.length > 100){
            modal.error('Длина ответа задачи не может быть больше 100 символов');
            return;
        }else if(!answer.match(/^[А-я|Ё|ё|\w|\s|\d|.|,|:|-]+$/)){
	    modal.error('Ответ может содержать только буквы, цифры и знаки препинания');
	    return;
	}
        creating = true;
        const problem = {
            title: title,
            tags: tagsIDS,
            difficult: difficult,
            problemContent: inputs.qlProblemEditor.innerHTML,
            solutionContent: inputs.qlSolutionEditor.innerHTML,
            answer: answer
        };

        if(!inputs.edit){
            createProblem(problem);
        }else{
            updateProblem(problem);
        }
    });
}

    function createProblem(problem){
        modal.load('Идёт создание задачи...');
        xhr.request({
            path: '/services/problems',
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            content: JSON.stringify(problem)
        }, function (response, error) {
            if(response){
                let obj = JSON.parse(response);
                location.href = location.href.replace('create', '') + obj.id;
            }if(error){
                modal.error('Не удалось создать новую задачу');
                creating = false;
            }
        });
    }
    function updateProblem(problem){
        problem.problemId = inputs.problemId;
        modal.load('Идёт обновление задачи...');
        xhr.request({
            path: '/services/problems',
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            content: JSON.stringify(problem)
        }, function (response, error) {
            if(response){
                location.href = location.href.replace('edit', '') + inputs.problemId;
            }if(error){
                modal.error('Не удалось обновить задачу');
                creating = false;
            }
        });
    }

initTags();
initEditors();
initIfEdit();
initDifficultSelect();
initCreator();