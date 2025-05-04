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

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupButton = document.getElementById('signupButton');
    
    signupButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'register.html';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            showCustomAlert('Please fill in all fields');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showCustomAlert('Email not found. Please register first.');
            return;
        }

        if (atob(user.password) !== password) {
            showCustomAlert('Incorrect password. Please try again.');
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            fullName: user.fullName
        }));

        if (rememberMe) {
            sessionStorage.setItem('rememberedUser', JSON.stringify({
                email: user.email,
                fullName: user.fullName
            }));
        }

        showCustomAlert('Login successful! Welcome to Sneaks & Picks!', function() {
            window.location.href = '../homepageloggedin.html';
        });
    });

    document.getElementById('homeButton').addEventListener('click', function() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            window.location.href = '../homepageloggedin.html';
        } else {
            window.location.href = '../index.html';
        }
    });
}); 