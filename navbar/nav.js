

// global navigation js------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  const menuBars = document.getElementById('menu-bars');
  const navMenu = document.querySelector('.nav-menu');

  menuBars.addEventListener('click', function() {
      navMenu.classList.toggle('active'); // Toggle the menu visibility as well
      menuBars.classList.toggle('active'); // Toggle class on mobileMenu
  });
});

/* navLinks.forEach(function(link) {
  link.addEventListener('click', function() {
      navMenu.classList.remove('active'); // Hide the menu
      menuBars.classList.remove('active'); // Remove active class from mobileMenu
  });
}); */