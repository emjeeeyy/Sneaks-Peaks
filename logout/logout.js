// logout.js

document.addEventListener('DOMContentLoaded', function() {
    // Home icon click: go to homepageloggedin.html
    const homeBtn = document.getElementById('homeButton');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../homepageloggedin.html';
        });
    }

    // Log out button click: require password, then go to index.html
    const logoutBtn = document.querySelector('.logout-btn');
    const passwordInput = document.querySelector('.form-control[type="password"]');
    if (logoutBtn && passwordInput) {
        logoutBtn.addEventListener('click', function() {
            const enteredPassword = passwordInput.value;
            // Get current user from localStorage
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) {
                // Always log out and redirect, even if not logged in
                localStorage.removeItem('currentUser');
                window.location.href = '../index.html';
                return;
            }
            if (!enteredPassword) {
                alert('Please enter your password to log out.');
                return;
            }
            // Check password (case-sensitive)
            if (enteredPassword === user.password) {
                localStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            } else {
                alert('Incorrect password. Please try again.');
            }
        });
    }
}); 