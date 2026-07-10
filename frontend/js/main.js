




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
    // Check if the product is already marked as added
    const isAlreadyInCart = button.getAttribute('data-in-cart') === 'true';

    if (!isAlreadyInCart) {
        // Change UI to "In Cart" Success State
        button.setAttribute('data-in-cart', 'true');
        button.innerHTML = `<i class="fa-solid fa-circle-check text-xs"></i> In Cart`;
        
        // Optional: Swap background coloring to alert successful interaction
        button.className = "w-full bg-emerald-600 text-white py-2.5 rounded font-medium text-sm tracking-wide uppercase shadow hover:bg-emerald-700 transition flex items-center justify-center gap-2";
    } else {
        // Revert state back to standard "Add to Cart"
        button.setAttribute('data-in-cart', 'false');
        button.innerHTML = `<i class="fa-solid fa-cart-shopping text-xs"></i> Add to Cart`;
        
        // Revert background color back to theme matching #0f2c3d
        button.className = "w-full bg-[#0f2c3d] text-white py-2.5 rounded font-medium text-sm tracking-wide uppercase shadow hover:bg-opacity-90 transition flex items-center justify-center gap-2";
    }
}


// ==============Add to Cart +==============================


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

document.addEventListener("DOMContentLoaded",()=>{
    const track = document.getElementById("slider-track");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const slides = track.children;
    const totalSlides = slides.length;
    
    let currentIndex = 0;
    const updateSlider = ()=>{
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener("click",()=>{
        if(currentIndex <totalSlides-1){
            currentIndex++;
        }else{
            currentIndex=0;
        }
        updateSlider()
    })

    prevBtn.addEventListener("click",()=>{
        if(currentIndex > 0){
            currentIndex--;
        }else{
            currentIndex = totalSlides-1
        }
        updateSlider()
    })

    setInterval(()=>{
        nextBtn.click()
    },5000)
})



