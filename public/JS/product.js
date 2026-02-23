/**
 * Product Page JavaScript
 * Handles product display, quantity controls, and add to cart functionality
 */

(function() {
    'use strict';

    let currentProductId = null;
    let quantity = 1;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initProductPage();
    });

    function initProductPage() {
        loadProduct();
        setupEventListeners();
    }

    function loadProduct() {
        // Get slug from URL
        const slug = window.location.pathname.split('/').pop();
        console.log("Slug from URL:", slug);

        // Fetch product from API
        fetch(`/api/product/${slug}`)
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    console.error(data.message);
                    return;
                }

                const product = data.product;
                console.log("Product:", product);

                // Store product ID for add to cart
                currentProductId = product._id;

                // Render product details
                renderProduct(product);
            })
            .catch(err => console.error(err));
    }

    function renderProduct(product) {
        // Update main image
        const mainImage = document.getElementById("main-img");
        if (mainImage) {
            mainImage.src = product.image;
        }

        // Update product name and description
        const productName = document.getElementById("product-name");
        const productDesc = document.getElementById("product-description");
        const productFullDesc = document.getElementById("product-full-description");

        if (productName) productName.innerText = product.product_name;
        if (productDesc) productDesc.innerText = product.description || '';
        if (productFullDesc) productFullDesc.innerText = product.description || '';

        // Update price
        const productPrice = document.getElementById("product-price");
        const productOldPrice = document.getElementById("product-old-price");

        if (productPrice) productPrice.innerText = '$' + product.discount_price;
        if (productOldPrice) productOldPrice.innerText = '$' + product.old_price;

        // Update reviews
        const productReviews = document.getElementById("product-reviews");
        if (productReviews) productReviews.innerText = '(' + (product.rating || '0') + ')';

        // Update sub-images
        const subImages = document.querySelectorAll('.sub-image');
        subImages.forEach(element => {
            element.src = product.image;
        });
    }

    function setupEventListeners() {
        // Quantity controls
        const plusBtn = document.getElementById('plus-btn');
        const minusBtn = document.getElementById('minus-btn');

        if (plusBtn) {
            plusBtn.addEventListener('click', handlePlusClick);
        }

        if (minusBtn) {
            minusBtn.addEventListener('click', handleMinusClick);
        }

        // Add to cart button
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', handleAddToCart);
        }
    }

    function handlePlusClick() {
        quantity++;
        updateQuantityDisplay();
    }

    function handleMinusClick() {
        if (quantity > 1) {
            quantity--;
            updateQuantityDisplay();
        }
    }

    function updateQuantityDisplay() {
        const quantityDisplay = document.getElementById('quantity');
        if (quantityDisplay) {
            quantityDisplay.innerText = quantity;
        }
    }

    async function handleAddToCart() {
        if (!currentProductId) {
            alert('Product not loaded yet. Please wait.');
            return;
        }

        try {
            const res = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: currentProductId,
                    quantity: quantity
                })
            });

            const data = await res.json();
            
            if (data.success) {
                alert('Added to Cart successfully!');
            } else {
                alert('Login Required');
                window.location.href = '/login';
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Failed to add to cart. Please try again.');
        }
    }

})();
