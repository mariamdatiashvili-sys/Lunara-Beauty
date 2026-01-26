/**
 * Shopping Cart System
 */

document.addEventListener('DOMContentLoaded', () => {
    initCartUI();
});

let cart = JSON.parse(localStorage.getItem('lunaraCart')) || [];

function initCartUI() {
    // 1. Inject Cart UI (Floating Icon + Sidebar)
    // Only inject if not already present
    if (document.getElementById('cartIcon')) return;

    const cartUI = `
        <div id="cartIcon" class="cart-icon">
            <i class="fas fa-shopping-bag"></i>
            <span id="cartCount">0</span>
        </div>
        
        <div id="cartSidebar" class="cart-sidebar">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <span id="closeCart">&times;</span>
            </div>
            <div id="cartItems" class="cart-items">
                <!-- Items go here -->
                <p class="empty-msg">Your cart is empty.</p>
            </div>
            <div class="cart-footer">
                <div class="cart-total">Total: GEL <span id="cartTotal">0</span></div>
                <button id="checkoutBtn" class="btn btn-primary">Checkout</button>
                <button id="clearCartBtn" class="btn btn-outline-sm">Clear Cart</button>
            </div>
        </div>
        <div id="cartOverlay" class="cart-overlay"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartUI);

    // 2. Logic & Listeners
    setupCartListeners();
    updateCartUI();
}

function setupCartListeners() {
    const cartIcon = document.getElementById('cartIcon');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');

    // Open/Close
    window.openCart = () => {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    };

    window.closeCartMenu = () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    };

    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartMenu);
    overlay.addEventListener('click', closeCartMenu);

    document.getElementById('clearCartBtn').addEventListener('click', () => {
        cart = [];
        updateCartUI();
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Proceeding to checkout with total: GEL ' + document.getElementById('cartTotal').textContent);
        } else {
            alert('Cart is empty!');
        }
    });

    // Re-attach listeners to remove buttons delegated
    document.getElementById('cartItems').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        }
    });
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');

    // Safety check if UI not loaded yet
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            // Parse price just in case it's a string
            const p = parseFloat(item.price) || 0;
            total += p;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>GEL ${item.price}</p>
                </div>
                <button class="remove-btn" data-index="${index}">&times;</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    cartTotalEl.textContent = total;
    cartCountEl.textContent = cart.length;
    localStorage.setItem('lunaraCart', JSON.stringify(cart));
}

// Ensure this is global
window.addToCart = (name, price) => {
    cart.push({ name, price });
    updateCartUI();
    openCart();
};

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}
