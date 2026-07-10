/* =========================================================
   GLOW RITUAL — SHARED CART SYSTEM
   Include this ONE file on every page (index.html, moreproduct.html,
   product.html, cart.html) instead of separate scripts.
   It uses localStorage key "glowCart" so the cart persists
   across pages.
   ========================================================= */

const CART_KEY = "glowCart";
const FREE_SHIPPING_LIMIT = 499;
const DELIVERY_FEE = 40;

/* ---------- storage helpers ---------- */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateHeaderCartCount();
}

/* ---------- header badge (every page) ---------- */
function updateHeaderCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    // Update every badge on the page (nav + mobile nav both use this class)
    document.querySelectorAll(".cart-badge").forEach(badge => {
        badge.innerText = totalItems;
    });
}

/* =========================================================
   PRODUCT LISTING PAGE (index.html / moreproduct.html / product.html)
   Each product card needs a unique data-product-id on the
   outer card div, e.g. data-product-id="daily-radiance-1"
   ========================================================= */

// Keeps track of the currently selected size/price per card
function selectSize(size, price, mrp, btnEl) {
    const card = btnEl.closest(".product-card");
    if (!card) return;

    card.dataset.size = size;
    card.dataset.price = price;
    card.dataset.mrp = mrp;

    // toggle active styles on size buttons
    card.querySelectorAll(".size-btn").forEach(b => {
        b.classList.remove("bg-ink", "text-parchment", "border-ink");
        b.classList.add("border-[#DCD3BA]", "text-ash");
    });
    btnEl.classList.add("bg-ink", "text-parchment", "border-ink");
    btnEl.classList.remove("border-[#DCD3BA]", "text-ash");

    // update displayed price
    const priceEl = card.querySelector(".product-price");
    const mrpEl = card.querySelector(".product-mrp");
    if (priceEl) priceEl.innerText = `₹ ${price}`;
    if (mrpEl) mrpEl.innerText = `₹ ${mrp}`;
}

function updateQty(amount, btnEl) {
    const card = btnEl.closest(".product-card");
    const input = card.querySelector(".quantity");
    let val = parseInt(input.value) || 1;
    val += amount;
    if (val < 1) val = 1;
    input.value = val;
}

// Called from the "Add to Cart" button on a product card
function toggleCartState(btnEl) {
    const card = btnEl.closest(".product-card");
    if (!card) return;

    const name = card.querySelector("h3").innerText.trim();
    const img = card.querySelector("img").getAttribute("src");
    const qty = parseInt(card.querySelector(".quantity").value) || 1;

    // fall back to the visible price/size if no size button was clicked yet
    const size = card.dataset.size || card.querySelector(".size-btn.bg-ink")?.innerText.trim() || "100ml";
    const price = parseInt(card.dataset.price) || parseInt(card.querySelector(".product-price").innerText.replace(/[^\d]/g, "")) || 0;
    const mrp = parseInt(card.dataset.mrp) || parseInt(card.querySelector(".product-mrp")?.innerText.replace(/[^\d]/g, "")) || price;

    // unique id per product+size so different sizes stack separately
    const productId = card.dataset.productId || img; // use image path as fallback unique key
    const id = `${productId}__${size}`;

    addToCart({ id, name, size, price, mrp, qty, img });

    // simple visual feedback instead of alert()
    const originalHTML = btnEl.innerHTML;
    btnEl.innerHTML = `<i class="fa-solid fa-check text-xs"></i> Added to Cart`;
    btnEl.disabled = true;
    setTimeout(() => {
        btnEl.innerHTML = originalHTML;
        btnEl.disabled = false;
    }, 1200);
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += product.qty;
    } else {
        cart.push(product);
    }

    saveCart(cart);
}

/* =========================================================
   CART PAGE (cart.html)
   Expects an empty container: <div id="cart-items-list"></div>
   ========================================================= */

let activeCouponRate = 0;
let activeCouponCode = "";

function renderCartPage() {
    const listEl = document.getElementById("cart-items-list");
    if (!listEl) return; // not on the cart page

    const cart = getCart();
    const emptyState = document.getElementById("empty-cart-state");
    const summaryPanel = document.getElementById("summary-panel");
    const cartCountBadgeTop = document.getElementById("cart-count-badge");

    if (cart.length === 0) {
        listEl.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        if (summaryPanel) summaryPanel.classList.add("hidden");
        if (cartCountBadgeTop) cartCountBadgeTop.innerText = "0 Items";
        updateHeaderCartCount();
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (summaryPanel) summaryPanel.classList.remove("hidden");

    listEl.innerHTML = cart.map(item => `
        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#ECE4CE] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition hover:shadow-md" data-cart-id="${item.id}">
            <div class="flex gap-4 items-center w-full sm:w-auto">
                <div class="bg-white rounded-xl w-24 h-24 flex-shrink-0 flex items-center justify-center border border-[#E7DFC7] overflow-hidden">
                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
            </div>
                <div>
                    <h3 class="font-serif font-semibold text-ink text-base">${item.name}</h3>
                    <p class="text-xs text-ash mt-1">
                        <span class="font-medium">Size:</span> <span class="bg-sage-light text-sage font-semibold px-2 py-0.5 rounded">${item.size}</span>
                    </p>
                    <p class="text-xs text-sage font-semibold mt-1.5"><i class="fa-solid fa-check me-1"></i>In Stock</p>
                </div>
            </div>

            <div class="flex sm:flex-row flex-row-reverse sm:items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#ECE4CE]">
                <div class="text-right">
                    <span class="font-serif font-semibold text-ink text-lg block">₹ ${item.price * item.qty}</span>
                    <span class="text-xs text-ash block">₹ ${item.price} / unit</span>
                </div>

                <div class="flex items-center border border-[#DCD3BA] rounded-lg overflow-hidden bg-[#FAF7EE] h-9">
                    <button onclick="changeCartQty('${item.id}', -1)" class="w-8 h-full bg-white text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center text-sm">−</button>
                    <input type="number" value="${item.qty}" min="1" readonly class="w-10 h-full bg-white text-center font-semibold text-ink text-xs focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                    <button onclick="changeCartQty('${item.id}', 1)" class="w-8 h-full bg-white text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center text-sm">+</button>
                </div>

                <button onclick="removeFromCart('${item.id}')" class="text-ash hover:text-clay transition p-2 rounded-lg hover:bg-clay/10" title="Remove item">
                    <i class="fa-regular fa-trash-can text-lg"></i>
                </button>
            </div>
        </div>
    `).join("");

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountBadgeTop) cartCountBadgeTop.innerText = `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`;

    recalculateBill();
    updateHeaderCartCount();
}

function changeCartQty(id, amount) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += amount;
    if (item.qty < 1) {
        removeFromCart(id);
        return;
    }
    saveCart(cart);
    renderCartPage();
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
}

function recalculateBill() {
    const cart = getCart();
    const billSubtotalEl = document.getElementById("bill-subtotal");
    const billDiscountEl = document.getElementById("bill-discount");
    const discountRow = document.getElementById("discount-row");
    const billDeliveryEl = document.getElementById("bill-delivery");
    const billTotalEl = document.getElementById("bill-total");
    const shippingAlert = document.getElementById("shipping-alert");
    const shippingNeededEl = document.getElementById("shipping-needed");
    const appliedCouponName = document.getElementById("applied-coupon-name");

    if (!billSubtotalEl) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    billSubtotalEl.innerText = `₹ ${subtotal}`;

    // discount
    let discount = 0;
    if (activeCouponRate > 0) {
        discount = Math.round(subtotal * activeCouponRate);
        billDiscountEl.innerText = discount;
        appliedCouponName.innerText = activeCouponCode;
        discountRow.classList.remove("hidden");
    } else {
        discountRow.classList.add("hidden");
    }

    // shipping
    let deliveryFee = DELIVERY_FEE;
    if (subtotal >= FREE_SHIPPING_LIMIT) {
        deliveryFee = 0;
        billDeliveryEl.innerHTML = `<span class="text-emerald-600 font-semibold">FREE</span> <span class="line-through text-gray-400 text-xs">₹ ${DELIVERY_FEE}</span>`;
        shippingAlert.classList.add("hidden");
    } else {
        billDeliveryEl.innerText = `₹ ${deliveryFee}`;
        shippingAlert.classList.remove("hidden");
        shippingNeededEl.innerText = `₹ ${FREE_SHIPPING_LIMIT - subtotal}`;
    }

    billTotalEl.innerText = `₹ ${subtotal - discount + deliveryFee}`;
}

function autoFillCoupon(code) {
    const couponInput = document.getElementById("coupon-input");
    couponInput.value = code;
    applyCoupon();
}

function applyCoupon() {
    const couponInput = document.getElementById("coupon-input");
    const couponMessage = document.getElementById("coupon-message");
    const typedCode = couponInput.value.trim().toUpperCase();

    couponMessage.classList.remove("hidden", "text-emerald-600", "text-red-600");

    if (typedCode === "GLOW20") {
        activeCouponRate = 0.20;
        activeCouponCode = "GLOW20";
        couponMessage.innerText = "Coupon 'GLOW20' applied successfully! (20% Off)";
        couponMessage.classList.add("text-emerald-600");
    } else {
        activeCouponRate = 0;
        activeCouponCode = "";
        couponMessage.innerText = typedCode === "" ? "Please enter a code." : "Invalid coupon. Try 'GLOW20'.";
        couponMessage.classList.add("text-red-600");
    }
    recalculateBill();
}

/* ---------- run on every page load ---------- */
document.addEventListener("DOMContentLoaded", () => {
    updateHeaderCartCount();
    renderCartPage(); // no-ops automatically on non-cart pages
});