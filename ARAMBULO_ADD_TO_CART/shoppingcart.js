document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.querySelector('.row.row-cols-1');
  const leftArrow = document.querySelectorAll('.carousel-arrow')[0];
  const rightArrow = document.querySelectorAll('.carousel-arrow')[1];
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  const itemsPerPage = 4;
  let currentPage = 0;

  function renderCartPage() {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
      cartContainer.innerHTML = '<p class="text-center w-100">🛒 Your cart is empty.</p>';
      leftArrow.style.visibility = 'hidden';
      rightArrow.style.visibility = 'hidden';
      updateSelectedTotal();
      return;
    }

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = cart.slice(start, end);

    pageItems.forEach((item, index) => {
      const col = document.createElement('div');
      col.className = 'col d-flex';
      col.innerHTML = `
        <div class="product-card position-relative w-100">
          <input type="checkbox" class="select-checkbox">
          <button class="delete-btn">🗑️</button>
          <div class="img-container">
            <img src="${item.img}" alt="${item.name}">
          </div>
          <h6>${item.name}</h6>
          <div class="quantity-controls">
            <button class="decrease">-</button>
            <span>${item.qty}</span>
            <button class="increase">+</button>
          </div>
          <p><strong>${item.price}</strong></p>
          <button class="checkout-btn">CHECK OUT</button>
        </div>
      `;
      setupListeners(col, start + index);
      cartContainer.appendChild(col);
    });

    leftArrow.style.visibility = currentPage === 0 ? 'hidden' : 'visible';
    rightArrow.style.visibility = end >= cart.length ? 'hidden' : 'visible';

    updateSelectedTotal(); 
  }

  function setupListeners(col, index) {
    const deleteBtn = col.querySelector('.delete-btn');
    const increaseBtn = col.querySelector('.increase');
    const decreaseBtn = col.querySelector('.decrease');
    const qtyDisplay = col.querySelector('.quantity-controls span');
    const checkbox = col.querySelector('.select-checkbox');
    const checkoutBtn = col.querySelector('.checkout-btn');

    deleteBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(cart));
      if (currentPage > 0 && index < currentPage * itemsPerPage) currentPage--;
      renderCartPage();
    });

    increaseBtn.addEventListener('click', () => {
      cart[index].qty += 1;
      qtyDisplay.textContent = cart[index].qty;
      localStorage.setItem('cartItems', JSON.stringify(cart));
      updateSelectedTotal();
    });

    decreaseBtn.addEventListener('click', () => {
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
        qtyDisplay.textContent = cart[index].qty;
        localStorage.setItem('cartItems', JSON.stringify(cart));
        updateSelectedTotal();
      }
    });

    checkbox.addEventListener('change', updateSelectedTotal);

    checkoutBtn.addEventListener('click', () => {
      const selectedItems = [];
      const allCards = document.querySelectorAll('.product-card');
      
      allCards.forEach((card) => {
        const checkbox = card.querySelector('.select-checkbox');
        if (checkbox.checked) {
          const name = card.querySelector('h6').textContent;
          const price = card.querySelector('p strong').textContent;
          const qty = parseInt(card.querySelector('.quantity-controls span').textContent);
          const img = card.querySelector('img').getAttribute('src');
          selectedItems.push({ name, price, qty, img });
        }
      });
      
      if (selectedItems.length > 0) {
        localStorage.setItem('orderItems', JSON.stringify(selectedItems));
        window.location.href = '../order form/order.html';
      } else {
        alert('Please select at least one item to checkout');
      }
    });
  }

  function updateSelectedTotal() {
    const allCards = document.querySelectorAll('.product-card');
    let total = 0;
    let selectedCount = 0;

    allCards.forEach((card) => {
      const checkbox = card.querySelector('.select-checkbox');
      const qty = parseInt(card.querySelector('.quantity-controls span').textContent);
      const priceText = card.querySelector('p strong').textContent;
      const price = parseFloat(priceText.replace(/[₱,]/g, ''));

      if (checkbox.checked) {
        total += qty * price;
        selectedCount++;
      }
    });

    const bar = document.getElementById('multiCheckoutBar');
    const totalEl = document.getElementById('selectedTotal');

    if (selectedCount > 0) {
      totalEl.textContent = `₱${total.toLocaleString()}`;
      bar.classList.remove('d-none');
    } else {
      bar.classList.add('d-none');
    }
  }

  leftArrow.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderCartPage();
    }
  });

  rightArrow.addEventListener('click', () => {
    if ((currentPage + 1) * itemsPerPage < cart.length) {
      currentPage++;
      renderCartPage();
    }
  });

  const menuBtn = document.querySelector('.header-right button');
  const sideMenu = document.getElementById('sideMenu');
  const closeBtn = document.getElementById('closeMenu');

  menuBtn.addEventListener('click', () => {
    sideMenu.style.transform = 'translateX(0)';
  });

  closeBtn.addEventListener('click', () => {
    sideMenu.style.transform = 'translateX(100%)';
  });

  const homeLink = document.querySelector('#sideMenu ul li:first-child a');

  homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      window.location.href = '../homepageloggedin.html';
    } else {
      window.location.href = '../index.html';
    }
  });

  const multiCheckoutBar = document.getElementById('multiCheckoutBar');
  if (multiCheckoutBar) {
    multiCheckoutBar.addEventListener('click', function(e) {
      if (e.target.classList.contains('checkout-btn')) {
        const allCards = document.querySelectorAll('.product-card');
        const selectedItems = [];
        allCards.forEach((card) => {
          const checkbox = card.querySelector('.select-checkbox');
          if (checkbox.checked) {
            const name = card.querySelector('h6').textContent;
            const price = card.querySelector('p strong').textContent;
            const qty = parseInt(card.querySelector('.quantity-controls span').textContent);
            const img = card.querySelector('img').getAttribute('src');
            selectedItems.push({ name, price, qty, img });
          }
        });
        if (selectedItems.length > 0) {
          localStorage.setItem('orderItems', JSON.stringify(selectedItems));
          window.location.href = '../order form/order.html';
        } else {
          alert('Please select at least one item to checkout');
        }
      }
    });
  }

  renderCartPage(); 
});
