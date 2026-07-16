import BASE_URL from "./config.js";

document.addEventListener("partialsLoaded", () => {

    // ---------- Search box open/close ----------
    const searchOpenBtn = document.getElementById('search-open-btn');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');

    if (searchOpenBtn && searchContainer && searchInput) {
        searchOpenBtn.addEventListener('click', () => {
            searchContainer.classList.add('open');
            searchInput.focus();
        });
    }
    if (searchCloseBtn && searchContainer) {
        searchCloseBtn.addEventListener('click', () => {
            searchContainer.classList.remove('open');
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer) {
            searchContainer.classList.remove('open');
        }
    });

    // ---------- Mobile menu ----------
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
        const menuIcon = menuBtn.querySelector("i");
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            if (menuIcon) {
                if (mobileMenu.classList.contains("hidden")) {
                    menuIcon.classList.replace("fa-xmark", "fa-bars");
                } else {
                    menuIcon.classList.replace("fa-bars", "fa-xmark");
                }
            }
        });
    }

    // Agar future me mobile-dropdown-btn add karo navbar me, to bhi
    // ye guard crash nahi hone dega:
    const mobileDropdownBtn = document.getElementById("mobile-dropdown-btn");
    const mobileDropdownMenu = document.getElementById("mobile-dropdown-menu");
    if (mobileDropdownBtn && mobileDropdownMenu) {
        const dropdownIcon = mobileDropdownBtn.querySelector("i");
        mobileDropdownBtn.addEventListener("click", () => {
            mobileDropdownMenu.classList.toggle("hidden");
            if (dropdownIcon) dropdownIcon.classList.toggle("rotate-180");
        });
    }

    // ---------- Cart badge (navbar + footer dono ke baad sahi rahega) ----------
    updateHeaderCartCount();
});


/* ============================================================
   PAGE-SPECIFIC SCRIPTS (navbar/footer par depend NAHI karte)
   Ye sab normal DOMContentLoaded pe hi chalenge, independent
   blocks me — taaki ek feature fail ho to baaki na tootay.
   ============================================================ */

// ---------- Discount popup ----------
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById('discountPopup');
    const popupBox = document.getElementById('popupBox');
    const closePopupBtn = document.getElementById('closePopup');
    const claimBtn = document.getElementById('claimBtn');

    if (!popup || !popupBox) return; // is page par popup hi nahi hai

    setTimeout(() => {
        popup.classList.remove('opacity-0', 'pointer-events-none');
        popupBox.classList.remove('scale-95');
        popup.classList.add('opacity-100', 'pointer-events-auto');
        popupBox.classList.add('scale-100');
    }, 600);

    function hidePopup() {
        popup.classList.remove('opacity-100', 'pointer-events-auto');
        popupBox.classList.remove('scale-100');
        popup.classList.add('opacity-0', 'pointer-events-none');
        popupBox.classList.add('scale-95');
    }

    if (closePopupBtn) closePopupBtn.addEventListener('click', hidePopup);
    if (claimBtn) claimBtn.addEventListener('click', hidePopup);

    popup.addEventListener('click', (e) => {
        if (e.target === popup) hidePopup();
    });
});

// ---------- Tree counter (green initiative) ----------
document.addEventListener("DOMContentLoaded", () => {
    const counterElement = document.getElementById("tree-counter");
    const sectionElement = document.getElementById("green-initiative-section");
    if (!counterElement || !sectionElement) return;

    const targetCount = 1093966;
    const duration = 2000;
    let animationFrameId = null;

    function formatNumber(num) {
        return num.toLocaleString('en-IN');
    }

    function startCounting() {
        let startTime = null;

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            const progressPercentage = Math.min(progress / duration, 1);
            const easeOutQuad = progressPercentage * (2 - progressPercentage);
            const currentCount = Math.floor(easeOutQuad * targetCount);
            counterElement.innerText = formatNumber(currentCount) + "+";

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                counterElement.innerText = formatNumber(targetCount) + "+";
                counterElement.classList.add("scale-110", "text-white");
                setTimeout(() => {
                    counterElement.classList.remove("scale-110", "text-white");
                }, 300);
            }
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionElement.classList.remove("opacity-0", "translate-y-10");
                sectionElement.classList.add("opacity-100", "translate-y-0");
                cancelAnimationFrame(animationFrameId);
                setTimeout(() => startCounting(), 300);
            } else {
                sectionElement.classList.remove("opacity-100", "translate-y-0");
                sectionElement.classList.add("opacity-0", "translate-y-10");
                cancelAnimationFrame(animationFrameId);
                counterElement.innerText = "0+";
            }
        });
    }, { threshold: 0.2 });

    observer.observe(sectionElement);
});

// ---------- Testimonial slider ----------
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("testimonialContainer");
    if (!container) return;

    const slides = container.children;
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dots = document.querySelectorAll(".dot");
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider() {
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.remove("bg-gray-300");
                dot.classList.add("bg-gray-800", "scale-110");
            } else {
                dot.classList.remove("bg-gray-800", "scale-110");
                dot.classList.add("bg-gray-300");
            }
        });
    }

    if (nextBtn) nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });
    if (prevBtn) prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateSlider();
        });
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }, 4000);

    updateSlider();
});

// ---------- Hero banner slider ----------
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("slider-track");
    if (!track) return;

    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const slides = track.children;
    const totalSlides = slides.length;
    const sliderContainer = track.parentElement;
    let currentIndex = 0;
    let autoInterval;

    const updateSlider = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    if (nextBtn) nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        updateSlider();
    });
    if (prevBtn) prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        updateSlider();
    });

    const startAutoSlide = () => {
        autoInterval = setInterval(() => { if (nextBtn) nextBtn.click(); }, 5000);
    };
    const stopAutoSlide = () => clearInterval(autoInterval);

    sliderContainer.addEventListener("mouseenter", stopAutoSlide);
    sliderContainer.addEventListener("mouseleave", startAutoSlide);
    startAutoSlide();
});

// ---------- Product size / qty toggle (used on product cards) ----------
function toggleCartState(button) {
    const isAlreadyInCart = button.getAttribute('data-in-cart') === 'true';
    const card = button.closest('.product-card');
    if (!card) return;

    if (!isAlreadyInCart) {
        const nameEl = card.querySelector('h3');
        const priceEl = card.querySelector('.product-price');
        const imgEl = card.querySelector('img');
        const qtyInput = card.querySelector('.quantity');

        const name = nameEl ? nameEl.innerText.trim() : '';
        const priceText = priceEl ? priceEl.innerText.replace(/[^\d.]/g, '') : '0';
        const price = parseFloat(priceText) || 0;
        const img = imgEl ? imgEl.src : '';
        const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
        const id = name;

        addToCart(id, name, price, img, qty);

        button.setAttribute('data-in-cart', 'true');
        button.innerHTML = `<i class="fa-solid fa-circle-check text-xs"></i> In Cart`;
        button.className = "w-full bg-emerald-600 text-white py-2.5 rounded font-medium text-sm tracking-wide uppercase shadow hover:bg-emerald-700 transition flex items-center justify-center gap-2 mt-auto";
    } else {
        button.setAttribute('data-in-cart', 'false');
        button.innerHTML = `<i class="fa-solid fa-cart-shopping text-xs"></i> Add to Cart`;
        button.className = "w-full bg-[#A0522D] hover:bg-[#8B4513] text-white py-3.5 font-semibold text-xs tracking-[0.15em] uppercase transition flex items-center justify-center gap-2 mt-auto";
    }
}

function addToCart(id, name, price, img, qty = 1) {
    let cart = JSON.parse(localStorage.getItem('glowCart')) || [];
    let existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.qty += qty;
    } else {
        cart.push({ id, name, price, img, qty });
    }

    localStorage.setItem('glowCart', JSON.stringify(cart));
    updateHeaderCartCount();
}

function updateHeaderCartCount() {
    let cart = JSON.parse(localStorage.getItem('glowCart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('global-cart-badge');
    if (badge) badge.innerText = totalItems;
}

function selectSize(size, price, mrp, element) {
    const currentCard = element.closest('.product-card');
    if (!currentCard) return;

    const priceElement = currentCard.querySelector('.product-price');
    const mrpElement = currentCard.querySelector('.product-mrp');

    if (priceElement) priceElement.innerText = `₹ ${price}`;
    if (mrpElement) mrpElement.innerText = `₹ ${mrp}`;

    currentCard.querySelectorAll('.size-btn').forEach(btn => {
        btn.className = "size-btn text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 text-gray-600 font-medium transition";
    });

    element.className = "size-btn text-xs border border-[#0f2c3d] px-3 py-1 rounded bg-[#0f2c3d] text-white font-medium transition shadow-sm";
}

function updateQty(change, element) {
    const currentCard = element.closest('.product-card');
    if (!currentCard) return;

    const qtyInput = currentCard.querySelector('.quantity');
    if (qtyInput) {
        let currentVal = parseInt(qtyInput.value);
        if (isNaN(currentVal)) currentVal = 1;
        currentVal += change;
        if (currentVal < 1) currentVal = 1;
        qtyInput.value = currentVal;
    }
}

// Fallback: agar navbar bina include ke bhi kabhi page par directly ho
// (partials system use na ho), tab bhi cart badge sahi dikhe.
window.addEventListener('load', updateHeaderCartCount);






// ============== backend code===================================

let currentScrollAmount = 0;

// 1. Backend se products fetch karke slider me render karne ka function
async function loadSliderProducts() {
    const wrapper = document.getElementById('productSliderWrapper');
    if(!wrapper) return;

    try {
        const response = await fetch(`${BASE_URL}/api/product/all`);
        const products = await response.json();
        
        if (!response.ok) throw new Error(products.error || "Data fetch nahi ho paya");

        // Sirf top 5 products lene ke liye slice lagaya
        const top5Products = products.slice(0, 5);

        if (top5Products.length === 0) {
            wrapper.innerHTML = `<p class="text-ash px-6 py-4 font-medium text-center w-full">No active products found.</p>`;
            return;
        }

        // HTML String Generation
        wrapper.innerHTML = top5Products.map((product, index) => {
            const fullImgUrl = `${BASE_URL}${product.imagepath}`;
            
            // Star rating ka setup (Max 5 stars)
            const ratingCount = Math.round(product.rating || 4);
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                starsHTML += i <= ratingCount 
                    ? `<i class="fa-solid fa-star"></i>` 
                    : `<i class="fa-regular fa-star text-[#D9D2BC]"></i>`;
            }

            // Variants ke dynamic size buttons setup karein
            let sizeButtonsHTML = '';
            let initialPrice = 0;
            let initialComparePrice = 0;

            if (product.variants && product.variants.length > 0) {
                // Default ke liye pehla variant select rakhenge
                initialPrice = product.variants[0].price;
                initialComparePrice = product.variants[0].comparePrice || '';

                sizeButtonsHTML = product.variants.map((v, vIndex) => {
                    const isActive = vIndex === 0;
                    const activeClasses = isActive 
                        ? 'bg-ink text-parchment border-ink' 
                        : 'border-[#DCD3BA] text-ash hover:border-ink';

                    return `
                        <button 
                            onclick="changeCardSize('${v.volume}', ${v.price}, ${v.comparePrice || 0}, this)" 
                             class="size-btn text-xs px-2.5 py-1 rounded-full border border-ink bg-ink text-parchment font-medium transition" ${activeClasses}"
                        >
                            ${v.volume}
                        </button>
                    `;
                }).join('');
            }

           return `
<div class="relative w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)] h-[460px] flex-shrink-0 product-card bg-white rounded-2xl shadow-sm border border-[#ECE4CE] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate__animated animate__fadeInUp overflow-hidden">
    
     <span class="absolute top-3 left-3 z-10 text-[9px] font-bold tracking-wider w-9 h-9 bg-black uppercase text-white rounded-full flex items-center justify-center shadow-md">
        New
    </span>
  
        <div class="mx-4 mt-4 rounded-xl flex justify-center h-[180px] items-center overflow-hidden relative">
        <a href="./product.html?id=${product._id}" class="block w-full h-[180px]">
            <img src="${fullImgUrl}" alt="${product.name}"" class="w-full h-full object-contain transition-transform duration-300 hover:scale-110">
        </a>
    </div>

     <div class="px-4 flex-1 flex flex-col justify-center">
        <h3 class="text-base font-robot font-medium text-ink text-center leading-snug capitalize">${product.name}</h3>
        <p class="text-xs text-ash text-center font-robot mt-1 px-2 line-clamp-2 min-h-[2rem]">
              ${product.description || 'No description available'}
        </p>
    
    

        <div class="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <div class="flex gap-1.5 items-center">
                ${sizeButtonsHTML}
            </div>
            <div class="flex items-center gap-1.5">
                <span class="product-price font-serif font-semibold text-ink text-lg">₹${initialPrice}</span>
                <span class="product-mrp font-serif text-xs line-through text-ash opacity-70">${initialComparePrice ? '₹' + initialComparePrice : ''}</span>
            </div>
        </div>
    </div>

    <div class="px-4 mb-3">
        <p class="text-[10px] font-bold text-ash uppercase tracking-[0.2em] mb-1 text-center">Quantity</p>
        <div class="flex text-gold text-[11px] justify-center items-center gap-1 mb-2">
            <span class="text-black text-xs font-medium">(5)</span>
            <div class="flex text-[#D4AF37]">${starsHTML}</div>
        </div>

        <div class="flex items-center border border-[#DCD3BA] w-full rounded-lg overflow-hidden bg-white shadow-sm">
            <button onclick="updateQty(-1, this)" class="w-11 h-8 bg-[#FAF7EE] text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center select-none border-r border-[#DCD3BA]">−</button>
            <input type="number" class="quantity flex-1 h-8 text-center font-semibold text-ink focus:outline-none text-sm min-w-0 bg-transparent" value="1" min="1" readonly>
            <button onclick="updateQty(1, this)" class="w-11 h-8 bg-[#FAF7EE] text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center select-none border-l border-[#DCD3BA]">+</button>
        </div>
    </div>

   <button id="cart-toggle-btn" onclick="handleCartButtonClick(this)" class="w-full bg-[#A0522D] hover:bg-[#8B4513] text-white py-3.5 font-semibold text-xs tracking-[0.15em] uppercase transition flex items-center justify-center gap-2 mt-auto">
    <i class="fa-solid fa-cart-shopping text-xs"></i> Add to Cart
</button>
</div>
`;
        }).join(" ");

    } catch (err) {
        console.error("Slider loading failed:", err);
    }
}

// 2. Card ke andar specific variant button click handle karne ka function
function changeCardSize(volume, price, comparePrice, buttonElement) {
    const card = buttonElement.closest('.product-card');
    
    // Sabhi sibling buttons se active classes hatao aur unhe normal banao
    const buttons = card.querySelectorAll('.size-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-ink', 'text-parchment', 'border-ink');
        btn.classList.add('border-[#DCD3BA]', 'text-ash');
    });

    // Jis button par click kiya hai use select (Active) karo
    buttonElement.classList.add('bg-ink', 'text-parchment', 'border-ink');
    buttonElement.classList.remove('border-[#DCD3BA]', 'text-ash');

    // UI par price aur comparePrice update karo
    card.querySelector('.product-price').innerText = `₹ ${price}`;
    const mrpElement = card.querySelector('.product-mrp');
    if (comparePrice > 0) {
        mrpElement.innerText = `₹ ${comparePrice}`;
        mrpElement.style.display = 'inline';
    } else {
        mrpElement.style.display = 'none';
    }
}

// 3. Slider navigation action trigger logic (Aapka purana function unmodified)
function slideProducts(direction) {
    const wrapper = document.getElementById('productSliderWrapper');
    const firstCard = wrapper.querySelector('.product-card');
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 24; 
    const scrollStep = cardWidth + gap;
    const maxScroll = wrapper.scrollWidth - wrapper.parentElement.offsetWidth;

    if (direction === 'right') {
        currentScrollAmount += scrollStep;
        if (currentScrollAmount > maxScroll) {
            currentScrollAmount = 0; 
        }
    } else if (direction === 'left') {
        currentScrollAmount -= scrollStep;
        if (currentScrollAmount < 0) {
            currentScrollAmount = maxScroll > 0 ? maxScroll : 0; 
        }
    }

    wrapper.style.transform = `translateX(-${currentScrollAmount}px)`;
}

// DOM load hote hi dono functions initiate ho jayein
document.addEventListener('DOMContentLoaded', () => {
    loadSliderProducts();
});