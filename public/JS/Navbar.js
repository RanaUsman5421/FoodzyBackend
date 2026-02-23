// Load navbar
fetch('./navbar.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
        
        // Add search functionality after navbar is loaded
        const searchInput = document.getElementById('search-input');
        const searchCategory = document.getElementById('search-category');
        const searchIcon = document.getElementById('search-icon');
        
        // Function to perform search
        const performSearch = () => {
            const query = searchInput ? searchInput.value.trim() : '';
            const category = searchCategory ? searchCategory.value : 'All Categories';
            
            if (query || (category && category !== 'All Categories')) {
                // Build URL with query parameters
                let url = 'shop.html?';
                const params = [];
                
                if (query) {
                    params.push(`query=${encodeURIComponent(query)}`);
                }
                if (category && category !== 'All Categories') {
                    params.push(`category=${encodeURIComponent(category)}`);
                }
                
                url += params.join('&');
                window.location.href = url;
            }
        };
        
        // Add click event to search icon
        if (searchIcon) {
            searchIcon.addEventListener('click', performSearch);
        }
        
        // Add Enter key event to search input
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
        
        // Hamburger menu toggle functionality
        const bars = document.querySelector('.bars');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (bars && mobileNav) {
            bars.addEventListener('click', function(e) {
                e.stopPropagation();
                mobileNav.classList.toggle('menu-active');
                
                // Animate bars icon
                bars.style.transform = mobileNav.classList.contains('menu-active') 
                    ? 'rotate(90deg)' : 'rotate(0deg)';
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileNav.contains(e.target) && !bars.contains(e.target)) {
                    mobileNav.classList.remove('menu-active');
                    bars.style.transform = 'rotate(0deg)';
                }
            });

            // Close menu when clicking a link
            const mobileNavLinks = mobileNav.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileNav.classList.remove('menu-active');
                    bars.style.transform = 'rotate(0deg)';
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileNav.classList.contains('menu-active')) {
                    mobileNav.classList.remove('menu-active');
                    bars.style.transform = 'rotate(0deg)';
                }
            });
        }
        
        // Check if user is logged in and update navbar
        checkUserLoginStatus();
    });

// Load footer
fetch('./footer.html')
    .then(res => res.text())
    .then(data => {
        // Find all footer elements and replace them with loaded content
        const footers = document.querySelectorAll('footer');
        footers.forEach(footer => {
            footer.innerHTML = data;
        });
    })
    .catch(err => console.error('Error loading footer:', err));

// Function to check user login status and update navbar
function checkUserLoginStatus() {
    fetch('/api/user')
        .then(res => res.json())
        .then(data => {
            const userIcon = document.querySelector('.fa-user').parentElement;
            
            if (data.loggedIn && data.user) {
                // User is logged in - replace user icon with name and logout
                userIcon.innerHTML = `
                    <span class="user-name">Hi, ${data.user.firstname}</span>
                    <a href="/logout" class="logout-link" title="Logout">
                        <i class="fa-solid fa-sign-out-alt"></i>
                    </a>
                `;
                
                // Add logout styling
                const logoutLink = userIcon.querySelector('.logout-link');
                if (logoutLink) {
                    logoutLink.style.marginLeft = '10px';
                }
            }
        })
        .catch(err => console.error('Error checking user status:', err));
}
