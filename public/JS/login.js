const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Helper function to show error
function showError(message) {
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = message;
    } else {
        alert(message);
    }
}

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

// Exit early if loginForm is not found
if (!loginForm) {
    console.error('Login form not found!');
} else {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide error message if element exists
        if (errorMessage) {
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        try {
            console.log('Attempting login with email:', email);
            
            const response = await fetch('/loginform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important: Send cookies with the request
                body: JSON.stringify({ email, password })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers.get('content-type'));

            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Response data:', data);
                
                if (data.success) {
                    console.log('Login successful, redirecting to:', data.redirect);
                    window.location.href = data.redirect;
                } else {
                    showError(data.message || 'Login failed. Please check your credentials.');
                    console.error('Login failed:', data.message);
                }
            } else {
                const text = await response.text();
                console.log('Non-JSON response:', text);
                if (text.includes('shop.html') || response.url.includes('shop.html')) {
                    window.location.href = '/shop.html';
                } else {
                    showError(text || 'Login failed. Please check your credentials.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An error occurred. Please try again. Check console for details.');
        }
    });
}
