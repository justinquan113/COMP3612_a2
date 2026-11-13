/*get html element*/
function $(element){
    return document.querySelector(element)
}

/*create an html element*/
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
        renderAll()
    }

    else{
        fetch(url)
        .then(response => {
            return response.json()
        })

        .then(data => {
            products = data.products
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
            renderAll()
        })

        .catch(err => console.error(err))
    }

    const headers = document.querySelectorAll(".header-title")
    const homePage = $("#home")
    const browsePage = $("#browse")
    const categoryPage = $('#category')
    const aboutPage = $('#about')
    const singleProductPage = $('#single-product')
    const browseBtn = $('#browse-btn')
    const featureContainer = $('#feature-container')

    //clicking a view product button goes to single product page 
    featureContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button')
        if(!btn) return
        const id = btn.dataset.id
        homePage.classList.add('close-view')
        singleProductPage.classList.remove('close-view')
    })

    //clicking the browse button goes to the browse page
    browseBtn.addEventListener('click', () => {
        homePage.classList.add('close-view')
        browsePage.classList.remove('close-view')
    })


    headers.forEach(h => h.addEventListener('click', switchView))

    /*switch views between pages*/
    function switchView(e){
        let view = e.target.textContent
        if(view == 'Home'){
            homePage.classList.remove('close-view')
            browsePage.classList.add('close-view')
            categoryPage.classList.add('close-view')
            aboutPage.classList.add('close-view')
            singleProductPage.classList.add('close-view')
        }
    
        else if(view == 'Browse'){
            homePage.classList.add('close-view')
            browsePage.classList.remove('close-view')
            categoryPage.classList.add('close-view')
            aboutPage.classList.add('close-view')
            singleProductPage.classList.add('close-view')
        }
    
        else if(view == 'Category'){
            homePage.classList.add('close-view')
            browsePage.classList.add('close-view')
            categoryPage.classList.remove('close-view')
            aboutPage.classList.add('close-view')
            singleProductPage.classList.add('close-view')
        }
    
        else{
            homePage.classList.add('close-view')
            browsePage.classList.add('close-view')
            categoryPage.classList.add('close-view')
            aboutPage.classList.remove('close-view')
            singleProductPage.classList.add('close-view')
        }
    }

})

function renderAll(){
    renderHome()
}

function renderHome(){
    essentials()
    featureProducts()
}

function essentials(){
    const container = $('#essential-container')
    let set = new Set()
    for(let i = 0; i < 5; i++){
        for(let p of products){
            if(!set.has(p.category)){
                const template = $('#essential-card')
                const clone = template.content.cloneNode(true)
                clone.querySelector('img').src = p.images[0]
                clone.querySelector('p').textContent = p.category
                set.add(p.category)
                container.appendChild(clone)
                break
            }
        }
    }
}

function featureProducts(){
    const container = $('#feature-container')

    for(let i = 0; i < 5; i++){
        const randomNumber = Math.floor(Math.random() * products.length)
        const template = $('#feature-card')
        const clone = template.content.cloneNode(true)
        clone.querySelector('img').src = products[randomNumber].thumbnail
        clone.querySelector('h3').textContent = products[randomNumber].title
        clone.querySelector('button').textContent = 'View Product'
        clone.querySelector('button').dataset.id = products[randomNumber].id
        container.append(clone)
    }
}



