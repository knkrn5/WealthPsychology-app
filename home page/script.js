// script.js

// Example: Change the welcome message after a delay
setTimeout(function() {
    document.getElementById('heroMessage').innerText = 'Explore Our Latest Collection';
}, 3000); // Change the message after 3 seconds (3000 milliseconds)
// Add these functions to your existing script.js file

function openCart() {
    document.getElementById('cart').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart').style.display = 'none';
}


