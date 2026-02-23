/**
 * Cart Page JavaScript
 * Handles cart functionality, quantity updates, and item removal
 */

(function() {
    'use strict';

    let cartState = [];
    let cartItemsContainer;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initCart();
    });

    function initCart() {
        cartItemsContainer = document.querySelector('.cart-items');
        if (cartItemsContainer) {
            loadCart();
            setupEventListeners();
        }
    }

    async function loadCart() {
        try {
            const res = await fetch('/cart');
            const data = await res.json();
            cartState = data;
            renderCart();
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';

        cartState.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <div class="cart-img">
                    <img src="${item.product.image}" alt="${item.product.product_name}"/>
                    <span>${item.product.product_name}</span>
                </div>
                <div>${item.product.discount_price}</div>
                <div class="quantity">
                    <i class="fa-solid fa-plus qty-btn" data-id="${item.product._id}" data-action="increase"></i>
                    <p>${item.quantity}</p>
                    <i class="fa-solid fa-minus qty-btn" data-id="${item.product._id}" data-action="decrease"></i>
                </div>
                <div>${Number(item.product.discount_price) * item.quantity}</div>
                <div class="trash-icon">
                    <i class="fa-solid fa-trash-can remove-btn" data-id="${item.product._id}"></i>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });
    }

    function setupEventListeners() {
        if (!cartItemsContainer) return;

        // Remove button click
        cartItemsContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-btn');
            if (removeBtn) {
                const productId = removeBtn.dataset.id;
                removeFromCart(productId);
            }
        });

        // Quantity button click
        cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.qty-btn');
            if (btn) {
                const productId = btn.dataset.id;
                const action = btn.dataset.action;
                updateQuantity(productId, action);
            }
        });
    }

    async function removeFromCart(productId) {
        try {
            const res = await fetch(`/removeFromCart/${productId}`, {
                method: 'DELETE'
            });

            const data = await res.json();
            cartState = data.cart;
            renderCart();
        } catch (error) {
            console.error('Remove failed', error);
        }
    }

    async function updateQuantity(productId, action) {
        try {
            const res = await fetch('/cart/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, action })
            });

            const data = await res.json();
            cartState = data.cart;
            renderCart();
        } catch (err) {
            console.error('Quantity update failed', err);
        }
    }

})();
