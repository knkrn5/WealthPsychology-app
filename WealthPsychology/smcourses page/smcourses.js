// adding item in cart
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


//javascript to handle button hovering....
document.addEventListener("DOMContentLoaded", function() {
    let addToCartButton = document.getElementById('add-to-cart');
    let buyNowButton = document.getElementById('buy-now');

    // Create hover text element for Add to Cart button
    let hoverTextAddToCart = document.createElement('span');
    hoverTextAddToCart.innerText = 'Add this item to cart';
    hoverTextAddToCart.className = 'hover-text'; // Assigning class name to be used for CSS styling
    addToCartButton.appendChild(hoverTextAddToCart);
    hoverTextAddToCart.style.opacity = 0; // Initially hide the hover text

    // Add mouse enter event listener to Add to Cart button
    addToCartButton.addEventListener('mouseenter', function () {
        // Display hover text
        hoverTextAddToCart.style.opacity = 1;
        this.style.backgroundColor = "black";
    });

    // Add mouse leave event listener to Add to Cart button
    addToCartButton.addEventListener('mouseleave', function() {
        // Hide hover text
        hoverTextAddToCart.style.opacity = 0;
        this.style.backgroundColor = "#555";
    });

    // Create hover text element for Buy Now button
    let hoverTextBuyNow = document.createElement('span');
    hoverTextBuyNow.innerText = 'Click to buy now';
    hoverTextBuyNow.className = 'hover-text'; // Assigning class name to be used for CSS styling
    buyNowButton.appendChild(hoverTextBuyNow);
    hoverTextBuyNow.style.display = 'none'; // Initially hide the hover text

    // Add mouse enter event listener to Buy Now button
    buyNowButton.addEventListener('mouseenter', function () {
        // Display hover text
        hoverTextBuyNow.style.display = 'block';
        this.style.backgroundColor = "black";
    });

    // Add mouse leave event listener to Buy Now button
    buyNowButton.addEventListener('mouseleave', function() {
        // Hide hover text
        hoverTextBuyNow.style.display = 'none';
        this.style.backgroundColor = "#555";
    });
});








// JavaScript to handle button clicks
/* document.addEventListener("DOMContentLoaded", function() {
let addToCartButtonClicked = document.getElementById('add-to-cart');
addToCartButtonClicked.addEventListener('click', function () {
addToCartButtonClicked.innerText = "Item added to Cart";
   if(addToCartButtonClicked === "Item added to Cart"){
    let hoverTextAddToCart = document.createElement('span');
    hoverTextAddToCart.innerText = 'Remove this item from cart';
    hoverTextAddToCart.className = 'hover-text'; // Assigning class name to be used for CSS styling
    addToCartButton.appendChild(hoverTextAddToCart);
    hoverTextAddToCart.style.opacity = 0; // Initially hide the hover text

    // Add mouse enter event listener to Add to Cart button
    addToCartButtonClicked.addEventListener('mouseenter', function () {
        // Display hover text
        hoverTextAddToCart.style.opacity = 1;
        this.style.backgroundColor = "black";
    });

    // Add mouse leave event listener to Add to Cart button
    addToCartButtonClicked.addEventListener('mouseleave', function() {
        // Hide hover text
        hoverTextAddToCart.style.opacity = 0;
        this.style.backgroundColor = "#555";
    });
   }

}
}); */






















// JavaScript to handle button clicks
/* let atc = document.querySelector("#add-to-cart");
atc.addEventListener('click', function() {
    if (atc.innerText === "Add to Cart") {
        atc.innerText = "Item added to cart😆";
       // atc.style.backgroundColor = "#778899";
    } else {
        atc.innerText = "Add to Cart";
        atc.style.backgroundColor = "#333";
        atc.style.color = "#fff";
    }
}); */



document.getElementById('buy-now').addEventListener('click', function() {
    alert('opps!!! payment option is under development until then click the image/title to know what all concepts you wil get to learn in this course!');
    // You can redirect the user to the checkout page or perform other actions here
    //window.open('https://1drv.ms/w/s!At5WivVSSLb9i3N_1RMb_KbxXeRS?e=foUacx', '_blank'); // Change this to the actual checkout page, it open the provided URL on new tab
});
