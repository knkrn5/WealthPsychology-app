

// global footer javascript------------------------

document.addEventListener("DOMContentLoaded", () => {
    loadHTML('/footer/footer.html', '#footer', highlightActiveLink);
});

function loadHTML(url, selector, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
            if (callback) {
                console.log("HTML loaded, invoking callback");
                callback(); // Call the callback function if it exists
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}

function highlightActiveLink() {
    const currentPath = window.location.pathname;
    console.log("Current Path: ", currentPath); // Debug log

    const navLinks = document.querySelectorAll('.nav-link');
    console.log("Nav Links: ", navLinks); // Debug log

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        console.log("Checking Link: ", href); // Debug log

        if (href.includes(currentPath)) {
            console.log("Match Found: ", link); // Debug log
            link.classList.add('active');
        }
    });
}




// another way of writing this----------------------------
// document.addEventListener("DOMContentLoaded", () => {
//     loadHTML('global/footer.html', '#footer'); // Correct path to footer.html inside the global folder
// });

// function loadHTML(url, selector) {
//     fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.text();
//         })
//         .then(data => {
//             document.querySelector(selector).innerHTML = data;
//         })
//         .catch(error => console.error('Error loading HTML:', error));
// }


// ------------------------------------------------------------
// document.addEventListener("DOMContentLoaded", () => {
//     // loadHTML('header.html', '#header');
//      loadHTML('/footer/footer.html', '#footer', highlightActiveLink);
//  });
 
//  function loadHTML(url, selector) {
//      fetch(url)
//          .then(response => response.text())
//          .then(data => {
//              document.querySelector(selector).innerHTML = data;
//          })
//          .catch(error => console.error('Error loading HTML:', error));
//  }
 

