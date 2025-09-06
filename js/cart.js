function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart(cart);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
}

function updateCartCount() {
    const cart = getCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const cart = getCart();

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="5" class="text-center">Keranjang Anda kosong.</td></tr>';
            cartTotalContainer.textContent = 'Rp 0';
            return;
        }

        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                cart.forEach(cartItem => {
                    const product = products.find(p => p.id === cartItem.id);
                    if (product) {
                        const itemTotal = parseInt(product.price.replace(/[^0-9]/g, '')) * cartItem.quantity;
                        total += itemTotal;

                        const cartItemRow = `
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto; margin-right: 15px;">
                                        ${product.name}
                                    </div>
                                </td>
                                <td>${product.price}</td>
                                <td>
                                    <input type="number" class="form-control" value="${cartItem.quantity}" min="1" onchange="updateQuantity(${product.id}, this.value)">
                                </td>
                                <td>Rp ${itemTotal.toLocaleString('id-ID')}</td>
                                <td>
                                    <button class="btn btn-danger" onclick="removeFromCart(${product.id})">Hapus</button>
                                </td>
                            </tr>
                        `;
                        cartItemsContainer.innerHTML += cartItemRow;
                    }
                });

                cartTotalContainer.textContent = `Rp ${total.toLocaleString('id-ID')}`;
            });
    }
}

function updateQuantity(productId, quantity) {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity = parseInt(quantity);
        if (cart[productIndex].quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    saveCart(cart);
    displayCart();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
