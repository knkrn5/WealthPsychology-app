

// Declare the array to store cart items and the toggleCart function.
// Define functions for loading and saving cart items.
// Define the function to add items to the cart.
// Define the function to update the cart content.
// Add event listeners for "Add to Cart" buttons.
// Add an event listener for the "Proceed to Buy All" button.
// Load cart items when the page is loaded.


// Array to store cart items
let cartItems = [];

// Function to toggle the cart display
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
function addToCart(courseTitle, courseImage, discountedPrice, courseId) {
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
        discountedPrice: discountedPrice
    };
    cartItems.push(item);
    saveCartItems();
    updateCart();
}

// Function to update cart content
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    let totalAmount = 0;

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title} Image">
            <h4>${item.title}</h4>
            <p>Discount Price: ${item.discountedPrice}</p>
            <button class="delete-item" data-course-id="${item.id}"><i class="fa-solid fa-trash" alt="Trash Icon"></i></button>
        `;
        cartItemsContainer.appendChild(cartItem);

        // Calculate total amount
        totalAmount += parseFloat(item.discountedPrice.replace('₹', ''));
    });

    // Update total amount in the cart
    document.getElementById('cart-total-amount').innerText = `₹${totalAmount.toFixed(2)}`;

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

    // Show or hide "Proceed to Buy All" button
    const buyAllButton = document.querySelector('.buyall');
    const cartTotal = document.querySelector('#cart-total');
    const cartHeading = document.querySelector('.cart-heading');
    if (cartItems.length > 0) {
        buyAllButton.style.display = "block";
        cartTotal.style.display = "block";
        cartHeading.innerHTML = "Your Cart";
    } else {
        buyAllButton.style.display = "none";
        cartTotal.style.display = "none";
        cartHeading.innerHTML = "Your Cart is Empty";
    }
}

// Example usage: Adding event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const courseCard = button.closest('.course-card');
        const courseTitle = courseCard.querySelector('h3').innerText;
        const courseImage = courseCard.querySelector('img').src;
        const discountedPrice = courseCard.querySelector('.discounted-price').innerText;
        const courseId = button.getAttribute('data-course-id');
        addToCart(courseTitle, courseImage, discountedPrice, courseId);
        button.innerText = "Item Added to Cart";
    });
});

// Add "Proceed to Buy All" button functionality
const buyAllButton = document.querySelector('.buyall');
buyAllButton.addEventListener('click', () => {
    // Add your "Proceed to Buy All" functionality here
    alert("Oops! Payment options aren't available yet because the course videos are still being prepared. In the meantime, click the image or title to see the concepts you'll learn in this course");
});

// Load cart items when the page is loaded
document.addEventListener('DOMContentLoaded', loadCartItems);
