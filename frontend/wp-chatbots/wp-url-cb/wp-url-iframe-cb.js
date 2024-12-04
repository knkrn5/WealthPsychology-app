// Create a chat logo/button to toggle the chatbot
function createChatlogo() {
  const wpUrlCbLogo = document.getElementById('wp-url-cb-logo');
  
  // Toggle chatbot visibility on logo click
  wpUrlCbLogo.onclick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to the document
    const chatbot = document.getElementById('wp-url-iframe-cb');
    chatbot.style.display = chatbot.style.display === 'none' ? 'block' : 'none';
  };

  document.body.appendChild(wpUrlCbLogo);
  wpUrlCbLogo.click();
}

// Close chatbot when clicking outside
function setupCloseOnOutsideClick() {
  document.addEventListener('click', (e) => {
    const chatbot = document.getElementById('wp-url-iframe-cb');
    const wpUrlCbLogo = document.getElementById('wp-url-cb-logo');

    // Check if the clicked element is not the chatbot or the logo
    if (
      chatbot &&
      wpUrlCbLogo &&
      chatbot.style.display === 'block' &&
      !chatbot.contains(e.target) &&
      !wpUrlCbLogo.contains(e.target)
    ) {
      chatbot.style.display = 'none'; // Close the chatbot
    }
  });
}

// Initialize when the page loads
window.addEventListener('load', () => {
  createChatlogo();
  setupCloseOnOutsideClick();
});
