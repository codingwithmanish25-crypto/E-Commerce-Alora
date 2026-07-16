import BASE_URL from "./config.js"; // Apne folder structure ke hisab se path sahi kar lein (e.g., "../config.js")

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});

async function loadProductDetails() {
    // 1. URL se Product ID extract karna (?id=YOUR_PRODUCT_ID)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error("Product ID URL mein nahi mili. User ko index.html par bhej rahe hain...");
        // Fallback: Agar ID na ho to user ko home page par bhej sakte hain
        // window.location.href = "./index.html";
        return;
    }

    try {
        // 2. Backend API Call
        const response = await fetch(`${BASE_URL}/api/product/${productId}`);
        const product = await response.json();

        if (!response.ok) {
            throw new Error(product.error || "Product fetch nahi ho paya");
        }

        console.log("Fetched Product Data:", product); // Testing ke liye console me data check karein

        // 3. UI Elements ko Update karna

        // Image Update
        const mainImg = document.getElementById('main-product-image');
        if (mainImg) {
            if (product.imagepath) {
                mainImg.src = `${BASE_URL}${product.imagepath}`;
                mainImg.alt = product.name || "Product Image";
            } else {
                mainImg.src = "./static/placeholder.png"; // Fallback image if no path
            }
        }

        // Title
        const titleEl = document.getElementById('product-title');
        if (titleEl) {
            titleEl.innerText = product.name || "No Title Available";
        }

        // Description
        const descEl = document.getElementById('product-desc');
        if (descEl) {
            descEl.innerText = product.description || 'No description available for this product.';
        }

        // Ratings & Stars
        const ratingCount = Math.round(product.rating || 4);
        const starsContainer = document.querySelector('.text-gold.text-sm'); // Apne HTML ke main stars container ko select karein
        if (starsContainer) {
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                starsHTML += i <= ratingCount 
                    ? `<i class="fa-solid fa-star"></i>` 
                    : `<i class="fa-regular fa-star text-[#D9D2BC]"></i>`;
            }
            starsContainer.innerHTML = starsHTML;
        }

        // 4. Variants & Price Setup
        const priceEl = document.getElementById('product-price');
        const mrpEl = document.getElementById('product-mrp');
        const variantsContainer = document.getElementById('variants-container');

        if (product.variants && product.variants.length > 0) {
            // Default select: Pehla variant
            const defaultVariant = product.variants[0];
            if (priceEl) priceEl.innerText = `₹ ${defaultVariant.price}`;
            if (mrpEl) {
                mrpEl.innerText = defaultVariant.comparePrice ? `₹ ${defaultVariant.comparePrice}` : '';
            }

            // Generate Size Buttons
            if (variantsContainer) {
                variantsContainer.innerHTML = product.variants.map((v, index) => {
                    const isActive = index === 0;
                    const activeClasses = isActive 
                        ? 'border-2 border-ink bg-ink text-parchment font-semibold' 
                        : 'border border-[#DCD3BA] text-ash font-semibold hover:border-ink';

                    return `
                        <button 
                            onclick="selectSize('${v.volume}', ${v.price}, ${v.comparePrice || 0}, this)" 
                            class="size-btn text-sm px-4 py-2 rounded-full transition ${activeClasses}"
                        >
                            ${v.volume}
                        </button>
                    `;
                }).join('');
            }
        } else {
            // Agar database me schema dynamic nahi hai ya simple product hai:
            if (priceEl) priceEl.innerText = `₹ ${product.price || 0}`;
            if (mrpEl) mrpEl.innerText = product.comparePrice ? `₹ ${product.comparePrice}` : '';
            if (variantsContainer) variantsContainer.innerHTML = `<p class="text-xs text-ash">No variants available</p>`;
        }

        // 5. Accordion Details (Details & Ingredients)
        const detailsEl = document.getElementById('product-details');
        if (detailsEl) {
            detailsEl.innerText = product.details || "Apply a small amount cleanly over your face and neck every morning.";
        }

        const ingredientsEl = document.getElementById('product-ingredients');
        if (ingredientsEl) {
            ingredientsEl.innerText = product.ingredients || "Natural organic extracts, water, vitamins and essential minerals.";
        }

    } catch (error) {
        console.error("Product details load karne me dikkat aayi:", error);
        // UI me error message show karne ke liye:
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            mainContainer.innerHTML = `
                <div class="max-w-md mx-auto my-20 text-center bg-white p-8 rounded-2xl border border-[#ECE4CE] shadow-sm">
                    <i class="fa-solid fa-circle-exclamation text-clay text-4xl mb-4"></i>
                    <h2 class="text-xl font-semibold text-ink mb-2">Product nahi mil paya</h2>
                    <p class="text-sm text-ash mb-6">Database se product fetch karne me koi error aayi hai ya URL galat hai.</p>
                    <a href="./index.html" class="bg-ink text-parchment px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-ink-light transition inline-block">Home Page Par Jayein</a>
                </div>
            `;
        }
    }
}

// ---------------- GLOBAL FUNCTIONS ----------------

// Size selection logic
window.selectSize = function(volume, price, comparePrice, buttonElement) {
    if (!buttonElement) return;

    // Sabhi active buttons ki class reset karein
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.className = "size-btn text-sm px-4 py-2 rounded-full transition border border-[#DCD3BA] text-ash font-semibold hover:border-ink";
    });

    // Current clicked button par active class lagayein
    buttonElement.className = "size-btn text-sm px-4 py-2 rounded-full transition border-2 border-ink bg-ink text-parchment font-semibold";

    // Prices ko front-end par badlein
    const priceEl = document.getElementById('product-price');
    const mrpEl = document.getElementById('product-mrp');
    
    if (priceEl) priceEl.innerText = `₹ ${price}`;
    if (mrpEl) {
        mrpEl.innerText = comparePrice ? `₹ ${comparePrice}` : '';
    }
}

// Quantity Counter logic
window.updateQty = function(change) {
    const qtyInput = document.getElementById('quantity');
    if (!qtyInput) return;
    
    let currentQty = parseInt(qtyInput.value) || 1;
    currentQty += change;
    
    if (currentQty < 1) currentQty = 1;
    qtyInput.value = currentQty;
}