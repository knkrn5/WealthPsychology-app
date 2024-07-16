
//mobile nav menu bar via global nav.js-------------------------------


  

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
