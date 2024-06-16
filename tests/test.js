function loadHTML(filename, elementId) {
    fetch(filename)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML('header.html', 'header');
    loadHTML('footer.html', 'footer');
});

// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    loadHTML('header.html', '#header');
    loadHTML('footer.html', '#footer');
});

function loadHTML(url, selector) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}
