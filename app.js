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

    const featureContainer = $('#feature-container')

    //clicking a view product button goes to single product page 
    featureContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button')
        if(!btn) return
        const id = btn.dataset.id
        homePage.classList.add('close-view')
        singleProductPage.classList.remove('close-view')
        singleProductRender(id)
        reviewsAndSpecifications(id)

        //switching views keeps the old scroll position, so jump back to the top
        window.scrollTo(0, 0)
    })
    
    /*navigation for a single product*/
    function breadCrumb(prod_id){
        const container = $('#breadcrumb')
        const template = $('#breadcrumb-container')
        const clone = template.content.cloneNode(true)
        const old = container.querySelector('ol')
        if (old) old.remove()
        for(let p of products){
            if(p.id == prod_id){
                clone.querySelector('#breadcrumb-home').textContent = 'Home'
                clone.querySelector('#arrow').textContent = ' > '
                clone.querySelector('#breadcrumb-category').textContent = `${p.category}`
                clone.querySelector('#arrow1').textContent = ' > '
                clone.querySelector('#breadcrumb-title').textContent = p.title
                
                container.appendChild(clone)
            }
        }
    }
    
    /*renders a single product*/
    function singleProductRender(prod_id){

        //knows which product to add to cart
        $('#addtocart').dataset.id = prod_id
        breadCrumb(prod_id)
        const prodImg = $('#prod-img')
        const prodDesc = $('#prod-details')
        const template = $('#prod-template')

        //clear previous image to prevent stacking images
        prodImg.textContent = ''

        //replace previous template with new one
        prodDesc.replaceChildren(template)

        for(let p of products){
            if(p.id == prod_id){
                const img = C('img')
                img.src = p.images[0]
                img.className = 'w-full h-full object-contain'
                prodImg.appendChild(img)
                
                const clone = template.content.cloneNode(true)
                clone.querySelector('#prod-title').textContent = p.title
                clone.querySelector('#prod-price').textContent = `$${p.price}`
                clone.querySelector('#prod-sku').textContent = `SKU: ${p.sku}`
                clone.querySelector('#prod-rating').textContent = `rating: ${p.rating}`
                const tagsDiv = clone.querySelector('#tags')
                for(let tag of p.tags){
                    const span = C('span')
                    span.textContent = tag
                    span.className = 'border p-1 bg-green-100 rounded-md'
                    tagsDiv.appendChild(span)
                }

                if(p.stock > 0){
                    clone.querySelector("#prod-stock").textContent = "In Stock"
                }
                else{
                    clone.querySelector("#prod-stock").textContent = "Out of Stock"
                }

                clone.querySelector('#prod-description').textContent = p.description
                prodDesc.appendChild(clone)
            }
        }       
    }

    const addToCartbtn = $('#addtocart')
    const quantityInput = $('#quantity')
    addToCartbtn.addEventListener('click', () => {
        const quantity = Number(quantityInput.value)
        if(!Number.isInteger(quantity) || quantity <= 0){
            alert("Please Enter a quantity")
            return
        }

        const id = Number(addToCartbtn.dataset.id)
        addToCart(id, quantity)
    })

    const CART_KEY = 'cart'

    /*add a product to the cart saved in localStorage*/
    function addToCart(id, quantity){

        //load the saved cart, or start with an empty one
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || []

        //if the product is already in the cart, add to its quantity
        const existing = cart.find(item => item.id === id)
        if(existing){
            existing.quantity += quantity
        }
        else{
            cart.push({ id: id, quantity: quantity })
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart))
    }
    

    const specificationsbtn = $('#specifics')
    const reviewbtn = $('#reviews')
    const specsContent = $('#specs-content')
    const reviewsContent = $('#reviews-content')

    
    const activeTab = ['bg-stone-600', 'text-white']
    const inactiveTab = ['hover:bg-stone-600', 'hover:text-white']

    /*tab switching between specifications and reviews*/
    function selectTab(onBtn, offBtn, showContent, hideContent){
        onBtn.classList.add(...activeTab)
        onBtn.classList.remove(...inactiveTab)
        offBtn.classList.remove(...activeTab)
        offBtn.classList.add(...inactiveTab)

        showContent.classList.remove('close-view')
        hideContent.classList.add('close-view')
    }

    specificationsbtn.addEventListener('click', () => {
        selectTab(specificationsbtn, reviewbtn, specsContent, reviewsContent)
    })
    reviewbtn.addEventListener('click', () => {
        selectTab(reviewbtn, specificationsbtn, reviewsContent, specsContent)
    })

    /*renders review and specifications of a single product*/
    function reviewsAndSpecifications(prod_id){
        const weight = $('#weight')
        const width = $('#width')
        const height = $('#height')
        const depth = $('#depth')
        const shipping = $('#shipping')
        const returns = $('#return')
        const warranty = $('#warranty')
        for(let p of products){
            if(p.id == prod_id){
                /*specification section*/
                weight.textContent = `${p.weight} lbs`
                width.textContent = `${p.dimensions.width} cm`
                height.textContent = `${p.dimensions.height} cm`
                depth.textContent =`${p.dimensions.depth} cm`
                shipping.textContent = p.shippingInformation
                returns.textContent = p.returnPolicy
                warranty.textContent = p.warrantyInformation

                /*review section*/
                const container = $('#reviews-content')
                //remove the previous product's reviews (but keep the template)
                container.querySelectorAll('.review-card').forEach(card => card.remove())

                for(let review of p.reviews){
                    const template = $('#review-template')
                    const clone = template.content.cloneNode(true)
                    clone.querySelector('.review-name').textContent = review.reviewerName
                    clone.querySelector('.review-rating').textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
                    clone.querySelector('.review-email').textContent = review.reviewerEmail
                    clone.querySelector('.review-date').textContent = new Date(review.date).toLocaleDateString()
                    clone.querySelector('.review-comment').textContent = review.comment
                    container.appendChild(clone)
                }
            }
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

/*home page essential section*/
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

/*home page feature products section*/
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



