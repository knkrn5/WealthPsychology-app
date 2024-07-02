
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadHTML('/footer/footer.html', '#footer', highlightActiveLink); // Pass the highlight function as a callback
});

function loadHTML(url, selector, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.querySelector(selector).innerHTML = data;
            if (callback) callback(); // Call the callback function if it exists
        })
        .catch(error => console.error('Error loading HTML:', error));
}

function highlightActiveLink() {
    const currentPath = window.location.pathname; // Get the current path
    const footerMidlinks = document.querySelectorAll('.footer-mid-links'); // Select all navigation links

    footerMidlinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('.footer-mid .active'); // Add the active class to the current page link
        }
    });
}

// -------------------------------------------------------
window.location.href = (redirectUrl, '_blank');
    window.open(redirectUrl, '_blank');  // Open the specified URL in a new tab