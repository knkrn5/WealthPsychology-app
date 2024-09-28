// Array to store cart Contents
let bookmarkItems = JSON.parse(localStorage.getItem('bookmarks')) || [];
let buttonStates = JSON.parse(localStorage.getItem('readLaterStates')) || {};

// Function to toggle bookmark cart visibility
function toggleBookmark() {
    console.log("clicked");
    const bookmarkContainer = document.querySelector('.bookmark-container');
    if (bookmarkContainer.style.display === 'none' || bookmarkContainer.style.display === '') {
        bookmarkContainer.style.display = 'block';
    } else {
        bookmarkContainer.style.display = 'none';
    }
}

// Function to save bookmark items to localStorage
function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkItems));
}

// Function to save "Read Later" button states to localStorage
function saveButtonStates() {
    localStorage.setItem('readLaterStates', JSON.stringify(buttonStates));
}

// Function to handle appending a bookmark to the list
function appendBookmark(bookmarkItem) {
    const bookmarks = document.querySelector('#bookmark-items');
    const bookmarkDiv = document.createElement('div');
    bookmarkDiv.classList.add('bookmark-item');
    bookmarkDiv.innerHTML = `
        <img src="${bookmarkItem.image}" alt="Bookmarked Image">
        <h4>${bookmarkItem.title}</h4>
        <button class="delete-item"><i class="fa-solid fa-trash" alt="Trash Icon"></i></button>
    `;

    bookmarks.prepend(bookmarkDiv);

    // Add the delete button event listener
    const deleteButton = bookmarkDiv.querySelector('.delete-item');
    deleteButton.addEventListener('click', () => deleteBookmark(bookmarkDiv, bookmarkItem.id));
}

// Function to delete a bookmark
function deleteBookmark(bookmarkDiv, conceptId) {
    console.log("clicked delete button");

    // Remove the entire bookmarkDiv
    bookmarkDiv.remove();

    // Update the bookmark items array
    bookmarkItems = bookmarkItems.filter(item => item.id !== conceptId);

    // Reset the button text for the removed item
    const button = document.querySelector(`.rlbtn[concept-id="${conceptId}"]`);
    if (button) {
        button.innerText = "Add to Bookmark";
        const conceptId = button.getAttribute('concept-id');
        buttonStates[conceptId] = "Add to Bookmark"; 
        saveButtonStates(); // Save updated states to localStorage
    }

    // Update the bookmark item count and display
    bookmarkItemCount(bookmarkItems);
    updateBookmarkDisplay(bookmarkItems);

    // Save the updated bookmarks to localStorage
    saveBookmarks();
}

// Function to handle the "Read Later" button click
const readLater = document.querySelectorAll('.rlbtn');
readLater.forEach(button => button.addEventListener('click', () => {
    console.log("clicked readmore");
    button.innerText = "Bookmarked";
    const conceptId = button.getAttribute('concept-id');
    buttonStates[conceptId] = "Bookmarked"; 
    saveButtonStates(); // Save updated states to localStorage

    const contentSection = button.closest('.content');
    const contentTitle = contentSection.querySelector('h2 strong').innerText;
    const contentImage = contentSection.querySelector('img').src;
    // const conceptId = button.getAttribute('concept-id');

    const bookmarkItem = {
        image: contentImage,
        id: conceptId,
        title: contentTitle
    };

    // Check if the item already exists in bookmarkItems
    const itemExists = bookmarkItems.some(item => item.id === conceptId);
    if (itemExists) {
        alert(`${bookmarkItem.title} "Item already in cart"`);
    } else {
        // Push this object to the bookmarkItems array
        bookmarkItems.push(bookmarkItem);

        // Update the bookmark count and display
        bookmarkItemCount(bookmarkItems);
        updateBookmarkDisplay(bookmarkItems);

        // Append the new bookmark to the list
        appendBookmark(bookmarkItem);

        // Save bookmarks to localStorage
        saveBookmarks();
    }
}));

// Function to display the bookmark items count
function bookmarkItemCount(bookmarkItems) {
    const bookmarkCount = document.querySelector('#total-bookmark');
    bookmarkCount.innerHTML = bookmarkItems.length;
}

// Function to update bookmark display (show/hide delete all button)
function updateBookmarkDisplay(bookmarkItems) {
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
updateBookmarkDisplay(bookmarkItems);

// Added "Delete all Bookmarks" button functionality
const deleteAllButton = document.querySelector('.deleteall');
deleteAllButton.addEventListener('click', () => {
    // Ask for confirmation before deleting all bookmarks
    const confirmDelete = confirm("Are you sure you want to delete all bookmarks?");
    
    if (confirmDelete) {
        console.log("delete all clicked");

        // Clear the bookmarkItems array
        bookmarkItems = [];

        // Remove all bookmark divs from the DOM
        const bookmark = document.querySelector('#bookmark-items');
        bookmark.innerHTML = ''; // This will remove all child elements (bookmark divs)

        // Reset all "Bookmarked" buttons back to "Add to Bookmark"
        const readLaterButtons = document.querySelectorAll('.rlbtn');
        readLaterButtons.forEach(button => {
            const conceptId = button.getAttribute('concept-id');
            button.innerText = "Add to Bookmark";
            buttonStates[conceptId] = "Add to Bookmark"; // Update button state
        });

        // Update bookmark display and count
        updateBookmarkDisplay(bookmarkItems);
        bookmarkItemCount(bookmarkItems);

        // Clear localStorage
        saveBookmarks();
        saveButtonStates();
    } 
     // No "else" block needed, nothing happens if the user clicks "Cancel"
});


// Load bookmarks from localStorage on page load
function loadBookmarks() {
    bookmarkItems.forEach(item => appendBookmark(item));
    bookmarkItemCount(bookmarkItems);
    updateBookmarkDisplay(bookmarkItems);

    // Restore "Read Later" button states
    const readLaterButtons = document.querySelectorAll('.rlbtn');
    readLaterButtons.forEach(button => {
        const conceptId = button.getAttribute('concept-id');
        if (buttonStates[conceptId]) {
            button.innerText = buttonStates[conceptId];
        }
    });
}
loadBookmarks();
