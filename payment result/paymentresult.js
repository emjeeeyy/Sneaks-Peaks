// DOM Elements
const cartBadge = document.querySelector('.cart-badge');
const backToCartBtn = document.querySelector('.btn-main');
const logoutBtn = document.querySelector('.btn-outline');
const accountButton = document.getElementById('accountButton');
const navLinks = document.querySelectorAll('.nav-links a');
const cartButton = document.querySelector('.cart');

// Initialize cart count from localStorage
let cartCount = localStorage.getItem('cartCount') || 0;
updateCartBadge();

// Update cart badge
function updateCartBadge() {
    cartBadge.textContent = cartCount;
    localStorage.setItem('cartCount', cartCount);
}

// Navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.textContent.trim().toLowerCase();
        if (category === 'home') {
            window.location.href = '../homepageloggedin.html';
        } else if (category === 'man') {
            window.location.href = '../ARAMBULO_ADD_TO_CART/addtocartacc.html';
        } else {
            window.location.href = `../index.html?category=${category}`;
        }
    });
});

// Back to Cart button
backToCartBtn.addEventListener('click', () => {
    window.location.href = '../ARAMBULO_ADD_TO_CART/Shopping Cart.html';
});

// Logout button
logoutBtn.addEventListener('click', () => {
    // Clear user session
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cartCount');
    // Redirect to logout page
    window.location.href = '../logout/logout.html';
});

// Account button functionality
if (accountButton) {
    accountButton.addEventListener('click', () => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // Redirect to user profile or account page
            window.location.href = '../Registration and Log in/profile.html';
        } else {
            // Redirect to login page
            window.location.href = '../Registration and Log in/login.html';
        }
    });
}

// Cart button functionality
if (cartButton) {
    cartButton.addEventListener('click', () => {
        window.location.href = '../ARAMBULO_ADD_TO_CART/Shopping Cart.html';
    });
}

// Fill in payment result details from orderInfo
function fillPaymentResult() {
    const orderInfo = JSON.parse(localStorage.getItem('orderInfo') || '{}');
    if (orderInfo && orderInfo.refNumber) {
        // Amount
        const amountEl = document.querySelector('.amount');
        if (amountEl) amountEl.textContent = `₱${Number(orderInfo.totalPrice).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        // Ref Number
        const refEl = document.querySelector('.result-details tr:nth-child(1) .value');
        if (refEl) refEl.textContent = orderInfo.refNumber;
        // Payment Time
        const timeEl = document.querySelector('.result-details tr:nth-child(2) .value');
        if (timeEl) timeEl.textContent = orderInfo.paymentTime;
        // Payment Method
        const methodEl = document.querySelector('.result-details tr:nth-child(3) .value');
        if (methodEl) methodEl.textContent = orderInfo.paymentMethod;
        // Buyer's Name
        const nameEl = document.querySelector('.result-details tr:nth-child(4) .value');
        if (nameEl) nameEl.textContent = orderInfo.buyerName;
        // Total row
        const totalRowEl = document.querySelector('.total-row .value');
        if (totalRowEl) totalRowEl.textContent = `₱${Number(orderInfo.totalPrice).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    }
}

// Call on page load
fillPaymentResult(); 