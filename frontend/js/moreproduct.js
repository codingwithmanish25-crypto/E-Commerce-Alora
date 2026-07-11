    // Real-world dynamic item array mapping out prices, discounts, tags, categories & sizes dynamically
    const PRODUCTS_DATABASE = [
        { id: "p1", name: "Glow Ritual | Daily Radiance Cream", category: "skincare", isBestseller: true, rating: 4.5, baseImg: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=400&auto=format&fit=crop&q=60", sizes: [{ml: "100ml", price: 300, mrp: 450}, {ml: "200ml", price: 550, mrp: 799}] },
        { id: "p2", name: "Hydra Burst | Water Surge Gel Cream", category: "skincare", isBestseller: false, rating: 4.8, baseImg: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&auto=format&fit=crop&q=60", sizes: [{ml: "100ml", price: 420, mrp: 600}, {ml: "200ml", price: 799, mrp: 1150}] },
        { id: "p3", name: "Silk Intense | Repair Onion Hair Mask", category: "haircare", isBestseller: true, rating: 3.9, baseImg: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&auto=format&fit=crop&q=60", sizes: [{ml: "150ml", price: 299, mrp: 399}, {ml: "300ml", price: 499, mrp: 699}] },
        { id: "p4", name: "Satin Smooth | Cocoa Butter Body Lotion", category: "bodycare", isBestseller: false, rating: 4.2, baseImg: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=400&auto=format&fit=crop&q=60", sizes: [{ml: "200ml", price: 250, mrp: 350}, {ml: "400ml", price: 450, mrp: 599}] },
        { id: "p5", name: "Advanced Glow | Vitamin C Serum", category: "skincare", isBestseller: true, rating: 4.9, baseImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=60", sizes: [{ml: "30ml", price: 499, mrp: 699}, {ml: "50ml", price: 750, mrp: 999}] },
        { id: "p6", name: "Root Therapy | Tea Tree Anti-Dandruff Oil", category: "haircare", isBestseller: false, rating: 3.5, baseImg: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&auto=format&fit=crop&q=60", sizes: [{ml: "100ml", price: 199, mrp: 299}, {ml: "200ml", price: 349, mrp: 499}] }
    ];

    // Global Dynamic UI State Tracking
    let selectedCategories = [];
    let maxPriceConstraint = 1500;
    let ratingFloorFilter = 0;
    let activeQuickTag = 'all';

    // Initialize App on DOM Complete
    document.addEventListener("DOMContentLoaded", () => {
        renderProductCatalog(PRODUCTS_DATABASE);
        syncCartCounterIcon();
    });

    // Loop array data directly into isolated template component string maps 
    function renderProductCatalog(products) {
        const gridContainer = document.getElementById('product-grid');
        const noProductsPlaceholder = document.getElementById('no-products');
        
        if (products.length === 0) {
            gridContainer.innerHTML = "";
            noProductsPlaceholder.classList.remove('hidden');
            document.getElementById('results-count').innerText = `0 Products Found`;
            return;
        }
        
        noProductsPlaceholder.classList.add('hidden');
        document.getElementById('results-count').innerText = `Showing ${products.length} products`;

        gridContainer.innerHTML = products.map(product => {
            const initialSize = product.sizes[0];
            return `
            <div data-id="${product.id}" class="product-card bg-white rounded-2xl shadow-sm border border-[#ECE4CE] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">

                <div class="border-b border-dashed border-[#E3D9BC] px-4 pt-3 pb-2 flex items-center justify-between">
                    <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-clay">${product.isBestseller ? '<i class="fa-solid fa-fire mr-1"></i>Bestseller' : `Batch GR-${String(product.id).padStart(3, '0')}`}</span>
                    <div class="flex text-gold text-[11px]">
                        ${generateStarsHTML(product.rating)}
                    </div>
                </div>

                <div class="relative bg-sage-light p-4 mx-4 mt-4 rounded-xl flex justify-center h-44 items-center overflow-hidden">
                    <img src="${product.baseImg}" alt="${product.name}" class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105">
                </div>

                <div class="flex-1 flex flex-col justify-between px-4">
                    <div>
                        <h3 class="text-base font-serif font-medium text-ink text-center line-clamp-2 h-11 mt-4 product-name">${product.name}</h3>

                        <div class="flex justify-center items-center my-2 text-xs">
                            <span class="text-ash font-medium">(${product.rating})</span>
                        </div>

                        <div class="flex justify-center gap-2 mt-3 mb-3 size-btn-container">
                            ${product.sizes.map((sz, idx) => `
                                <button onclick="selectSizeConfig('${sz.ml}', ${sz.price}, ${sz.mrp}, this)"
                                        class="size-btn text-xs border ${idx === 0 ? 'border-ink bg-ink text-parchment' : 'border-[#DCD3BA] hover:border-ink text-ash'} px-3.5 py-1.5 rounded-full font-semibold tracking-wide transition">
                                    ${sz.ml}
                                </button>
                            `).join('')}
                        </div>

                        <div class="text-center mb-4">
                            <span class="product-price font-serif font-semibold text-ink text-xl">₹ ${initialSize.price}</span>
                            <span class="product-mrp text-xs line-through text-ash ml-2">₹ ${initialSize.mrp}</span>
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center border border-[#DCD3BA] w-full rounded-lg overflow-hidden bg-white qty-container">
                            <button onclick="adjustQuantityValue(-1, this)" class="w-11 h-10 bg-[#FAF7EE] text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center select-none border-r border-[#DCD3BA]">−</button>
                            <input type="number" class="quantity flex-1 h-10 text-center font-semibold text-ink focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value="1" min="1" readonly>
                            <button onclick="adjustQuantityValue(1, this)" class="w-11 h-10 bg-[#FAF7EE] text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center select-none border-l border-[#DCD3BA]">+</button>
                        </div>
                    </div>
                </div>

                <button onclick="commitProductToCart('${product.id}', this)" class="w-full bg-clay hover:bg-clay-dark text-white py-3 font-semibold text-xs tracking-[0.15em] uppercase transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-cart-shopping text-xs"></i> Add to Cart
                </button>
            </div>`;
        }).join('');
    }

    // Star UI Generator Utility Function
    function generateStarsHTML(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                html += `<i class="fa-solid fa-star"></i>`;
            } else if (i - 0.5 <= rating) {
                html += `<i class="fa-solid fa-star-half-stroke"></i>`;
            } else {
                html += `<i class="fa-regular fa-star text-gray-300"></i>`;
            }
        }
        return html;
    }

    // SCOPED COMPONENT 1: Local Size Configuration Switch Engine
    function selectSizeConfig(sizeLabel, exactPrice, exactMrp, element) {
        const currentCard = element.closest('.product-card');
        if (!currentCard) return;

        // Target price parameters locally within this DOM branch tree node boundaries only
        currentCard.querySelector('.product-price').innerText = `₹ ${exactPrice}`;
        currentCard.querySelector('.product-mrp').innerText = `₹ ${exactMrp}`;

        // Clear configuration properties inside targeted context node elements only
        currentCard.querySelectorAll('.size-btn').forEach(btn => {
            btn.className = "size-btn text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 text-gray-600 font-medium transition";
        });

        // Isolate active styling assignment to selection node parameters only
        element.className = "size-btn text-xs border border-[#0f2c3d] px-3 py-1 rounded bg-[#0f2c3d] text-white font-medium transition shadow-xs";
    }

    // SCOPED COMPONENT 2: Quantities Adjuster Node Processor Function Engine 
    function adjustQuantityValue(change, element) {
        const parentQtyWrapper = element.closest('.qty-container');
        const targetInput = parentQtyWrapper.querySelector('.quantity');
        
        let currentQuantityValue = parseInt(targetInput.value) || 1;
        currentQuantityValue += change;
        
        if (currentQuantityValue < 1) currentQuantityValue = 1;
        targetInput.value = currentQuantityValue;
    }

    // STREAMING FILTERS ENGINE: Combines and filters state profiles systematically
    function filterProducts() {
        // Read Collection Checkboxes
        const checkboxes = document.querySelectorAll('input[name="category"]:checked');
        selectedCategories = Array.from(checkboxes).map(cb => cb.value);

        // Read Price Slider Constraint Input Values
        maxPriceConstraint = parseInt(document.getElementById('price-range').value);

        // Cascade Pipeline Filtering Process Operations Loops
        let results = PRODUCTS_DATABASE.filter(item => {
            // Match Category Array Matches
            if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false;
            
            // Match Customer Ratings Baseline Minimum Threshold Filters
            if (item.rating < ratingFloorFilter) return false;

            // Match Quick Selection Navigation Bar Action Badges Configurations Filters
            if (activeQuickTag === 'bestseller' && !item.isBestseller) return false;

            // Read matching dynamic scoped selection node instances data matching current config active ranges
            const activeCardContextValuePrice = item.sizes[0].price; // Evaluates low base variations boundaries config settings
            if (activeCardContextValuePrice > maxPriceConstraint) return false;

            return true;
        });

        // Process Sorting Options
        const sortSelection = document.getElementById('sort-filter').value;
        if (sortSelection === 'price-low-high') {
            results.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
        } else if (sortSelection === 'price-high-low') {
            results.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
        } else if (sortSelection === 'rating-high-low') {
            results.sort((a, b) => b.rating - a.rating);
        }

        // Stream parsed processing mutations downstream directly back to the active DOM Engine rendering pipeline mapping
        renderProductCatalog(results);
    }

    // UI Label Tracker Event Bindings Updates Handler Function
    function updatePriceLabel(value) {
        document.getElementById('price-max-label').innerText = `₹${value}`;
    }

    // Set Rating Filter Level state profile configuration controls matching conditions mapping keys
    function setRatingFilter(minStars) {
        ratingFloorFilter = minStars;
        
        // Toggle highlight visual active state profile styles metrics indicators loops
        document.querySelectorAll('.rating-filter-btn').forEach((btn, index) => {
            if ((minStars === 4 && index === 0) || (minStars === 3 && index === 1)) {
                btn.className = "rating-filter-btn flex items-center text-sm text-orange-600 font-bold w-full text-left py-0.5";
            } else {
                btn.className = "rating-filter-btn flex items-center text-sm text-gray-600 hover:text-orange-500 w-full text-left py-0.5";
            }
        });

        filterProducts();
    }

    // Upper Header Quick Filter Engine Interface Control Triggers Map
    function applyQuickFilter(mode) {
        activeQuickTag = mode;
        const bestsellerBadge = document.getElementById('badge-bestseller');
        
        if (mode === 'bestseller') {
            bestsellerBadge.classList.remove('hidden');
        } else {
            bestsellerBadge.classList.add('hidden');
        }
        filterProducts();
    }

    // Global Dynamic Hard Flush Engine State Clear Reset Handler
    function resetFilters() {
        document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
        document.getElementById('price-range').value = 1500;
        document.getElementById('sort-filter').value = 'featured';
        updatePriceLabel(1500);
        ratingFloorFilter = 0;
        activeQuickTag = 'all';
        document.getElementById('badge-bestseller').add('hidden');
        
        document.querySelectorAll('.rating-filter-btn').forEach(btn => {
            btn.className = "rating-filter-btn flex items-center text-sm text-gray-600 hover:text-orange-500 w-full text-left py-0.5";
        });

        filterProducts();
    }

    // SHOPPING CART STATE LOGIC SYSTEM MACHINE ENGINE
    function commitProductToCart(productId, actionBtnElement) {
        const cardElement = actionBtnElement.closest('.product-card');
        
        // Find current dynamic inner state active variant configuration data variables details inside specific item branch context element node fields
        const activeSelectedSizeBtn = cardElement.querySelector('.size-btn-container .bg-\\[\\#0f2c3d\\]');
        const targetActiveConfiguredSizeText = activeSelectedSizeBtn ? activeSelectedSizeBtn.innerText.trim() : "Default Size";
        
        const selectedRawPriceText = cardElement.querySelector('.product-price').innerText;
        const parsedCleanNumericPriceVal = parseInt(selectedRawPriceText.replace('₹', '').trim()) || 0;
        
        const currentSelectedQuantityMetricVal = parseInt(cardElement.querySelector('.quantity').value) || 1;
        const targetProductDisplayNameText = cardElement.querySelector('.product-name').innerText;

        // Commit structured state data elements variables models directly inside unified localStorage schema configurations arrays lists properties mapping systems keys
        let localShoppingSessionCartArrayStore = JSON.parse(localStorage.getItem('glowRitualCartData')) || [];
        
        // Match structural configurations item objects inside store map models matrix items checks definitions mappings details keys entries definitions matching conditions keys definitions
        const compositeCartUniqueIdKeyString = `${productId}_${targetActiveConfiguredSizeText}`;
        let matchingProductCartObjectInstance = localShoppingSessionCartArrayStore.find(cartItem => cartItem.uniqueCartItemKeyId === compositeCartUniqueIdKeyString);

        if (matchingProductCartObjectInstance) {
            matchingProductCartObjectInstance.qtyCountOrderMetric += currentSelectedQuantityMetricVal;
        } else {
            localShoppingSessionCartArrayStore.push({
                uniqueCartItemKeyId: compositeCartUniqueIdKeyString,
                productId: productId,
                productName: targetProductDisplayNameText,
                activeSelectedSizeConfig: targetActiveConfiguredSizeText,
                unitPriceItemConfig: parsedCleanNumericPriceVal,
                qtyCountOrderMetric: currentSelectedQuantityMetricVal
            });
        }

        // Save state array
        localStorage.setItem('glowRitualCartData', JSON.stringify(localShoppingSessionCartArrayStore));
        
        // Refresh counter components
        syncCartCounterIcon();

        // Perform responsive interface interaction transition notifications mappings elements settings values feedback alerts properties indicators
        const backupOriginalActionBtnInnerHtmlMarkup = actionBtnElement.innerHTML;
        actionBtnElement.innerHTML = `<i class="fa-solid fa-circle-check text-xs"></i> Item Added!`;
        actionBtnElement.classList.replace('bg-[#0f2c3d]', 'bg-green-600');

        setTimeout(() => {
            actionBtnElement.innerHTML = backupOriginalActionBtnInnerHtmlMarkup;
            actionBtnElement.classList.replace('bg-green-600', 'bg-[#0f2c3d]');
            cardElement.querySelector('.quantity').value = 1; // reset local quantity input value display fields counters back down to default 1 metric indexes settings profile maps indices variables units parameter checks keys definitions details profiles map parameters checks options maps
        }, 1200);
    }

    // Syncs local storage tracking array metrics variables items metrics loops directly back into top Header navbar counter element markers
    function syncCartCounterIcon() {
        const countDisplayTargetNode = document.getElementById('cart-count');
        if (!countDisplayTargetNode) return;

        const cartCollection = JSON.parse(localStorage.getItem('glowRitualCartData')) || [];
        const netCombinedItemQuantitiesSum = cartCollection.reduce((accumulatorTotal, currentCartItemObj) => accumulatorTotal + currentCartItemObj.qtyCountOrderMetric, 0);
        
        countDisplayTargetNode.innerText = netCombinedItemQuantitiesSum;
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












// Loop array data directly into isolated template component string maps 
function renderProductCatalog(products) {
    const gridContainer = document.getElementById('product-grid');
    const noProductsPlaceholder = document.getElementById('no-products');
    
    if (products.length === 0) {
        gridContainer.innerHTML = "";
        noProductsPlaceholder.classList.remove('hidden');
        document.getElementById('results-count').innerText = `0 Products Found`;
        return;
    }
    
    noProductsPlaceholder.classList.add('hidden');
    document.getElementById('results-count').innerText = `Showing ${products.length} products`;

    gridContainer.innerHTML = products.map(product => {
        const initialSize = product.sizes[0];
        return `
        <div data-id="${product.id}" class="relative w-full h-[460px] flex-shrink-0 product-card bg-white rounded-2xl shadow-sm border border-[#ECE4CE] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate__animated animate__fadeInUp overflow-hidden">
            
            <span class="absolute top-3 left-3 z-10 text-[9px] font-bold tracking-wider w-9 h-9 ${product.isBestseller ? 'bg-orange-600' : 'bg-black'} uppercase text-white rounded-full flex items-center justify-center shadow-md">
                ${product.isBestseller ? 'Hot' : 'New'}
            </span>
          
            <div class="mx-4 mt-4 rounded-xl flex justify-center h-[180px] items-center overflow-hidden relative bg-sage-light">
                <a href="./product.html?id=${product.id}" class="block w-full h-[180px] flex items-center justify-center">
                    <img src="${product.baseImg}" alt="${product.name}" class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110">
                </a>
            </div>

            <div class="px-4 flex-1 flex flex-col justify-center">
                <h3 class="text-base font-serif font-medium text-ink text-center leading-snug capitalize line-clamp-1 product-name">${product.name}</h3>
                <p class="text-xs text-ash text-center font-serif mt-1 px-2 line-clamp-2 min-h-[2rem]">
                    Premium product tailored for your personalized daily self-care ritual.
                </p>

                <div class="flex items-center justify-center gap-3 mt-3 flex-wrap">
                    <div class="flex gap-1.5 items-center size-btn-container">
                        ${product.sizes.map((sz, idx) => `
                            <button onclick="changeCardSize('${sz.ml}', ${sz.price}, ${sz.mrp}, this)" 
                                    class="size-btn text-xs px-2.5 py-1 rounded-full border ${idx === 0 ? 'border-ink bg-ink text-parchment' : 'border-[#DCD3BA] text-ash hover:border-ink'} font-medium transition">
                                ${sz.ml}
                            </button>
                        `).join('')}
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="product-price font-sans font-semibold text-ink text-lg">₹${initialSize.price}</span>
                        <span class="product-mrp text-xs line-through text-ash opacity-70">₹${initialSize.mrp}</span>
                    </div>
                </div>
            </div>

            <div class="px-4 mb-3">
                <p class="text-[10px] font-bold text-ash uppercase tracking-[0.2em] mb-1 text-center">Quantity</p>
                <div class="flex text-gold text-[11px] justify-center items-center gap-1 mb-2">
                    <span class="text-black text-xs font-medium">(${product.rating})</span>
                    <div class="flex text-[#D4AF37] gap-0.5">
                        ${generateStarsHTML(product.rating)}
                    </div>
                </div>

                <div class="flex items-center border border-[#DCD3BA] w-full rounded-lg overflow-hidden bg-white shadow-sm qty-container">
                    <button onclick="updateQty(-1, this)" class="w-11 h-8 bg-[#FAF7EE] text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center select-none border-r border-[#DCD3BA]">−</button>
                    <input type="number" class="quantity flex-1 h-8 text-center font-semibold text-ink focus:outline-none text-sm min-w-0 bg-transparent" value="1" min="1" readonly>
                    <button onclick="updateQty(1, this)" class="w-11 h-8 bg-[#FAF7EE] text-ink hover:bg-[#F1EBD7] font-bold transition flex items-center justify-center select-none border-l border-[#DCD3BA]">+</button>
                </div>
            </div>

            <button id="cart-toggle-btn" onclick="toggleCartState('${product.id}', this)" class="w-full bg-[#A0522D] hover:bg-[#8B4513] text-white py-3.5 font-semibold text-xs tracking-[0.15em] uppercase transition flex items-center justify-center gap-2 mt-auto">
                <i class="fa-solid fa-cart-shopping text-xs"></i> Add to Cart
            </button>
        </div>`;
    }).join('');
}


// 1. New Size Configurations Switcher Engine
function changeCardSize(sizeLabel, exactPrice, exactMrp, element) {
    const currentCard = element.closest('.product-card');
    if (!currentCard) return;

    // Prices Update
    currentCard.querySelector('.product-price').innerText = `₹${exactPrice}`;
    currentCard.querySelector('.product-mrp').innerText = `₹${exactMrp}`;

    // Reset Styles on all size buttons inside this card
    currentCard.querySelectorAll('.size-btn').forEach(btn => {
        btn.className = "size-btn text-xs px-2.5 py-1 rounded-full border border-[#DCD3BA] text-ash hover:border-ink transition";
    });

    // Apply Active Styles
    element.className = "size-btn text-xs px-2.5 py-1 rounded-full border border-ink bg-ink text-parchment font-medium transition";
}

// 2. New Quantity Selector Modifier Engine
function updateQty(change, element) {
    const parentQtyWrapper = element.closest('.qty-container');
    const targetInput = parentQtyWrapper.querySelector('.quantity');
    
    let currentQuantityValue = parseInt(targetInput.value) || 1;
    currentQuantityValue += change;
    
    if (currentQuantityValue < 1) currentQuantityValue = 1;
    targetInput.value = currentQuantityValue;
}

// 3. New Cart Handler Bridge Connection
function toggleCartState(productId, actionBtnElement) {
    // Purane function 'commitProductToCart' ko direct fire karega bina structure tode
    commitProductToCart(productId, actionBtnElement);
}