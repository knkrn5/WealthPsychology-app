
//mobile nav menu bar via global nav.js-------------------------------

// new feature prompt javascript
function dismissPrompt(event) {
  const prompt = document.getElementById('newFeaturePrompt');
  if (prompt) {
    prompt.remove();
  }
}

// Add click event listener to the entire document
document.addEventListener('click', dismissPrompt);

// Add click event listener to the prompt itself to prevent event bubbling
document.getElementById('newFeature')?.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevents click events from bubbling up to the document
});
