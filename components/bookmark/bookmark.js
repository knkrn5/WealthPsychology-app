
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

    // Adding data-url attribute directly to bookmarkDiv for redirection
    bookmarkDiv.setAttribute('data-url', bookmarkItem.url); 
    
    bookmarkDiv.innerHTML = `
        <img src="${bookmarkItem.image}" alt="Bookmarked Image">
        <h4>${bookmarkItem.title}</h4>
        <button class="delete-item"><i class="fa-solid fa-trash" alt="Trash Icon"></i></button>
    `;

        bookmarks.prepend(bookmarkDiv);

        // Add event listener to the bookmarkDiv itself
        bookmarkDiv.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(bookmarkDiv);
            console.log(bookmarkItem.url);

            // Redirect to the stored URL in the bookmarkItem object
            if (bookmarkItem.url) {
                // Use fetch() to check the URL response
                fetch(bookmarkItem.url)
                    .then(response => {
                        if (response.status === 200) {
                            // If the response is 200, redirect to the page
                            window.location.href = bookmarkItem.url;
                        } else if (response.status === 404) {
                            // If the response is 404, show the "Coming Soon" alert
                            alert("Coming Soon");
                        } else {
                            // Handle other statuses if necessary
                            alert("Error: Page not found.");
                        }
                    })
                    .catch(error => {
                        // If there is any error in the fetch request
                        console.error('Error fetching the URL:', error);
                        alert("Error loading the page.");
                    });
            }
    });
        

    // Add the delete button event listener
    const deleteButton = bookmarkDiv.querySelector('.delete-item');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation(); 
        deleteBookmark(bookmarkDiv, bookmarkItem.id);
    });
}

    // Function to delete a bookmark
    function deleteBookmark(bookmarkDiv, conceptId) {
        // console.log("clicked delete button");

        // Remove the entire bookmarkDiv
        bookmarkDiv.remove();

        // Update the bookmark items array
        bookmarkItems = bookmarkItems.filter(item => item.id !== conceptId);

        // Reset the button text for the removed item
        const button = document.querySelector(`.rlbtn[concept-id="${conceptId}"]`);
        if (button) {
            button.innerText = "Read Later";
            const conceptId = button.getAttribute('concept-id');
            buttonStates[conceptId] = "Read Later"; 
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
    const contentSection = button.closest('.content');

    // console.log("clicked readmore");
    button.innerText = "Bookmarked";
    const conceptId = contentSection.getAttribute('concept-id');
    buttonStates[conceptId] = "Bookmarked"; 
    saveButtonStates(); // Save updated states to localStorage

    const contentTitle = contentSection.querySelector('h2 strong').innerText;
    const contentImage = contentSection.querySelector('img').src;

    const contentUrl =  contentSection.querySelector('.lmbtn')
    const onclickLink = contentUrl.getAttribute('onclick');

    // Use a regex to extract the URL part from the onclick attribute
    const conceptUrl = onclickLink.match(/'([^']+)'/)[1]; // This will capture the URL inside the single quotes
    console.log(conceptUrl);
    

    const bookmarkItem = {
        image: contentImage,
        id: conceptId,
        title: contentTitle,
        url: conceptUrl
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

        // Reset all "Bookmarked" buttons back to "Read Later"
        const readLaterButtons = document.querySelectorAll('.rlbtn');
        readLaterButtons.forEach(button => {
            const conceptId = button.getAttribute('concept-id');
            button.innerText = "Read Later";
            buttonStates[conceptId] = "Read Later"; // Update button state
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
