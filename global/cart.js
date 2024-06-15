
// global cart js------------------------------
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


// --------------------------------------------------------------------------
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
            alert("Oops! Payment options aren't available yet because the course videos are still being prepared. In the meantime, click the image or title to see the concepts you'll learn in this course");
        });
        cartItemsContainer.appendChild(buyAllButton);
    }
}

// Load cart items when the page is loaded
document.addEventListener('DOMContentLoaded', loadCartItems);


// Add event listeners to "Add to Cart" buttons
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
