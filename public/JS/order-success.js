// order-success.js
// Handles order details rendering for order-success.html

document.addEventListener('DOMContentLoaded', function () {
    const orderData = JSON.parse(sessionStorage.getItem('lastOrder') || '{}');
    if (orderData.orderId) {
        document.getElementById('orderNumber').textContent = 'Order ID: #' + orderData.orderId;
        document.getElementById('customerName').textContent = orderData.firstname + ' ' + orderData.lastname;
        document.getElementById('deliveryAddress').textContent = 
            orderData.address + ', ' + orderData.city + ', ' + orderData.state + ' - ' + orderData.postcode;
        document.getElementById('itemCount').textContent = orderData.itemCount || '0';
        document.getElementById('orderDate').textContent = new Date().toLocaleDateString();
    } else {
        document.querySelector('.success-container').innerHTML = `
            <div class="success-icon">
                <i class="fa-solid fa-exclamation"></i>
            </div>
            <h1 class="success-title">No Order Found</h1>
            <p class="success-message">We couldn't find your order details. Please complete your purchase first.</p>
            <div class="btn-container">
                <a href="checkout.html" class="btn btn-primary">Go to Checkout</a>
                <a href="shop.html" class="btn btn-secondary">Continue Shopping</a>
            </div>
        `;
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 3000);
    }
});
