// Animation and Counter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for fade-in animations
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    var sections = document.querySelectorAll('.categories, .bestSales, .special-dishes, .deals, .choose-us, .news-letter, .labels');
    sections.forEach(function(el) {
        el.classList.add('fade-section');
        observer.observe(el);
    });

    // Animate individual containers when they are created
    animateContainers();

    // Hamburger menu toggle
    var bars = document.querySelector('.bars');
    var mobileNav = document.querySelector('.mobile-nav');
    
    if (bars && mobileNav) {
        bars.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('menu-active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !bars.contains(e.target)) {
                mobileNav.classList.remove('menu-active');
            }
        });
    }
});

// Function to animate containers with staggered delay
function animateContainers() {
    setTimeout(function() {
        // Categories
        var categories = document.querySelectorAll('.single-category-container');
        categories.forEach(function(cat, index) {
            setTimeout(function() {
                cat.classList.add('animate-in');
            }, index * 100);
        });

        // Products
        var products = document.querySelectorAll('.product-container');
        products.forEach(function(prod, index) {
            setTimeout(function() {
                prod.classList.add('animate-in');
            }, index * 100);
        });

        // Dishes
        var dishes = document.querySelectorAll('.dish-container');
        dishes.forEach(function(dish, index) {
            setTimeout(function() {
                dish.classList.add('animate-in');
            }, index * 100);
        });

        // Deals
        var deals = document.querySelectorAll('.deal-container');
        deals.forEach(function(deal, index) {
            setTimeout(function() {
                deal.classList.add('animate-in');
            }, index * 100);
        });

        // Labels
        var labels = document.querySelectorAll('.label');
        labels.forEach(function(label, index) {
            setTimeout(function() {
                label.classList.add('animate-in');
            }, index * 100);
        });
    }, 500);
}

// Number Counter Animation Function
function animateCounter(element, target, duration) {
    var start = 0;
    var end = parseInt(target);
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var progress = currentTime - startTime;
        var percentage = Math.min(progress / duration, 1);
        
        // Easing function
        var easeOutQuart = 1 - Math.pow(1 - percentage, 4);
        var current = Math.floor(easeOutQuart * end);
        
        element.textContent = current;
        
        if (percentage < 1) {
            requestAnimationFrame(animation);
        } else {
            element.textContent = end;
            element.classList.add('pulse-animation');
        }
    }
    
    requestAnimationFrame(animation);
}

// Initialize counter animations when elements come into view
function initCounterAnimations() {
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var counter = entry.target;
                var target = counter.getAttribute('data-target');
                var duration = parseInt(counter.getAttribute('data-duration')) || 2000;
                
                animateCounter(counter, target, duration);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    var counters = document.querySelectorAll('.counter');
    counters.forEach(function(counter) {
        counterObserver.observe(counter);
    });
}

// Call counter animations after DOM is loaded
document.addEventListener('DOMContentLoaded', initCounterAnimations);

const images = [
    { image: './Assets/category_img_1.png', dish_text: "Main Dish", dishes_count: "(86 dishes)" },
    { image: './Assets/category_img_2.png', dish_text: "Breakfast", dishes_count: "(12 breakfast)" },
    { image: './Assets/category_img_3.png', dish_text: "Desert", dishes_count: "(48 desert)" },
    { image: './Assets/category_img_4.png', dish_text: "Browse All", dishes_count: "(255 items)" },
    { image: './Assets/category_img_5.png', dish_text: "BreakFast Food", dishes_count: "(205 items)" },
    { image: './Assets/category_img_1.png', dish_text: "Main Dish", dishes_count: "(86 dishes)" }
];

for (let index = 0; index <= images.length - 1; index++) {
    let categories_container = document.querySelector('.categories-container');
    const div = document.createElement('div');
    div.classList.add('single-category-container');
    categories_container.appendChild(div);

    let image = document.createElement('img');
    image.src = images[index].image;
    image.classList.add('category-image');
    div.appendChild(image);

    let para = document.createElement('p');
    para.innerText = images[index].dish_text;
    div.appendChild(para);

    let para_2 = document.createElement('p');
    para_2.innerText = images[index].dishes_count;
    div.appendChild(para_2);
}

const products_data = [
    { image: './Assets/main_page_product_1.jpg', name: 'All Natural Italian-Style Chicken Meatballs' },
    { image: './Assets/main_page_product_2.jpg', name: 'Angies Boomchickapop Sweet and womnies' },
    { image: './Assets/main_page_product_3.jpg', name: 'Foster Farms Takeout Crispy Classic' },
    { image: './Assets/main_page_product_4.jpg', name: 'Blue Diamond Salted Almonds' }
];

for (let index = 0; index <= products_data.length - 1; index++) {
    let products_container = document.querySelector('.products-container');
    let product_container = document.createElement('div');
    product_container.classList.add('product-container');
    products_container.appendChild(product_container);

    let product_image = document.createElement('img');
    product_image.classList.add('product-image');
    product_image.src = products_data[index].image;
    product_container.appendChild(product_image);

    let span_1 = document.createElement('span');
    span_1.innerText = 'Hodo Foods';
    product_container.appendChild(span_1);

    let product_name = document.createElement('p');
    product_name.innerText = products_data[index].name;
    product_container.appendChild(product_name);

    let star = document.createElement('img');
    star.src = './Assets/star.png';
    star.classList.add('star');
    product_container.appendChild(star);

    let price_div = document.createElement('div');
    price_div.classList.add('price-div');
    product_container.appendChild(price_div);

    let price = document.createElement('span');
    price.classList.add('price');
    price.innerText = '$238.85';
    price_div.appendChild(price);

    let old_price = document.createElement('span');
    old_price.classList.add('old-price');
    old_price.innerText = '$245.8';
    price_div.appendChild(old_price);

    let bar = document.createElement('div');
    bar.classList.add('bar');
    product_container.appendChild(bar);

    let bar_inside = document.createElement('div');
    bar_inside.classList.add('bar-inside');
    bar.appendChild(bar_inside);

    let sold = document.createElement('span');
    sold.classList.add('sold');
    sold.innerText = 'sold: 90/120';
    product_container.appendChild(sold);

    let cart_button = document.createElement('div');
    cart_button.classList.add('cart-button');
    product_container.appendChild(cart_button);

    let button = document.createElement('button');
    button.innerText = 'Add to Cart';
    cart_button.appendChild(button);
}

const dishes_data = [
    { image: './Assets/special_dish_1.png', dish_name: 'Fattoush salad' },
    { image: './Assets/special_dish_2.png', dish_name: 'Vegetable salad' },
    { image: './Assets/special_dish_3.png', dish_name: 'Egg Vegi salad' }
];

for (let index = 0; index <= dishes_data.length - 1; index++) {
    let dishes_container = document.querySelector('.dishes-container');
    let dish_container = document.createElement('div');
    dish_container.classList.add('dish-container');
    dishes_container.appendChild(dish_container);

    let icon_div = document.createElement('div');
    icon_div.classList.add('icon-div');
    dish_container.appendChild(icon_div);

    let icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-heart', 'heart-icon');
    icon_div.appendChild(icon);

    let dish_image = document.createElement('img');
    dish_image.src = dishes_data[index].image;
    dish_container.appendChild(dish_image);

    let dish_detail = document.createElement('div');
    dish_detail.classList.add('dish-detail');
    dish_container.appendChild(dish_detail);

    let dish_name = document.createElement('p');
    dish_name.classList.add('dish-name');
    dish_name.innerText = dishes_data[index].dish_name;
    dish_detail.appendChild(dish_name);

    let dish_desc = document.createElement('p');
    dish_desc.classList.add('dish-desc');
    dish_desc.innerText = 'Description of the item';
    dish_detail.appendChild(dish_desc);
}

let DealsData = [
    { image: "./Assets/deals_1.png" },
    { image: "./Assets/deals_2.png" },
    { image: "./Assets/deals_3.png" },
    { image: "./Assets/deals_4.png" }
];

for (let index = 0; index <= DealsData.length - 1; index++) {
    let deals_container = document.querySelector('.deals-container');
    let deal_container = document.createElement('div');
    deal_container.classList.add('deal-container');
    deals_container.appendChild(deal_container);

    let img_container = document.createElement('div');
    img_container.classList.add('img-container');
    deal_container.appendChild(img_container);

    let back_img = document.createElement('img');
    back_img.classList.add('back-img');
    back_img.src = DealsData[index].image;
    img_container.appendChild(back_img);

    let deal_detail = document.createElement('div');
    deal_detail.classList.add('deal-detail');
    deal_container.appendChild(deal_detail);

    let deal_name = document.createElement('p');
    deal_name.classList.add('deal-name');
    deal_name.innerText = 'Seeds of Change Organic Quinoa, Brown, and Red Rice';
    deal_detail.appendChild(deal_name);

    let rating = document.createElement('div');
    rating.classList.add('rating');
    deal_detail.appendChild(rating);

    let star = document.createElement('img');
    star.src = './Assets/star.png';
    rating.appendChild(star);

    let rating_text = document.createElement('span');
    rating_text.innerText = '(4.0)';
    rating.appendChild(rating_text);

    let by_food = document.createElement('p');
    by_food.classList.add('by-food');
    by_food.innerText = 'By';
    deal_detail.appendChild(by_food);

    let food_by = document.createElement('span');
    food_by.innerText = 'NestedFood';
    by_food.appendChild(food_by);

    let price_button = document.createElement('div');
    price_button.classList.add('price-button');
    deal_detail.appendChild(price_button);

    let deals_price_div = document.createElement('div');
    deals_price_div.classList.add('deals-price-div');
    price_button.appendChild(deals_price_div);

    let price = document.createElement('span');
    price.classList.add('price');
    price.innerText = '$238.85';
    deals_price_div.appendChild(price);

    let old_price = document.createElement('span');
    old_price.classList.add('old-price');
    old_price.innerText = '$224.8';
    deals_price_div.appendChild(old_price);

    let button = document.createElement('button');
    button.classList.add('deals-cart-button');
    button.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Add';
    price_button.appendChild(button);
}

// Animate containers after they are created
setTimeout(animateContainers, 100);

let bars = document.querySelector('.bars');
let mobile_nav = document.querySelector('.mobile-nav');

window.APP_DATA = { products: [] };

fetch('getproducts')
    .then(res => res.json())
    .then(data => {
        window.APP_DATA.products = data;
        console.log(window.APP_DATA.products);
    });
