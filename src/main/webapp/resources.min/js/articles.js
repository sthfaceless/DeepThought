"use strict";const render={articlesContainer:document.getElementById("articles_container"),path:"/services/articles",isRendering:!1,articlesOnPage:10,height:Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight),params:get_parameters()};function initSpecialSort(){const e=document.getElementById("special_sort");null!=e&&(render.path=e.getAttribute("path"))}initCategories("sort-content","type-content"),initSpecialSort();