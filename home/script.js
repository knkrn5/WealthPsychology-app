

// script.js

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');

  mobileMenu.addEventListener('click', function() {
      navMenu.classList.toggle('active'); // Toggle the menu visibility as well
      mobileMenu.classList.toggle('active'); // Toggle class on mobileMenu
  });
});

  


// new feature prompt javascript------------------
document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('dismissedFeaturePrompt')) {
    document.getElementById('newFeaturePrompt').style.display = 'block';
  }
});

function dismissPrompt() {
  localStorage.setItem('dismissedFeaturePrompt', true);
  document.getElementById('newFeaturePrompt').style.display = 'none';
}
