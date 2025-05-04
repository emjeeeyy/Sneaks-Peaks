document.addEventListener('DOMContentLoaded', function() {
    // --- Card Management ---
    function getCards() {
        return JSON.parse(localStorage.getItem('orderCards') || '[]');
    }
    function setCards(cards) {
        localStorage.setItem('orderCards', JSON.stringify(cards));
    }
    function renderCards() {
        const tbody = document.getElementById('card-table-body');
        tbody.innerHTML = '';
        const cards = getCards();
        cards.forEach((card, idx) => {
            const tr = document.createElement('tr');
            tr.className = idx === 0 ? 'selected' : 'unselected';
            tr.innerHTML = `
                <td><span class="checkmark"><i class="bi ${idx === 0 ? 'bi-check-circle-fill' : 'bi-circle'}"></i></span></td>
                <td class="bank">${card.bank}</td>
                <td class="order-code">${card.orderCode}</td>
                <td class="full-name">${card.fullName}</td>
                <td class="valid-until">${card.validUntil}</td>
                <td><button class="btn btn-sm btn-danger delete-card-btn" data-idx="${idx}" title="Delete"><i class="bi bi-trash"></i></button></td>
            `;
            tbody.appendChild(tr);
        });
        setCardRowListeners();
        setDeleteCardListeners();
    }
    function setCardRowListeners() {
        document.querySelectorAll('.main-card tbody tr').forEach(function(row, idx) {
            row.addEventListener('click', function(e) {
                // Prevent selecting when clicking delete
                if (e.target.closest('.delete-card-btn')) return;
                document.querySelectorAll('.main-card tbody tr').forEach(function(r) {
                    r.classList.remove('selected');
                    r.classList.add('unselected');
                    r.querySelector('.checkmark i').className = 'bi bi-circle';
                });
                this.classList.add('selected');
                this.classList.remove('unselected');
                this.querySelector('.checkmark i').className = 'bi bi-check-circle-fill';
            });
        });
    }
    function setDeleteCardListeners() {
        document.querySelectorAll('.delete-card-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const idx = parseInt(this.getAttribute('data-idx'));
                let cards = getCards();
                cards.splice(idx, 1);
                setCards(cards);
                renderCards();
            });
        });
    }
    // Initial render
    renderCards();

    // Add new card
    document.querySelector('.add-card-row').addEventListener('click', function() {
        document.getElementById('add-card-form').style.display = 'block';
    });
    document.getElementById('cancelAddCard').addEventListener('click', function() {
        document.getElementById('add-card-form').reset();
        document.getElementById('add-card-form').style.display = 'none';
    });
    document.getElementById('orderCodeInput').addEventListener('input', function() {
        let val = this.value.replace(/[^0-9]/g, '');
        if (val.length > 5) val = val.slice(0, 5);
        this.value = val;
    });
    document.getElementById('validUntilInput').addEventListener('input', function(e) {
        let val = this.value.replace(/[^0-9/]/g, '');
        // Auto-insert slash after MM
        if (val.length === 2 && this.value.length === 2 && !val.includes('/')) {
            val = val + '/';
        }
        // Only allow MM/YY
        if (val.length > 5) val = val.slice(0, 5);
        this.value = val;
    });
    document.getElementById('add-card-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var bank = document.getElementById('bankInput').value.trim();
        var orderCode = document.getElementById('orderCodeInput').value.trim();
        var fullName = document.getElementById('fullNameInput').value.trim();
        var validUntil = document.getElementById('validUntilInput').value.trim();
        // Validate order code: must be exactly 5 digits
        if (!/^[0-9]{5}$/.test(orderCode)) {
            showCustomAlert('Order Code must be exactly 5 digits (e.g. 00001).');
            return;
        }
        // Validate valid until: MM/YY format and YY >= 25
        var validUntilMatch = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.exec(validUntil);
        if (!validUntilMatch) {
            showCustomAlert('Valid Until must be in MM/YY format (e.g. 12/31).');
            return;
        }
        var yy = parseInt(validUntilMatch[2], 10);
        if (yy < 25) {
            showCustomAlert('Valid Until year must be 25 or higher (2025+).');
            return;
        }
        if (!bank || !orderCode || !fullName || !validUntil) return;
        // Save card to localStorage
        let cards = getCards();
        cards.push({ bank, orderCode, fullName, validUntil });
        setCards(cards);
        renderCards();
        document.getElementById('add-card-form').reset();
        document.getElementById('add-card-form').style.display = 'none';
    });

    // Display order items and total
    function renderOrderItems() {
        let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
        const orderList = document.getElementById('orderList');
        const orderTotal = document.getElementById('orderTotal');
        let total = 0;

        if (orderList) {
            if (orderItems.length === 0) {
                orderList.innerHTML = '<p>No items in your order.</p>';
            } else {
                orderList.innerHTML = orderItems.map((item, idx) => {
                    let priceNum = parseFloat((item.price || '').replace(/[^\d.]/g, '')) || 0;
                    let subtotal = priceNum * (item.qty || 1);
                    total += subtotal;
                    let imgPath = item.img || '';
                    // Use the image path as stored in the cart, no modifications
                    return `<div class="order-item d-flex align-items-center mb-2">
                        <img src="${imgPath}" alt="${item.name}" class="order-img me-2" />
                        <span class="me-2">${item.name}</span>
                        <span class="me-2">₱${priceNum.toLocaleString()}</span>
                        <span class="me-2">Qty: ${item.qty}</span>
                        <span class="fw-bold">Subtotal: ₱${subtotal.toLocaleString()}</span>
                        <button class="btn btn-sm btn-danger ms-2 delete-order-item" data-idx="${idx}" title="Remove"><i class="bi bi-trash"></i></button>
                    </div>`;
                }).join('');
            }
        }
        if (orderTotal) {
            orderTotal.textContent = `₱${total.toLocaleString()}`;
        }

        // Add event listeners for trash buttons
        document.querySelectorAll('.delete-order-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                orderItems.splice(idx, 1);
                localStorage.setItem('orderItems', JSON.stringify(orderItems));
                renderOrderItems();
            });
        });
    }

    renderOrderItems();

    // Pay your order
    document.querySelector('.pay-btn').addEventListener('click', function() {
        // Gather order info
        let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
        let total = 0;
        orderItems.forEach(item => {
            let priceNum = parseFloat((item.price || '').replace(/[^\d.]/g, '')) || 0;
            total += priceNum * (item.qty || 1);
        });
        // Get selected card info
        let selectedCard = document.querySelector('.main-card tbody tr.selected');
        let paymentMethod = 'Credit Card';
        let buyerName = '';
        if (selectedCard) {
            paymentMethod = selectedCard.querySelector('.bank')?.textContent || 'Credit Card';
            buyerName = selectedCard.querySelector('.full-name')?.textContent || '';
        }
        // Generate ref number and payment time
        let refNumber = Date.now().toString().slice(-10); // last 10 digits of timestamp
        let now = new Date();
        let paymentTime = now.toLocaleDateString('en-GB') + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        // Save to localStorage
        const orderInfo = {
            refNumber,
            paymentTime,
            paymentMethod,
            buyerName,
            totalPrice: total
        };
        localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
        window.location.href = '../payment result/paymentresult.html';
    });

    // Back arrow to cart
    document.querySelector('.back-arrow-btn').addEventListener('click', function() {
        window.location.href = '../ARAMBULO_ADD_TO_CART/Shopping Cart.html';
    });
});

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