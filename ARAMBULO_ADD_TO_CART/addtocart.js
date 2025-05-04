document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart');
    const cartCountEl = document.querySelector('.cart-badge');
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart:not([disabled])');
    const productCards = document.querySelectorAll('.card');
  
    // Reset cart for guests
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      localStorage.removeItem('cartItems');
      if (cartCountEl) cartCountEl.textContent = '0';
    }
  
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
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
          alert('You must be logged in to add items to the cart.');
          return;
        }
        const card = btn.closest('.card');
        addItemToCart(card);
      });
    });
  
    productCards.forEach((card) => {
      if (card.querySelector('.btn-add-to-cart[disabled]')) return;
  
      card.setAttribute('draggable', true);
  
      card.addEventListener('dragstart', (e) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
          e.preventDefault();
          alert('You must be logged in to add items to the cart.');
          return false;
        }
        card.classList.add('dragging');
      });
  
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });
  
    cartIcon.addEventListener('click', (e) => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) {
        e.preventDefault();
        alert('You must be logged in to view your shopping cart.');
        return;
      }
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
  
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) {
        alert('You must be logged in to add items to the cart.');
        return;
      }
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
  });
  