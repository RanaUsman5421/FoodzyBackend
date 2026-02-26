const forgotForm = document.getElementById('forgotForm');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            showMessage('Please enter your email address', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        messageDiv.className = 'message';
        messageDiv.style.display = 'none';

        try {
            const response = await fetch('/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                showMessage(data.message + ' Redirecting...', 'success');
                sessionStorage.setItem('resetEmail', email);
                setTimeout(() => {
                    window.location.href = '/reset-password';
                }, 2000);
            } else {
                showMessage(data.message, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Verification Code';
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Verification Code';
        }
    });
}

function showMessage(msg, type) {
    if (messageDiv) {
        messageDiv.textContent = msg;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
    }
}
