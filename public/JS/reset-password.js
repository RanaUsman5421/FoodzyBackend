const resetForm = document.getElementById('resetForm');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const emailInput = document.getElementById('email');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordStrengthDiv = document.getElementById('passwordStrength');

// Get email from sessionStorage
if (emailInput) {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (storedEmail) {
        emailInput.value = storedEmail;
    } else {
        // If no email, redirect to forgot password
        window.location.href = '/forgot-password';
    }
}

// Password strength checker
if (newPasswordInput) {
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        if (passwordStrengthDiv) {
            if (password.length === 0) {
                passwordStrengthDiv.textContent = '';
                passwordStrengthDiv.className = 'password-strength';
            } else if (password.length < 8) {
                passwordStrengthDiv.textContent = 'Password must be at least 8 characters';
                passwordStrengthDiv.className = 'password-strength weak';
            } else if (password.length < 12) {
                passwordStrengthDiv.textContent = 'Medium strength';
                passwordStrengthDiv.className = 'password-strength medium';
            } else {
                passwordStrengthDiv.textContent = 'Strong password';
                passwordStrengthDiv.className = 'password-strength strong';
            }
        }
    });
}

if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput ? emailInput.value : '';
        const code = document.getElementById('code').value.trim();
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

        // Validation
        if (!code) {
            showMessage('Please enter the verification code', 'error');
            return;
        }

        if (code.length !== 6) {
            showMessage('Verification code must be 6 digits', 'error');
            return;
        }

        if (!newPassword) {
            showMessage('Please enter a new password', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showMessage('Password must be at least 8 characters', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Resetting...';
        }
        
        if (messageDiv) {
            messageDiv.className = 'message';
            messageDiv.style.display = 'none';
        }

        try {
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    code: code,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                showMessage(data.message, 'success');
                // Clear session storage
                sessionStorage.removeItem('resetEmail');
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showMessage(data.message, 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Reset Password';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again.', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reset Password';
            }
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
