
function $(element){
    return document.querySelector(element)
}

function C(element){
    return document.createElement(element)
}

const url = 'https://dummyjson.com/products?limit=100'
const STORAGE_KEY = 'products'
let products
document.addEventListener("DOMContentLoaded", () =>{
    const cache = localStorage.getItem(STORAGE_KEY)

    if(cache){
        products = JSON.parse(cache)
    }

    else{
        fetch(url)
        .then(response => {
            return response.json()
        })

        .then(data => {
            const prod_data = data.products
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prod_data))
            products = prod_data
        })

        .catch(err => console.error(err))
    }

    

    const headers = document.querySelectorAll(".header-title")
    const homePage = $("#home")
    const browsePage = $("#browse")
    const categoryPage = $('#category')
    const aboutPage = $('#about')

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

    

})



