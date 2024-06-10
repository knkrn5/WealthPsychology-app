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
    let addToCartButtons = document.querySelectorAll('.add-to-cart');
    let buyNowButtons = document.querySelectorAll('.buy-now');
    let headings = document.querySelectorAll('.smcourse-card h3');

    // Function to handle mouse enter event
    function handleMouseEnter(event) {
        event.target.style.backgroundColor = 'black'; // Change to desired hover color
        event.target.style.color = 'white'; // Change text color if needed
        event.target.style.textDecoration = "underline";
    }

    // Function to handle mouse leave event
    function handleMouseLeave(event) {
        event.target.style.backgroundColor = ''; // Reset to original background color
        event.target.style.color = ''; // Reset text color if changed
        event.target.style.textDecoration = '';
    }

    // Function to handle click event
    function addToCartClick(event) {
        let button = event.target;
        if (button.innerText === "Add to Cart") {
            button.innerText = "Item added to Cart";
            button.style.color = "white";
        } else {
            button.innerText = "Add to Cart";
            button.style.color = ""; // Reset to original color
        }
    }

    function buyNowclick(event) {
        alert("Oops! Payment options aren't available yet because the course videos are still being prepared. In the meantime, click the image or title to see the concepts you'll learn in this course")
    }

       // Function to handle mouse enter event for headings    
    function handleHeadingMouseEnter(event) {
        let hoverTextHeading = document.createElement('span');
        hoverTextHeading.innerText = 'Learn more about this course';
        hoverTextHeading.className = 'hover-text'; // Assigning class name to be used for CSS styling
        event.target.appendChild(hoverTextHeading);
        event.target.style.backgroundColor = "#444"; 
        event.target.style.textDecoration = 'underline'; 
        event.target.hoverTextHeading = hoverTextHeading; // Save reference to the created span
    }

    function handleHeadingMouseLeave(event) {
        if (event.target.hoverTextHeading) {
            event.target.hoverTextHeading.remove(); // Remove the hover text
        }
        event.target.style.backgroundColor = ''; // Reset to original color
        event.target.style.textDecoration = 'none'; 
    }

    // Add event listeners for all Add to Cart buttons
    addToCartButtons.forEach(addToCartButton => {
        addToCartButton.addEventListener('mouseenter', handleMouseEnter);
        addToCartButton.addEventListener('mouseleave', handleMouseLeave);
        addToCartButton.addEventListener('click', addToCartClick);

    });

    // Add event listeners for all Buy Now buttons
    buyNowButtons.forEach(buyNowButton => {
        buyNowButton.addEventListener('mouseenter', handleMouseEnter);
        buyNowButton.addEventListener('mouseleave', handleMouseLeave);
        buyNowButton.addEventListener('click', buyNowclick);
    });

     // Add event listeners for all headings
     headings.forEach(heading => {
        heading.addEventListener('mouseenter', handleHeadingMouseEnter);
        heading.addEventListener('mouseleave', handleHeadingMouseLeave);
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



document.getElementsByClassName('buy-now').addEventListener('click', function() {
    alert('opps!!! payment option is under development until then click the image/title to know what all concepts you wil get to learn in this course!');
    // You can redirect the user to the checkout page or perform other actions here
    //window.open('https://1drv.ms/w/s!At5WivVSSLb9i3N_1RMb_KbxXeRS?e=foUacx', '_blank'); // Change this to the actual checkout page, it open the provided URL on new tab
});
