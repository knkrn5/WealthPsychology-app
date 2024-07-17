// Mobile nav-menu JS
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu li a');

    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active'); // Toggle the menu visibility
        mobileMenu.classList.toggle('active'); // Toggle class on mobileMenu
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active'); // Hide the menu
            mobileMenu.classList.remove('active'); // Remove active class from mobileMenu
        });
    });
});

// Finance content loading JS
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-menu a');
    const contentElement = document.getElementById('content');
    const defaultContent = contentElement.innerHTML; // Store the initial content

    function loadCSS(filename) {
        const existingLink = document.querySelector('link[data-dynamic-css]');
        if (existingLink) {
            existingLink.remove();
        }

        const head = document.head;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = filename;
        link.setAttribute('data-dynamic-css', 'true'); // Mark as dynamically loaded
        head.appendChild(link);
    }

    function loadContent(url, cssFile) {
        if (url.startsWith('http') || url.startsWith('https')) {
            // If it's an external URL, use an iframe
            contentElement.innerHTML = `<iframe src="${url}"></iframe>`;
        } else {
            // Otherwise, fetch the content and load it as before
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    contentElement.innerHTML = data;
                    if (cssFile) {
                        loadCSS(cssFile);
                    }
                })
                .catch(error => console.error('Error loading content:', error));
        }

        // Update the active category styling
        links.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-menu a[data-url="${url}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log("Active class added to:", activeLink);
        } else {
            console.log("No matching link found for URL:", url);
        }

        // Remove default content on that page when selecting other content
        const defaultContentElement = document.querySelector('.default-content');
        if (defaultContentElement) {
            defaultContentElement.style.display = 'none';
        }
    }

    // Push new states when links are clicked
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const url = link.getAttribute('data-url');
            const cssFile = link.getAttribute('data-css'); // Get the CSS file from a data attribute
            history.pushState({ url: url, cssFile: cssFile }, document.title);
            loadContent(url, cssFile);
        });
    });

    // Handle back button functionality
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            loadContent(event.state.url, event.state.cssFile);
        } else {
            contentElement.innerHTML = defaultContent;
            // Show the default content section if it exists
            const defaultContentElement = document.querySelector('.default-content');
            if (defaultContentElement) {
                defaultContentElement.style.display = 'block';
            }
        }
    });

    // Push the initial state
    history.replaceState({ url: null }, document.title);
});
