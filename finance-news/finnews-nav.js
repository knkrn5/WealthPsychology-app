document.addEventListener('DOMContentLoaded', function() {
    const menuBars = document.getElementById('menu-bars');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const financeNewsLink = document.querySelector('.nav-menu a[href="finance-news.html"]');
    const dropdownMenu = document.querySelector('.dropdown-menu'); //accessed for css class

    //function to open the mobile menu
    function toggleMobileMenu(event) {
        event.stopPropagation();
        navMenu.classList.toggle('active');
        menuBars.classList.toggle('active');
    }

    //function to close the mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        menuBars.classList.remove('active');
    }


    //function to open the dropdown when clicked on the finance news
    function handleNavLinkClick(event) {
        if (window.innerWidth <= 1300) {
            if (this === financeNewsLink) {
                event.preventDefault();
                dropdownMenu.classList.toggle('active');
            } else {
                closeMobileMenu();
            }
        }
    }

    //function to only add the close mobile menu on full screen
    function handleOutsideClick(event) {
        if (!navMenu.contains(event.target) && !menuBars.contains(event.target)) {
            closeMobileMenu();
        }
    }

    //funtion to add the active on the dropdown list links
    function addMobileClickListeners() {
        if (window.innerWidth <= 1300) {
            const dropdowns = document.querySelectorAll('.dropdown > a');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.nextElementSibling.classList.toggle('active');
                });
            });
        }
    }

    //now here we are assign the function task that we have created above 
    if (menuBars && navMenu) {
        menuBars.addEventListener('click', toggleMobileMenu);
        document.addEventListener('click', handleOutsideClick);

        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        financeNewsLink.addEventListener('touchstart', function(event) {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                dropdownMenu.classList.toggle('active');
            }
        });
    }

    addMobileClickListeners();
    window.addEventListener('resize', addMobileClickListeners); //resize is a eventlistener
});