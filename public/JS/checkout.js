/**
 * Checkout Page JavaScript
 * Handles checkout functionality, form validation, and order placement
 */

(function() {
    'use strict';

    let products = document.getElementsByClassName('products');
    let form = document.getElementById('orderForm');
    let checkoutItems = [];
    
    const nameRegex = /^[a-zA-Z\s]+$/;
    const postcodeRegex = /^[a-zA-Z0-9\s-]+$/;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initCheckout();
    });

    function initCheckout() {
        fetchCheckoutItems();
        setupEventListeners();
    }

    function fetchCheckoutItems() {
        fetch('/checkoutItems')
            .then(res => res.json())
            .then(data => {
                checkoutItems = data.cart;
                renderCheckout();
            })
            .catch(err => console.error('Error fetching checkout items:', err));
    }

    function renderCheckout() {
        if (!products[0] || !checkoutItems) return;
        
        checkoutItems.forEach(item => {
            let product = document.createElement('div');
            product.classList.add('product');

            product.innerHTML = `
                <img src="${item.product.image}" alt="">
                <div class="product-detail">
                    <p class="product-name">${item.product.product_name}</p>
                    <div class="product-stars">
                        <img src="./Assets/star_fill.png" alt="">
                        <img src="./Assets/star_fill.png" alt="">
                        <img src="./Assets/star_fill.png" alt="">
                        <img src="./Assets/star_fill.png" alt="">
                        <img src="./Assets/star_empty.png" alt="">
                    </div>
                    <div class="product-price">
                        <p class="new-price">${item.product.discount_price}</p>
                        <p class="old-price">${item.product.old_price}</p>
                    </div>
                </div>                
            `;
            products[0].appendChild(product);
        });
    }

    function setupEventListeners() {
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', handlePlaceOrder);
        }
    }

    function validateCheckoutForm() {
        if (!form) return false;
        
        const firstname = form.firstname.value.trim();
        const lastname = form.lastname.value.trim();
        const address = form.address.value.trim();
        const city = form.city.value.trim();
        const postcode = form.postcode.value.trim();
        const country = form.country.value.trim();
        const state = form.state.value.trim();

        if (!firstname || firstname.length < 2) {
            alert('First name must be at least 2 characters');
            form.firstname.focus();
            return false;
        }
        if (!nameRegex.test(firstname)) {
            alert('First name can only contain letters');
            form.firstname.focus();
            return false;
        }

        if (!lastname || lastname.length < 2) {
            alert('Last name must be at least 2 characters');
            form.lastname.focus();
            return false;
        }
        if (!nameRegex.test(lastname)) {
            alert('Last name can only contain letters');
            form.lastname.focus();
            return false;
        }

        if (!address || address.length < 5) {
            alert('Address must be at least 5 characters');
            form.address.focus();
            return false;
        }

        if (!city || city.length < 2) {
            alert('City must be at least 2 characters');
            form.city.focus();
            return false;
        }
        if (!nameRegex.test(city)) {
            alert('City can only contain letters');
            form.city.focus();
            return false;
        }

        if (!state || state.length < 2) {
            alert('State must be at least 2 characters');
            form.state.focus();
            return false;
        }
        if (!nameRegex.test(state)) {
            alert('State can only contain letters');
            form.state.focus();
            return false;
        }

        if (!postcode || postcode.length < 3) {
            alert('Postcode must be at least 3 characters');
            form.postcode.focus();
            return false;
        }
        if (!postcodeRegex.test(postcode)) {
            alert('Invalid postcode format');
            form.postcode.focus();
            return false;
        }

        if (!country || country.length < 2) {
            alert('Country must be at least 2 characters');
            form.country.focus();
            return false;
        }
        if (!nameRegex.test(country)) {
            alert('Country can only contain letters');
            form.country.focus();
            return false;
        }

        if (!checkoutItems || checkoutItems.length === 0) {
            alert('Your cart is empty');
            return false;
        }

        return true;
    }

    async function handlePlaceOrder() {
        if (!validateCheckoutForm()) {
            return;
        }

        const formData = new FormData(form);

        const orderData = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            address: formData.get('address'),
            city: formData.get('city'),
            postcode: formData.get('postcode'),
            country: formData.get('country'),
            state: formData.get('state'),
            items: checkoutItems
        };

        try {
            const res = await fetch('/place-order', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });
            const data = await res.json();
            
            if (data.success) {
                sessionStorage.setItem('lastOrder', JSON.stringify({
                    orderId: data.order ? data.order._id : Date.now(),
                    firstname: orderData.firstname,
                    lastname: orderData.lastname,
                    address: orderData.address,
                    city: orderData.city,
                    state: orderData.state,
                    postcode: orderData.postcode,
                    itemCount: checkoutItems.length
                }));
                window.location.href = '/order-success';
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Please try again.');
        }
    }

})();
