

// global footer javascript------------------------

document.addEventListener("DOMContentLoaded", () => {
   // loadHTML('header.html', '#header');
    loadHTML('/footer/footer.html', '#footer');
});

function loadHTML(url, selector) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
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

 

