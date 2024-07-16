

//mobile nav-menu js
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



//finance content loading js
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-menu a');
    const contentElement = document.getElementById('content');
    const defaultContent = contentElement.innerHTML;  // Store the initial content

    

    function loadContent(url) {
        if (url.startsWith('http') || url.startsWith('https')) {
            // If it's an external URL, use an iframe
            contentElement.innerHTML = `<iframe src="${url}"></iframe>`;
        } else {
            // Otherwise, fetch the content and load it as before
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    contentElement.innerHTML = data;
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
 
        //removing default content on that page when selecting other content
        const defaultContentElement = document.querySelector('.default-content')
        if (defaultContentElement) {
            defaultContentElement.style.display = 'none';
        }
    }

    // Push new states when links are clicked
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const url = link.getAttribute('data-url');
            history.pushState({ url: url }, link.href);
            // history.pushState({ url: url }, document.title, link.href); //understanding this
            loadContent(url);
        });
    });

     // Handle back button functionality
     window.addEventListener('popstate', function(event) {
        if (event.state && event.state.url) {
            loadContent(event.state.url);
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


 
