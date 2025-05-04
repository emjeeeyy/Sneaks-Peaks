document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.login');
    const signupButton = document.querySelector('.signup');
    const cartButton = document.querySelector('.cart');

    loginButton.addEventListener('click', function() {
        window.location.href = 'Registration and Log in/login.html';
    });
    signupButton.addEventListener('click', function() {
        window.location.href = 'Registration and Log in/register.html';
    });
    cartButton.addEventListener('click', function() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            window.location.href = '../ARAMBULO_ADD_TO_CART/Shopping Cart.html';
        } else {
            // Show alert modal if not logged in
            const modal = document.getElementById('customAlert');
            const messageEl = document.getElementById('alertMessage');
            messageEl.textContent = 'You must be logged in to access the shopping cart.';
            modal.style.display = 'flex';
            const okButton = modal.querySelector('button');
            okButton.onclick = function() {
                modal.style.display = 'none';
            };
        }
    });

    // --- LOGGED IN PAGE LOGIC ---
    const accountButton = document.getElementById('accountButton');
    const welcomeUser = document.getElementById('welcomeUser');
    if (accountButton) {
        // Show welcome message if user is logged in
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && welcomeUser) {
            welcomeUser.textContent = `Welcome, ${user.fullName}!`;
        }
        accountButton.addEventListener('click', function() {
            // Show user info in an alert
            if (user) {
                alert(`User Information:\nName: ${user.fullName}\nEmail: ${user.email}`);
            } else {
                alert('No user information found.');
            }
        });
    }

    // Handle navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }
        });
    });

    // Handle plus button click
    const plusButton = document.querySelector('.plus-button');
    if (plusButton) {
        plusButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../ARAMBULO_ADD_TO_CART/Add to Cart page.html';
        });
    }

    // Handle more products button click
    const moreProductsButton = document.querySelector('.more-products');
    if (moreProductsButton) {
        moreProductsButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../ARAMBULO_ADD_TO_CART/Add to Cart page.html';
        });
    }

    // Update cart count
    const cartCountEl = document.querySelector('.cart-badge');
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    function updateCartCount() {
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCountEl) cartCountEl.textContent = total;
    }
    
    updateCartCount();
});