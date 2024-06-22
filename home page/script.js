

// script.js

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');

  mobileMenu.addEventListener('click', function() {
      navMenu.classList.toggle('active'); // Toggle the menu visibility as well
      mobileMenu.classList.toggle('active'); // Toggle class on mobileMenu
  });
});

  


