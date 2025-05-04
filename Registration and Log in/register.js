document.addEventListener('DOMContentLoaded', function() {
    window.showCustomAlert = function(message, callback) {
        const modal = document.getElementById('customAlert');
        const messageEl = document.getElementById('alertMessage');
        messageEl.textContent = message;
        modal.style.display = 'flex';
        
        const okButton = modal.querySelector('button');
        okButton.onclick = function() {
            closeCustomAlert();
            if (callback) callback();
        };
    };

    window.closeCustomAlert = function() {
        const modal = document.getElementById('customAlert');
        modal.style.display = 'none';
    };

    const registerForm = document.getElementById('registerForm');
    const termsCheckbox = document.getElementById('terms');
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    function validateField(field, fieldName) {
        const input = document.getElementById(field);
        const value = input.value.trim();
        
        input.classList.remove('error');
        
        if (!value) {
            input.classList.add('error');
            showCustomAlert(`Please enter your ${fieldName}`);
            input.focus();
            return false;
        }

        if (field === 'phone') {
            if (!/^\d+$/.test(value)) {
                input.classList.add('error');
                showCustomAlert('Phone number can only contain numbers');
                input.focus();
                return false;
            }
            if (value.length < 10 || value.length > 11) {
                input.classList.add('error');
                showCustomAlert('Phone number must be 10-11 digits');
                input.focus();
                return false;
            }
        }
        
        return true;
    }

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });
        
        if (!validateField('email', 'email address')) return;
        if (!validateField('fullName', 'full name')) return;
        if (!validateField('address', 'home address')) return;
        if (!validateField('phone', 'phone number')) return;
        if (!validateField('location', 'city/province/country')) return;
        if (!validateField('password', 'password')) return;
        if (!validateField('confirmPassword', 'password confirmation')) return;

        const email = document.getElementById('email').value.trim();
        const fullName = document.getElementById('fullName').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const location = document.getElementById('location').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!termsCheckbox.checked) {
            showCustomAlert('Please read and accept the terms and conditions');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').classList.add('error');
            showCustomAlert('Please enter a valid email address');
            document.getElementById('email').focus();
            return;
        }
        if (password.length < 8 || password.length > 16) {
            document.getElementById('password').classList.add('error');
            showCustomAlert('Password must be between 8 and 16 characters');
            document.getElementById('password').focus();
            return;
        }
        if (password !== confirmPassword) {
            document.getElementById('confirmPassword').classList.add('error');
            showCustomAlert('Passwords do not match');
            document.getElementById('confirmPassword').focus();
            return;
        }

        const userData = {
            email,
            fullName,
            address,
            phone,
            location,
            password: btoa(password) 
        };

        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(user => user.email === email)) {
            showCustomAlert('Email already registered. Please use a different email or login.');
            return;
        }

        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));

        showCustomAlert('Registration successful! You may now log in to Sneaks & Picks!', function() {
            window.location.href = '../Registration and Log in/login.html';
        });
    });

    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });

    document.getElementById('homeButton').addEventListener('click', function() {
        window.location.href = '../index.html';
    });
}); 