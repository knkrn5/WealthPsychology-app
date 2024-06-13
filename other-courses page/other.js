//javascript to handle other couses buttons hovering....
document.addEventListener("DOMContentLoaded", function() {
    let addToCartButtons = document.querySelectorAll('.add-to-cart');
    let buyNowButtons = document.querySelectorAll('.buy-now');
    let headings = document.querySelectorAll('.other-course h3');

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

    // Function to handle  other course  button click event
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


// -----------------------------------------------------------------------
// Array to store cart items
let cartItems = [];

function toggleCart() {
    var cart = document.getElementById('cart');
    var cartIcon = document.getElementById('cart-icon');

    if (cart.style.display === 'none' || cart.style.display === '') {
        cart.style.display = 'block';
        cartIcon.style.backgroundColor = "white";
    } else {
        cart.style.display = 'none';
        cartIcon.style.backgroundColor = "";
    }
}

// Function to add item to cart
function addToCart(courseTitle, courseImage, originalPrice, discountedPrice) {
    const item = { 
        title: courseTitle, 
        image: courseImage, 
        originalPrice: originalPrice, 
        discountedPrice: discountedPrice 
    };
    cartItems.push(item);
    updateCart();
}

// Function to update cart content
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title} Image">
            <h4>${item.title}</h4>
            <p>Original Price: ${item.originalPrice}</p>
            <p>Discounted Price: ${item.discountedPrice}</p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Example usage: Adding event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const courseCard = button.closest('.smcourse-card, .other-course');
        const courseTitle = courseCard.querySelector('h3').innerText;
        const courseImage = courseCard.querySelector('img').src; // Assuming the image is directly within the course card
        const originalPrice = courseCard.querySelector('.original-price').innerText;
        const discountedPrice = courseCard.querySelector('.discounted-price').innerText;
        addToCart(courseTitle, courseImage, originalPrice, discountedPrice);
    });
});

