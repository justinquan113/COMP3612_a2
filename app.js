
/*get html element*/
function $(element){
    return document.querySelector(element)
}

/*create an html element*/
function C(element){
    return document.createElement(element)
}

/*load the saved cart, or an empty one*/
function getCart(){
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
}

/*save the cart to localStorage*/
function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
}


const url = 'https://dummyjson.com/products?limit=100'
const STORAGE_KEY = 'products'
const CART_KEY = 'cart'
let products

const filterState = {
    name: '',
    categories: new Set(),
    minRating: 0,
    underPrice: null,
    overPrice: null,
    sortBy: 'name' // Default
}

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
    const shoppingCartPage = $('#cart-page')
    const browseBtn = $('#browse-btn')
    const specificationsbtn = $('#specifics')
    const reviewbtn = $('#reviews')
    const specsContent = $('#specs-content')
    const reviewsContent = $('#reviews-content')
    const addToCartbtn = $('#addtocart')
    const quantityInput = $('#quantity')
    const cartItemContainer = $('#items-container')
    const featureContainer = $('#feature-container')
    const shippingOptions = $('#shipping-opt')
    const shippingDestinations = $('#destination')
    const checkoutBtn = $('#checkout-btn')
    updateCartCount()
  
    headers.forEach(h => h.addEventListener('click', switchView))

    /*switch views between pages*/
    function switchView(e){
        let view = e.target.textContent

        if(view == 'About'){
            aboutPage.showModal()
            return
        }
        if(view == 'Home'){
            homePage.classList.remove('close-view')
            browsePage.classList.add('close-view')
            categoryPage.classList.add('close-view')
            singleProductPage.classList.add('close-view')
            shoppingCartPage.classList.add('close-view')
        }
    
        else if(view == 'Browse'){
            homePage.classList.add('close-view')
            browsePage.classList.remove('close-view')
            categoryPage.classList.add('close-view')
            singleProductPage.classList.add('close-view')
            shoppingCartPage.classList.add('close-view')
        }
    
        else if(view == 'Category'){
            homePage.classList.add('close-view')
            browsePage.classList.add('close-view')
            categoryPage.classList.remove('close-view')
            singleProductPage.classList.add('close-view')
            shoppingCartPage.classList.add('close-view')
        }

        else if(view == 'Cart'){
            homePage.classList.add('close-view')
            browsePage.classList.add('close-view')
            categoryPage.classList.add('close-view')
            singleProductPage.classList.add('close-view')
            shoppingCartPage.classList.remove('close-view')
        }
    
        else{
            homePage.classList.add('close-view')
            browsePage.classList.add('close-view')
            categoryPage.classList.add('close-view')
            singleProductPage.classList.add('close-view')
            shoppingCartPage.classList.add('close-view')
        }
    }
    
  

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

    //clicking the browse button goes to the browse page
    browseBtn.addEventListener('click', () => {
        homePage.classList.add('close-view')
        browsePage.classList.remove('close-view')
    })

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

    specificationsbtn.addEventListener('click', () => {
        selectTab(specificationsbtn, reviewbtn, specsContent, reviewsContent)
    })

    reviewbtn.addEventListener('click', () => {
        selectTab(reviewbtn, specificationsbtn, reviewsContent, specsContent)
    })

    addToCartbtn.addEventListener('click', () => {
        const quantity = Number(quantityInput.value)
        if(!Number.isInteger(quantity) || quantity <= 0){
            alert("Please Enter a quantity")
            return
        }

        const id = Number(addToCartbtn.dataset.id)
        addToCart(id, quantity)
    })

    cartItemContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button')
        if(!btn) return
        const id = Number(btn.dataset.id)
        removeFromCart(id)
    })

    shippingDestinations.addEventListener('change', renderShippingSummary)

    shippingOptions.addEventListener('change', renderShippingSummary)

    checkoutBtn.addEventListener('click', () => {
        if(getCart().length == 0) return

        alert('Thank you for your order!')

        //clear the cart
        saveCart([])
        renderShoppingCartPage()
        updateCartCount()

        //return to the home page
        homePage.classList.remove('close-view')
        browsePage.classList.add('close-view')
        categoryPage.classList.add('close-view')
        singleProductPage.classList.add('close-view')
        shoppingCartPage.classList.add('close-view')
        window.scrollTo(0, 0)
    })

    $('#about-close-x').addEventListener('click', () => {
        aboutPage.close()
    })

    $('#about-close-btn').addEventListener('click', () => {
        aboutPage.close()
    })

    aboutPage.addEventListener('click', (e) => {
        if (e.target === aboutPage) {
            aboutPage.close()
        }
    })
})

/*Single Product Navigation*/
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

/*add a product to the cart saved in localStorage*/
function addToCart(id, quantity){
    
    //load the saved cart, or start with an empty one
    const cart = getCart()

    //if the product is already in the cart, add to its quantity
    const existing = cart.find(item => item.id === id)
    if(existing){
        existing.quantity += quantity
    }
    else{
        cart.push({ id: id, quantity: quantity })
    }

    saveCart(cart)
    renderShoppingCartPage()
    updateCartCount()
}

function removeFromCart(id){
    const cart = getCart()
    const updateCart = cart.filter(item => item.id != id)
    saveCart(updateCart)
    renderShoppingCartPage()
    updateCartCount()
}

function updateCartCount(){
    let quantity = 0
    const cartCount = $('#cart-count')
    const cartArr = getCart()
    for(let i of cartArr){
        quantity += i.quantity
    }
    cartCount.textContent = quantity
}

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

function renderAll(){
    renderHome()
    renderShoppingCartPage()
    initBrowse()
    initCategory()
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

function renderShoppingCartPage(){
    renderShoppingCartItems()
    renderShippingSummary()
}

function renderShoppingCartItems(){
    const cart = getCart()
    const itemsContainer = $('#items-container')
    const shoppingHeaders = $('#shopping-headers')

    itemsContainer.querySelectorAll('.cart-item, .cart-empty').forEach(i => i.remove())

    if(cart.length == 0){
        const shoppingEmpty = C('tr')
        shoppingEmpty.className = 'cart-empty'
        const cell = C('td')
        cell.colSpan = 4
        cell.textContent = "Shopping Cart Empty"
        cell.className = 'text-center text-2xl h-[50vh]'
        shoppingEmpty.appendChild(cell)
        shoppingHeaders.classList.add('close-view')
        itemsContainer.appendChild(shoppingEmpty)
    }
    else{
        shoppingHeaders.classList.remove('close-view')
    }

    for(let item of cart){
        for(let p of products){
            if(item.id == p.id){
                const template = $('#cart-item-template')
                const clone = template.content.cloneNode(true)
                clone.querySelector('.product-img').src = p.thumbnail
                clone.querySelector('.product-img').alt = p.title
                clone.querySelector('.product-title').textContent = p.title
                clone.querySelector('.item-price').textContent = `$${p.price}`
                clone.querySelector('.item-quantity').textContent = item.quantity
                clone.querySelector('.item-subtotal').textContent = `$${(p.price * item.quantity).toFixed(2)}`
                clone.querySelector('.remove-btn').dataset.id = item.id
                itemsContainer.appendChild(clone)

            }
        }
    }
    
}

function renderShippingSummary(){
    const cart = getCart()
    const shippingOptions = $('#shipping-opt')
    const shippingDestinations = $('#destination')
    const cartItemsCost = $('#cart-cost')
    const shippingCost = $('#cart-shipping-cost')
    const taxAmount = $('#cart-tax')
    const cartTotal = $('#cart-total')
    const isEmpty = cart.length == 0
    const checkoutBtn = $('#checkout-btn')
    let total
    
    let merchandiseTotal = 0
    shippingOptions.disabled = isEmpty
    shippingDestinations.disabled = isEmpty
    checkoutBtn.disabled = isEmpty

    //calculate merchandise total
    for(let item of cart){
        const p = products.find(p => p.id == item.id)
        if (p) merchandiseTotal += p.price * item.quantity
    }
    cartItemsCost.textContent = `$${merchandiseTotal.toFixed(2)}`

    //calculate shipping cost
    const destination = shippingDestinations.value
    const shippingType = shippingOptions.value
    const shippingTotal = calculateShippingCost(destination, shippingType, merchandiseTotal)
    shippingCost.textContent = `$${shippingTotal.toFixed(2)}`

    const tax = merchandiseTotal * 0.05
    taxAmount.textContent = `$${tax.toFixed(2)}`

    total = (merchandiseTotal + tax + shippingTotal).toFixed(2)
    cartTotal.textContent = `$${total}`
}

function calculateShippingCost(destination, shippingType, merchandiseTotal){
    let shippingTotal
    const cart = getCart()
    //free shipping over $500
    if(merchandiseTotal > 500 || cart.length == 0){
        shippingTotal = 0
        return shippingTotal
    }
    
    if(destination == "CA"){
        
        if(shippingType == "standard"){
            shippingTotal = 10
        }

        else if(shippingType == "express"){
            shippingTotal = 25
        }
        
        else{
            shippingTotal = 35
        }
    }

    else if(destination == "US"){
        if(shippingType == "standard"){
            shippingTotal = 15
        }

        else if(shippingType == "express"){
            shippingTotal = 25
        }
        
        else{
            shippingTotal = 50
        }
    }

    else{
        if(shippingType == "standard"){
            shippingTotal = 20
        }

        else if(shippingType == "express"){
            shippingTotal = 30
        }
        
        else{
            shippingTotal = 50
        }
    }
    
    return shippingTotal
}




// Start Browse Functions:

function initBrowse() {
    populateCategoryFilters()
    initBrowseListeners()
    updBrowse()
}

function populateCategoryFilters() {
    const catList = $('#filter-category-list')
    catList.innerHTML = ''

    const categories = new Set(products.map(p => p.category))

    for (let category of categories) {
        const label = C('label')
        label.className = 'flex items-center gap-2 cursor-pointer category-option'
        label.dataset.category = category

        const checkbox = C('input')
        checkbox.type = 'checkbox'
        checkbox.value = category
        checkbox.className = 'category-checkbox cursor-pointer'

        const span = C('span')
        span.textContent = category

        label.appendChild(checkbox)
        label.appendChild(span)
        catList.appendChild(label)
    }
}

function initBrowseListeners() {
    // Accordion click to toggle display and hide
    const accordions = document.querySelectorAll('#filter .accordion-header')
    for (let header of accordions) {
        header.addEventListener('click', () => {
            const body = header.parentNode.querySelector('.accordion-body')
            const icon = header.querySelector('.accordion-icon')
            body.classList.toggle('close-view')

            if (body.classList.contains('close-view')) {
                icon.textContent = '▶'
            } else {
                icon.textContent = '▼'
            }
        })
    }

    // Name filter
    $('#filter-name').addEventListener('input', (e) => {
        filterState.name = e.target.value
        updBrowse()
    })

    // Category filter (event delegation via classList.contains)
    $('#filter-category-list').addEventListener('change', (e) => {
        if (!e.target.classList.contains('category-checkbox')) return
        const category = e.target.value
        if (e.target.checked) {
            filterState.categories.add(category)
        } else {
            filterState.categories.delete(category)
        }
        updBrowse()
    })

    // Rating filter (loop + e.currentTarget.dataset from Lab 9a/9b)
    const ratingOptions = document.querySelectorAll('#filter-rating-list .rating-option')
    for (let option of ratingOptions) {
        option.addEventListener('click', (e) => {
            const selectedRating = Number(e.currentTarget.dataset.rating)
            if (filterState.minRating === selectedRating) {
                filterState.minRating = 0
            } else {
                filterState.minRating = selectedRating
            }
            updBrowse()
        })
    }

    // Price under
    $('#filter-price-under').addEventListener('input', (e) => {
        if (e.target.value !== '') {
            filterState.underPrice = Number(e.target.value)
        } else {
            filterState.underPrice = null
        }
        updBrowse()
    })

    // Price over
    $('#filter-price-over').addEventListener('input', (e) => {
        if (e.target.value !== '') {
            filterState.overPrice = Number(e.target.value)
        } else {
            filterState.overPrice = null
        }
        updBrowse()
    })

    // Sort by
    $('#sort-select').addEventListener('change', (e) => {
        filterState.sortBy = e.target.value
        updBrowse()
    })

    // Clear All
    $('#clear-all-btn').addEventListener('click', clearAllFilters)

    // Navigate to single product or add to cart (event delegation via classList.contains)
    $('#browse-grid').addEventListener('click', (e) => {
        if (e.target.classList.contains('browse-card-img') || e.target.classList.contains('browse-card-title')) {
            const productId = Number(e.target.dataset.id)
            $('#browse').classList.add('close-view')
            $('#single-product').classList.remove('close-view')
            singleProductRender(productId)
            reviewsAndSpecifications(productId)
        } else if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = Number(e.target.dataset.id)
            addToCart(productId, 1)
        }
    })
}

function updBrowse() {
    highlightSelected()
    renderActiveFilters()
    const matchingItems = getMatchingProducts()
    renderBrowseGrid(matchingItems)
}

// Highlights categories selected and selected rating by making them bold
function highlightSelected() {
    const categoryLabels = document.querySelectorAll('#filter-category-list .category-option')
    for (let label of categoryLabels) {
        const cat = label.dataset.category
        const checkbox = label.querySelector('input')

        if (filterState.categories.has(cat)) {
            checkbox.checked = true
            label.classList.add('font-bold')
        } else {
            checkbox.checked = false
            label.classList.remove('font-bold')
        }
    }

    const ratingOptions = document.querySelectorAll('#filter-rating-list .rating-option')
    for (let option of ratingOptions) {
        const rating = Number(option.dataset.rating)

        if (filterState.minRating === rating) {
            option.classList.add('font-bold')
            option.classList.add('underline')
        } else {
            option.classList.remove('font-bold')
            option.classList.remove('underline')
        }
    }
}

// Filter and sort the array (compare function pattern from Lab 10 Ex 10.1)
function getMatchingProducts() {
    return products
        .filter(p => {
            if (filterState.name && !p.title.toLowerCase().includes(filterState.name.toLowerCase())) {
                return false
            }
            for (let cat of filterState.categories) {
                if (p.category !== cat) {
                    return false
                }
            }
            if (filterState.minRating > 0 && p.rating < filterState.minRating) {
                return false
            }
            if (filterState.underPrice !== null && p.price > filterState.underPrice) {
                return false
            }
            if (filterState.overPrice !== null && p.price < filterState.overPrice) {
                return false
            }
            return true
        })
        .sort((a, b) => {
            if (filterState.sortBy === 'name') {
                if (a.title.toLowerCase() < b.title.toLowerCase()) {
                    return -1
                } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                    return 1
                } else {
                    return 0
                }
            } else if (filterState.sortBy === 'price') {
                if (a.price < b.price) {
                    return -1
                } else if (a.price > b.price) {
                    return 1
                } else {
                    return 0
                }
            } else if (filterState.sortBy === 'category') {
                if (a.category.toLowerCase() < b.category.toLowerCase()) {
                    return -1
                } else if (a.category.toLowerCase() > b.category.toLowerCase()) {
                    return 1
                } else {
                    return 0
                }
            }
            return 0
        })
}

// Render the selected filters, can be removed
function renderActiveFilters() {
    const container = $('#active-filters')
    container.innerHTML = ''
    let hasActiveFilters = false

    function addChip(label, onRemove) {
        hasActiveFilters = true
        const chip = C('button')
        chip.className = 'cursor-pointer bg-stone-200 text-stone-800 px-3 py-1 rounded-2xl flex items-center gap-1.5 capitalize'
        chip.textContent = `X ${label}`
        chip.addEventListener('click', () => {
            onRemove()
            updBrowse()
        })
        container.appendChild(chip)
    }

    if (filterState.name) {
        addChip(`Name: "${filterState.name}"`, () => {
            filterState.name = ''
            $('#filter-name').value = ''
        })
    }

    for (let cat of filterState.categories) {
        addChip(cat, () => {
            filterState.categories.delete(cat)
        })
    }

    if (filterState.minRating > 0) {
        addChip(`${filterState.minRating}★ & Up`, () => {
            filterState.minRating = 0
        })
    }

    if (filterState.underPrice !== null) {
        addChip(`Under $${filterState.underPrice}`, () => {
            filterState.underPrice = null
            $('#filter-price-under').value = ''
        })
    }

    if (filterState.overPrice !== null) {
        addChip(`Over $${filterState.overPrice}`, () => {
            filterState.overPrice = null
            $('#filter-price-over').value = ''
        })
    }

    if (hasActiveFilters) {
        $('#clear-all-btn').classList.remove('close-view')
    } else {
        $('#clear-all-btn').classList.add('close-view')
    }
}

// Clear all
function clearAllFilters() {
    filterState.name = ''
    filterState.categories.clear()
    filterState.minRating = 0
    filterState.underPrice = null
    filterState.overPrice = null

    $('#filter-name').value = ''
    $('#filter-price-under').value = ''
    $('#filter-price-over').value = ''

    updBrowse()
}

// Render the products, or empty
function renderBrowseGrid(list) {
    const grid = $('#browse-grid')
    const template = $('#browse-card-template')

    grid.innerHTML = ''

    if (list.length === 0) {
        const emptyMsg = C('p')
        emptyMsg.className = 'text-2xl text-center py-10 col-span-full'
        emptyMsg.textContent = 'No products match your selected filters.'
        grid.appendChild(emptyMsg)
        return
    }

    for (let p of list) {
        const clone = template.content.cloneNode(true)
        const img = clone.querySelector('.browse-card-img')
        const title = clone.querySelector('.browse-card-title')
        const price = clone.querySelector('.browse-card-price')
        const btn = clone.querySelector('.add-to-cart-btn')

        img.src = p.thumbnail
        img.alt = p.title
        img.dataset.id = p.id

        title.textContent = p.title
        title.dataset.id = p.id

        price.textContent = `$${p.price.toFixed(2)}`
        btn.dataset.id = p.id

        grid.appendChild(clone)
    }
}

// Start Category Functions:

function initCategory() {
    renderCategories()
}

/* Populate all unique categories using Set and product thumbnails */
function renderCategories() {
    const grid = $('#category-grid')
    const template = $('#category-card-template')
    grid.innerHTML = ''

    const seenCategories = new Set()

    for (let p of products) {
        if (!seenCategories.has(p.category)) {
            seenCategories.add(p.category)

            const clone = template.content.cloneNode(true)
            const card = clone.querySelector('.category-card')
            const img = clone.querySelector('.category-img')
            const name = clone.querySelector('.category-name')

            card.dataset.category = p.category
            img.src = p.thumbnail
            img.alt = p.category
            name.textContent = p.category.split('-').join(' ')

            card.addEventListener('click', openCategory)

            grid.appendChild(clone)
        }
    }
}

/* Clicking a category card opens Browse filtered to that category */
function openCategory(e) {
    const selectedCategory = e.currentTarget.dataset.category

    clearAllFilters()
    filterState.categories.add(selectedCategory)
    updBrowse()

    $('#category').classList.add('close-view')
    $('#browse').classList.remove('close-view')
}