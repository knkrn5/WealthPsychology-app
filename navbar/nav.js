

// global navigation js------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  const menuBars = document.getElementById('menu-bars');
  const navMenu = document.querySelector('.nav-menu');

  document.addEventListener('click', function() { //whole screen click closure
      navMenu.classList.toggle('active'); // Toggle class on mobile nav Menu option
      menuBars.classList.toggle('active'); // Toggle the menu bar visibility 
  });
});
