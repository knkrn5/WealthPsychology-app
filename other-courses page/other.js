//javascript to handle other couses buttons hovering....
document.addEventListener("DOMContentLoaded", function() {
    let addToCartButtons = document.querySelectorAll('.add-to-cart');
    let buyNowButtons = document.querySelectorAll('.buy-now');
    let headings = document.querySelectorAll('.course-card h3');

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

    // // Function to handle  other course  button click event
    // function addToCartClick(event) {
    //     let button = event.target;
    //     if (button.innerText === "Add to Cart") {
    //         button.innerText = "Item added to Cart";
    //         button.style.color = "white";
    //     } else {
    //         button.innerText = "Add to Cart";
    //         button.style.color = ""; // Reset to original color
    //     }
    // }

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
      //  addToCartButton.addEventListener('click', addToCartClick);

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

// Sample array to store cart items
// Function to load cart items from localStorage
function loadCartItems() {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
    }
    updateCart();
}

// Function to save cart items to localStorage
function saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to add item to cart
function addToCart(courseTitle, courseImage, originalPrice, courseId) {
    // Check if the item already exists in the cart
    const existingItem = cartItems.find(item => item.id === courseId);
    if (existingItem) {
        alert(`"${courseTitle}" is already in your cart.`);
        return;
    }

    const item = {
        id: courseId,
        title: courseTitle,
        image: courseImage,
        originalPrice: originalPrice
    };
    cartItems.push(item);
    saveCartItems();
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
            <button class="delete-item" data-course-id="${item.id}"><i class="fa-solid fa-trash" alt="Trash Icon"></i></button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to "delete" buttons
    document.querySelectorAll('.delete-item').forEach(deleteButton => {
        deleteButton.addEventListener('click', () => {
            const courseId = deleteButton.getAttribute('data-course-id');
            const itemIndex = cartItems.findIndex(item => item.id == courseId);
            if (itemIndex !== -1) {
                cartItems.splice(itemIndex, 1);
                saveCartItems();
                updateCart();
                const addToCartButton = document.querySelector(`.add-to-cart[data-course-id="${courseId}"]`);
                if (addToCartButton) {
                    addToCartButton.innerText = 'Add to Cart';
                }
            }
        });
    });

    // Add "Proceed to Buy All" button if there are items in the cart
    if (cartItems.length > 0) {
        const buyAllButton = document.createElement('button');
        buyAllButton.classList.add('buyall');
        buyAllButton.textContent = 'Proceed to Buy All';
        buyAllButton.addEventListener('click', () => {
            // Add your "Proceed to Buy All" functionality here
            alert('Purchase Successful');
        });
        cartItemsContainer.appendChild(buyAllButton);
    }
}

// Load cart items when the page is loaded
document.addEventListener('DOMContentLoaded', loadCartItems);

// Example usage: Adding event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const courseCard = button.closest('.course-card');
        const courseTitle = courseCard.querySelector('h3').innerText;
        const courseImage = courseCard.querySelector('img').src;
        const originalPrice = courseCard.querySelector('.original-price').innerText;
        const courseId = button.getAttribute('data-course-id');
        addToCart(courseTitle, courseImage, originalPrice, courseId);
        button.innerText = "Item Added to Cart";
    });
});
