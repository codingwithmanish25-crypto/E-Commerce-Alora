

// Elements ko select karna
const searchOpenBtn = document.getElementById('search-open-btn');
const searchCloseBtn = document.getElementById('search-close-btn');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');

// Search Icon par click karne par box open hoga
searchOpenBtn.addEventListener('click', () => {
    searchContainer.classList.add('open');
    searchInput.focus(); // Box open hote hi cursor input me chala jayega
});

// Close (X) button par click karne par box band hoga
searchCloseBtn.addEventListener('click', () => {
    searchContainer.classList.remove('open');
});

// Agar user 'Escape' key dabaye to bhi search band ho jaye (Optional but good UX)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchContainer.classList.remove('open');
    }
});

// pop design scrpt
const popup = document.getElementById('discountPopup');
        const popupBox = document.getElementById('popupBox');
        const closePopupBtn = document.getElementById('closePopup');
        const claimBtn = document.getElementById('claimBtn');

        // Page load hone ke 600ms baad popup smoothly show hoga
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                // Remove hidden utilities and trigger transitions
                popup.classList.remove('opacity-0', 'pointer-events-none');
                popupBox.classList.remove('scale-95');
                
                popup.classList.add('opacity-100', 'pointer-events-auto');
                popupBox.classList.add('scale-100');
            }, 600);
        });

        // Popup close karne ka reusable function
        function hidePopup() {
            popup.classList.remove('opacity-100', 'pointer-events-auto');
            popupBox.classList.remove('scale-100');
            
            popup.classList.add('opacity-0', 'pointer-events-none');
            popupBox.classList.add('scale-95');
        }

        // Event Listeners
        closePopupBtn.addEventListener('click', hidePopup);
        claimBtn.addEventListener('click', hidePopup); // Aap yahan user ko kisi checkout/coupon page par redirect bhi kar sakte hain

        // Agar user popup box ke bahar click kare toh bhi close ho jaye
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hidePopup();
            }
        });


document.addEventListener("DOMContentLoaded", () => {
    const counterElement = document.getElementById("tree-counter");
    const sectionElement = document.getElementById("green-initiative-section");
    
    const targetCount = 1093966; 
    const duration = 2000; 
    let animationFrameId = null; // Animation ko track aur reset karne ke liye

    function formatNumber(num) {
        return num.toLocaleString('en-IN'); 
    }

    // Number Count Up Animation Logic
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

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // —— JAB SECTION SCREEN PAR AAYE ——
                sectionElement.classList.remove("opacity-0", "translate-y-10");
                sectionElement.classList.add("opacity-100", "translate-y-0");

                // Purani chal rahi animation ko rokkar naye sire se start karenge
                cancelAnimationFrame(animationFrameId); 
                setTimeout(() => {
                    startCounting();
                }, 300);

            } else {
                // —— JAB SECTION SCREEN SE BAHAR CHALA JAYE (RESET) ——
                // Classes wapas purani state me le aao taaki agla scroll fir se animate ho
                sectionElement.classList.remove("opacity-100", "translate-y-0");
                sectionElement.classList.add("opacity-0", "translate-y-10");
                
                // Animation ko roko aur counter ko wapas 0+ kar do
                cancelAnimationFrame(animationFrameId);
                counterElement.innerText = "0+";
            }
        });
    }, {
        threshold: 0.2 // 20% section dikhte hi trigger hoga
    });

    if (sectionElement) {
        observer.observe(sectionElement);
    }
});

    

// ============= End OF THis Section =================================

// ============= Customer review SLider Section===========================
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("testimonialContainer");
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

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
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
// ============= End OF THis Section =================================


function toggleCartState(button) {
    const isAlreadyInCart = button.getAttribute('data-in-cart') === 'true';
    const card = button.closest('.product-card');
    if (!card) return;

    if (!isAlreadyInCart) {
        // Card se product ki info nikaalo
        const name = card.querySelector('h3').innerText.trim();
        const priceText = card.querySelector('.product-price').innerText.replace(/[^\d.]/g, '');
        const price = parseFloat(priceText) || 0;
        const imgEl = card.querySelector('img');
        const img = imgEl ? imgEl.src : '';
        const qtyInput = card.querySelector('.quantity');
        const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
        const id = name; // agar backend id mile to usko use karna behtar hoga

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


// ==============Add to Cart +==============================


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
    if(badge) badge.innerText = totalItems;
}


window.onload = updateHeaderCartCount;

// ============= End OF THis Section =================================




// ================ qutailtiy or size ml button ======================
function selectSize(size, price, mrp, element) {
    
    const currentCard = element.closest('.product-card');
    
    if (!currentCard) return;

    
    const priceElement = currentCard.querySelector('.product-price');
    const mrpElement = currentCard.querySelector('.product-mrp');
    
    if (priceElement) {
        priceElement.innerText = `₹ ${price}`;
    }
    if (mrpElement) {
        mrpElement.innerText = `₹ ${mrp}`;
    }
    
    
    currentCard.querySelectorAll('.size-btn').forEach(btn => {
        btn.className = "size-btn text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 text-gray-600 font-medium transition";
    });
    
    
    element.className = "size-btn text-xs border border-[#0f2c3d] px-3 py-1 rounded bg-[#0f2c3d] text-white font-medium transition shadow-sm";
    
    console.log(`Selected Size: ${size}, Price: ${price}`);
}


function updateQty(change, element) {
    
    const currentCard = element.closest('.product-card');
    
    if (!currentCard) return;

    
    const qtyInput = currentCard.querySelector('.quantity');
    
    if (qtyInput) {
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
}
// ============= End OF THis Section =================================




// =================== Menu button css Work ======================
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


// ==================== preves and next button=============

document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("slider-track");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const slides = track.children;
    const totalSlides = slides.length;
    
    // Main outer container ko select kiya hover detect karne ke liye
    const sliderContainer = track.parentElement; 
    
    let currentIndex = 0;
    let autoInterval; // Interval ko dynamic handle karne ke liye variable

    const updateSlider = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalSlides - 1;
        }
        updateSlider();
    });

    // 1. Slider ko start karne ka function
    const startAutoSlide = () => {
        autoInterval = setInterval(() => {
            nextBtn.click();
        }, 5000);
    };

    // 2. Slider ko stop/pause karne ka function
    const stopAutoSlide = () => {
        clearInterval(autoInterval);
    };

    // --- HOVER FUNCTIONALITY LOGIC ---
    
    // Jab user mouse slider ke upar layega -> Carousel pause ho jayega
    sliderContainer.addEventListener("mouseenter", stopAutoSlide);

    // Jab user mouse slider se hataega -> Carousel fir se 5 sec baad chalne lagega
    sliderContainer.addEventListener("mouseleave", startAutoSlide);

    // Initial load par slider ko start karne ke liye
    startAutoSlide();
});





