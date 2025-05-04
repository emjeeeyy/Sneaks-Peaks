document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart');
    const cartCountEl = document.querySelector('.cart-badge');
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart:not([disabled])');
    const productCards = document.querySelectorAll('.card');
  
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount();
  
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                return;
            }
            if (href === '../homepageloggedin.html' || href === '../index.html') {
                e.preventDefault();
                const user = JSON.parse(localStorage.getItem('currentUser'));
                if (user) {
                    window.location.href = '../homepageloggedin.html';
                } else {
                    window.location.href = '../index.html';
                }
            }
        });
    });
  
    addToCartBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        addItemToCart(card);
      });
    });
  
    productCards.forEach((card) => {
      if (card.querySelector('.btn-add-to-cart[disabled]')) return;
  
      card.setAttribute('draggable', true);
  
      card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
      });
  
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });
  
    cartIcon.addEventListener('dragover', (e) => {
      e.preventDefault();
      cartIcon.classList.add('bg-light', 'shadow-sm');
    });
  
    cartIcon.addEventListener('dragleave', () => {
      cartIcon.classList.remove('bg-light', 'shadow-sm');
    });
  
    cartIcon.addEventListener('drop', (e) => {
      e.preventDefault();
      cartIcon.classList.remove('bg-light', 'shadow-sm');
  
      const draggingCard = document.querySelector('.dragging');
      if (draggingCard) {
        addItemToCart(draggingCard);
      }
    });
  
    function addItemToCart(card) {
      const title = card.querySelector('.card-title').textContent.trim();
      const priceText = card.querySelector('.card-text.font-weight-bold').textContent.trim();
      const price = priceText.match(/₱[\d,]+/)[0];
      let img = card.querySelector('img').getAttribute('src');
      img = '../ARAMBULO_ADD_TO_CART/' + img.split('/').pop(); // Always correct relative path
  
      const existingIndex = cart.findIndex(item => item.name === title);
  
      if (existingIndex !== -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({
          name: title,
          price,
          img,
          qty: 1
        });
      }
  
      localStorage.setItem('cartItems', JSON.stringify(cart));
      updateCartCount();
    }
  
    function updateCartCount() {
      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      cartCountEl.textContent = total;
    }

    // Handle Man link click
    const manLink = document.getElementById('manLink');
    if (manLink) {
        manLink.addEventListener('click', function(e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const referrer = document.referrer;
            
            if (user && referrer.includes('homepageloggedin.html')) {
                // User is logged in and came from homepageloggedin.html
                window.location.href = '../ARAMBULO_ADD_TO_CART/addtocartacc.html';
            } else if (!user && referrer.includes('index.html')) {
                // User is not logged in and came from index.html
                window.location.href = '../index.html';
            }
        });
    }

    const accountButton = document.getElementById('accountButton');
    if (accountButton) {
        accountButton.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const modal = document.getElementById('customAlert');
            const messageEl = document.getElementById('alertMessage');
            if (user) {
                messageEl.innerHTML = `<strong>Account Information</strong><br><br>` +
                    `<strong>Name:</strong> ${user.fullName}<br>` +
                    `<strong>Email:</strong> ${user.email}<br><br>` +
                    `<button id='logoutBtn' style='background:#dc3545;color:white;border:none;padding:8px 20px;border-radius:4px;margin-top:10px;cursor:pointer;'>Log out</button>`;
            } else {
                messageEl.textContent = 'No user information found.';
            }
            modal.style.display = 'flex';
            setTimeout(() => {
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.onclick = function() {
                        localStorage.removeItem('currentUser');
                        window.location.href = '../index.html';
                    };
                }
            }, 0);
        });
    }

    const okButton = document.getElementById('customAlertOk');
    if (okButton) {
        okButton.onclick = function() {
            document.getElementById('customAlert').style.display = 'none';
        };
    }
}); 