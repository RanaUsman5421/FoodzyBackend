
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Fallback: Ensure login form is visible if animation fails
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const loginDiv = document.querySelector('.login');
        if (loginDiv && (loginDiv.offsetHeight === 0 || window.getComputedStyle(loginDiv).opacity === '0')) {
            loginDiv.style.opacity = '1';
            loginDiv.style.transform = 'none';
            loginDiv.style.display = 'block';
        }
        if (loginForm && (loginForm.offsetHeight === 0 || window.getComputedStyle(loginForm).opacity === '0')) {
            loginForm.style.opacity = '1';
            loginForm.style.transform = 'none';
            loginForm.style.display = 'block';
        }
    }, 600); // Wait for animation to run first
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }

    try {
        const response = await fetch('/loginform', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            if (data.success) {
                window.location.href = '/shop.html';
            } else {
                showError(data.message || 'Login failed. Please check your credentials.');
            }
        } else {
            const text = await response.text();
            if (text.includes('shop.html') || response.url.includes('shop.html')) {
                window.location.href = '/shop.html';
            } else {
                showError(text || 'Login failed. Please check your credentials.');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred. Please try again.');
    }
});

function showError(message) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
}
