document.addEventListener('DOMContentLoaded', function() {
    // Redirect to index.html if not logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = '../index.html';
        return;
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

    // Handle Man link click
    const manLink = document.querySelector('.nav-links a[href="#"]:nth-child(3)');
    if (manLink) {
        manLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../ARAMBULO_ADD_TO_CART/addtocartacc.html';
        });
    }

    // Cart icon click: go to shopping cart
    const cartButton = document.querySelector('.cart');
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            window.location.href = 'ARAMBULO_ADD_TO_CART/Shopping Cart.html';
        });
    }

    // Account icon click: show user info in custom modal
    const accountButton = document.getElementById('accountButton');
    if (accountButton) {
        accountButton.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const modal = document.getElementById('accountModal');
            const info = document.getElementById('accountInfo');
            if (user) {
                info.innerHTML = `<strong>Account Information</strong><br><br>` +
                    `<strong>Name:</strong> ${user.fullName}<br>` +
                    `<strong>Email:</strong> ${user.email}`;
            } else {
                info.textContent = 'No user information found.';
            }
            modal.style.display = 'flex';
        });
    }
    const closeAccountModal = document.getElementById('closeAccountModal');
    if (closeAccountModal) {
        closeAccountModal.onclick = function() {
            document.getElementById('accountModal').style.display = 'none';
        };
    }

    // Handle plus button click
    const plusButton = document.querySelector('.plus-button');
    if (plusButton) {
        plusButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../ARAMBULO_ADD_TO_CART/addtocartacc.html';
        });
    }

    // Handle more products button click
    const moreProductsButton = document.querySelector('.more-products');
    if (moreProductsButton) {
        moreProductsButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../ARAMBULO_ADD_TO_CART/addtocartacc.html';
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

    const logoutAccountModal = document.getElementById('logoutAccountModal');
    if (logoutAccountModal) {
        logoutAccountModal.onclick = function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        };
    }
}); 