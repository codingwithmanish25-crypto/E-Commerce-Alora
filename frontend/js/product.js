
// ============= Product HTml page Section==========================
function updateQty(change) {
    
    const qtyInput = document.getElementById('quantity');
    let currentVal = parseInt(qtyInput.value);
    if (isNaN(currentVal)) {
        currentVal = 1;
    }
    
  
    currentVal += change;
    if (currentVal < 1) {
        currentVal = 1;
    }
    qtyInput.value = currentVal;
}

// Handle size switching & adjust price values dynamically
function selectSize(size, price, mrp, element) {
    document.getElementById('product-price').innerText = `₹ ${price}`;
    document.getElementById('product-mrp').innerText = `₹ ${mrp}`;
    
    // Toggle active classes on buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.className = "size-btn text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition";
    });
    element.className = "size-btn text-sm border-2 border-[#0f2c3d] px-4 py-2 rounded-lg bg-[#0f2c3d] text-white font-medium transition shadow-sm";
}

// Image switcher function
function changeImage(src) {
    document.getElementById('main-product-image').src = src;
}


// ============= End OF THis Section =================================



function addToCart(id, name, price, img) {
    let cart = JSON.parse(localStorage.getItem('glowCart')) || [];
    
    
    let existingProduct = cart.find(item => item.id === id);
    
    if (existingProduct) {
        existingProduct.qty += 1;
    } else {
        cart.push({ id, name, price, img, qty: 1 });
    }
    
    localStorage.setItem('glowCart', JSON.stringify(cart));
    updateHeaderCartCount();
    alert(`${name} कार्ट में जोड़ दिया गया है!`);
}


function updateHeaderCartCount() {
    let cart = JSON.parse(localStorage.getItem('glowCart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    

    const badge = document.getElementById('global-cart-badge');
    if(badge) badge.innerText = totalItems;
}


window.onload = updateHeaderCartCount;





function toggleReviewForm() {
    const formBox = document.getElementById('review-form-box');
    formBox.classList.toggle('hidden');
}

function setReviewRating(ratingValue) {
    const stars = document.querySelectorAll('.review-star');
    stars.forEach((star, index) => {
        if (index < ratingValue) {
            star.classList.remove('fa-regular', 'text-gray-300');
            star.classList.add('fa-solid', 'text-yellow-400');
        } else {
            star.classList.remove('fa-solid', 'text-yellow-400');
            star.classList.add('fa-regular', 'text-gray-300');
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = menuBtn.querySelector("i");

    const mobileDropdownBtn = document.getElementById("mobile-dropdown-btn");
    const mobileDropdownMenu = document.getElementById("mobile-dropdown-menu");
    const dropdownIcon = mobileDropdownBtn.querySelector("i");

    // 1. Toggle Mobile Main Menu
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        
        // Icon change script (Bars to X mark)
        if (mobileMenu.classList.contains("hidden")) {
            menuIcon.classList.replace("fa-xmark", "fa-bars");
        } else {
            menuIcon.classList.replace("fa-bars", "fa-xmark");
        }
    });

    // 2. Toggle Mobile Nested Category (Skin & Body) Click
    mobileDropdownBtn.addEventListener("click", () => {
        mobileDropdownMenu.classList.toggle("hidden");
        
        // Rotate chevron arrow on click
        dropdownIcon.classList.toggle("rotate-180");
    });
});

// ==================dyanmic show product page===============



