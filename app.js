import config from './data-minifed.json' with { type: 'json' }; 
const headers = document.querySelectorAll(".header-title")
const homePage = document.querySelector('#home')
const browsePage = document.querySelector('#browse')
const categoryPage = document.querySelector('#category')
const aboutPage = document.querySelector('#about')
headers.forEach(h => h.addEventListener('click', switchView))



function switchView(e){
    let view = e.target.textContent
    if(view == 'Home'){
        homePage.classList.remove('close-view')
        browsePage.classList.add('close-view')
        categoryPage.classList.add('close-view')
        aboutPage.classList.add('close-view')
    }

    else if(view == 'Browse'){
        homePage.classList.add('close-view')
        browsePage.classList.remove('close-view')
        categoryPage.classList.add('close-view')
        aboutPage.classList.add('close-view')
    }

    else if(view == 'Category'){
        homePage.classList.add('close-view')
        browsePage.classList.add('close-view')
        categoryPage.classList.remove('close-view')
        aboutPage.classList.add('close-view')
    }

    else{
        homePage.classList.add('close-view')
        browsePage.classList.add('close-view')
        categoryPage.classList.add('close-view')
        aboutPage.classList.remove('close-view')
    }
}
