
//bookmark js----------------------
// Function to toggle bookmark cart visibility

// Array to store cart items
let bookmarkItems = []; 

// Function to toggle the bookmark display
function toggleBookmark() {
    var bookmark = document.getElementById('bookmark');
    var bookmarkIcon = document.getElementById('bookmark-icon');

    if (bookmark.style.display === 'none' || bookmark.style.display === '') {
        bookmark.style.display = 'block';
        bookmarkIcon.style.backgroundColor = "lightyellow";
    } else {
        bookmark.style.display = 'none';
        bookmarkIcon.style.backgroundColor = "";
    }
}

// Function to load bookmarked items from localStorage
function loadBookmarkItems() {
    const storedBookmarkItems = localStorage.getItem('bookmarkItems');
    if (storedBookmarkItems) {
        bookmarkItems = JSON.parse(storedBookmarkItems);
    }
    updateBookmarks();
}

// Function to save bookmarked items to localStorage
function saveBookmarkItems() {
    localStorage.setItem('bookmarkItems', JSON.stringify(bookmarkItems));
}

// Function to add item to bookmarks
function addToBookmarks(contentTitle, contentImage, conceptId ) {
    // Check if the item already exists in bookmarks
    const existingItem = bookmarkItems.find(item => item.id === conceptId);
    if (existingItem) {
        alert(`"${contentTitle}" is already bookmarked.`);
        return;
    }

    const item = {
        id: conceptId,
        title: contentTitle,
        image: contentImage,
    };
    bookmarkItems.push(item);
    saveBookmarkItems();
    updateBookmarks();
}

// Function to update bookmarks content
function updateBookmarks() {
    const bookmarkItemsContainer = document.getElementById('bookmark-items');
    bookmarkItemsContainer.innerHTML = '';

    let bookmarkItemCount = 0;

    bookmarkItems.forEach(item => {
        const bookmarkItem = document.createElement('div');
        bookmarkItem.classList.add('bookmark-item');
        bookmarkItem.innerHTML = `
            <img src="${item.image}" alt="${item.title} Image">
            <h4 class = "title">${item.title}</h4>
            <button class="delete-item" concept-id="${item.id}"><i class="fa-solid fa-trash" alt="Trash Icon"></i></button>
        `;
        bookmarkItemsContainer.appendChild(bookmarkItem);

        bookmarkItemCount += 1;
    });

    // Update bookmark count
    document.getElementById('total-bookmark').innerText = `${bookmarkItemCount}`;

    // Add event listeners to "delete" buttons
    document.querySelectorAll('.delete-item').forEach(deleteButton => {
        deleteButton.addEventListener('click', () => {
            const conceptId = deleteButton.getAttribute('concept-id');
            const itemIndex = bookmarkItems.findIndex(item => item.id == conceptId);
            if (itemIndex !== -1) {
                bookmarkItems.splice(itemIndex, 1);
                saveBookmarkItems();
                updateBookmarks();
                const readLaterButton = document.querySelector(`.rlbtn[concept-id="${conceptId}"]`);
                if ( readLaterButton) {
                    readLaterButton.innerText = 'Read Later';
                }
            }
        });
    });

    // Show or hide "Delete all Bookmarks" button
    const deleteAllButton = document.querySelector('.deleteall');
    const bookmarkHeading = document.querySelector('.bookmark-heading');
    if (bookmarkItems.length > 0) {
        deleteAllButton.style.display = "block";
        bookmarkHeading.innerHTML = "Bookmarks: -";
    } else {
        deleteAllButton.style.display = "none";
        bookmarkHeading.innerHTML = "Empty Bookmarks";
    }
}

// Example usage: Adding event listeners to "Add to Bookmarks" buttons
document.querySelectorAll('.rlbtn').forEach(button => {
    button.addEventListener('click', () => {
        const contentSection = button.closest('.content');
        const contentTitle = contentSection.querySelector('h2 strong').innerText;
        const contentImage = contentSection.querySelector('img').src;
        const conceptId = button.getAttribute('concept-id');
        addToBookmarks(contentTitle, contentImage, conceptId);
        button.innerText = "Bookmarked";
    });
});

// Added "Delete all Bookmarks" button functionality
const deleteAllButton = document.querySelector('.deleteall');
deleteAllButton.addEventListener('click', () => {
    bookmarkItems = [];
    saveBookmarkItems();
    updateBookmarks();
});

// Load bookmark items when the page is loaded
document.addEventListener('DOMContentLoaded', loadBookmarkItems);
