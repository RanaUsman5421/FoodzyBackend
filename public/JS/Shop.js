let products_container = document.getElementsByClassName('products-container');

// Function to render products
function renderProducts(data) {
    // Handle both array response and object with pagination response
    const products = Array.isArray(data) ? data : (data.products || []);
    const pagination = data.pagination;
    
    products_container[0].innerHTML = '';
    
    const itemsFound = document.querySelector('.filter-icons span');
    if (itemsFound) {
        const total = pagination ? pagination.total : products.length;
        itemsFound.textContent = `We found ${total} items for you!`;
    }
    
    products.map((item, index) => {
        let product_container = document.createElement('div');
        product_container.classList.add('product-container', 'shop-product');
        product_container.style.transitionDelay = (index * 0.1) + 's';
        product_container.dataset.slug = `${item.slug}`
        products_container[0].appendChild(product_container);
        
        // Format prices properly - handle both string and number formats
        const discountPrice = item.discount_price ? '$' + item.discount_price : '$0';
        const oldPrice = item.old_price ? '$' + item.old_price : '$0';
        
        product_container.innerHTML = `<div class="product-image">
                <img src=${item.image} class="prod-img" data-slug='${item.slug}'>
                <i class="fa-solid fa-lock"></i>
            </div>
            <p class="category">${item.category || 'Vegetables'}</p>
            <div class="product-rating">
                <div>
                    <img src="../Assets/star_fill.png">
                    <img src="../Assets/star_fill.png">
                    <img src="../Assets/star_fill.png">
                    <img src="../Assets/star_fill.png">
                    <img src="../Assets/star_fill.png">
                    <span>(${item.rating || '4.5'})</span>
                </div>
            </div>
            <p class="product-name">${item.product_name || 'Product'}</p>
            <div class="product-price">
                <p class="discount-price">${discountPrice}</p>
                <p class="old-price">${oldPrice}</p>
                </div>
                <button class='add-to-cart' data-id="${item._id}"> Add To Cart </button>`

        let prod_imgs = document.querySelectorAll('.prod-img');
        prod_imgs.forEach(img => {
            img.addEventListener('click', (e) => {
                let slug = e.currentTarget.dataset.slug;
                window.location.href = `/product/${slug}`;
            })
        })
    });
    
    // Trigger animations for newly created products
    setTimeout(() => {
        if (window.Animations) {
            window.Animations.refresh();
        }
    }, 100);
    
    products_container[0].addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.dataset.id;
            e.stopPropagation();

            const res = await fetch('/cart/add', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Added to Cart ")
            } else {
                alert("Login Required");
            }
        }
    });
}

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('query');
const searchCategory = urlParams.get('category');

if (searchQuery || (searchCategory && searchCategory !== 'All Categories')) {
    let searchUrl = '/api/products/search?';
    const params = [];
    
    if (searchQuery) {
        params.push(`query=${encodeURIComponent(searchQuery)}`);
    }
    if (searchCategory && searchCategory !== 'All Categories') {
        params.push(`category=${encodeURIComponent(searchCategory)}`);
    }
    
    searchUrl += params.join('&');
    
    fetch(searchUrl)
        .then(res => res.json())
        .then(data => {
            renderProducts(data);
        })
        .catch(err => {
            console.error('Search error:', err);
            fetch('getproducts')
                .then(res => res.json())
                .then(data => renderProducts(data));
        });
} else {
    fetch('getproducts')
        .then(res => res.json())
        .then(data => {
            renderProducts(data);
        });
}
