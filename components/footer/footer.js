// global footer javascript------------------------


// this is first we have to define the loadHTML function here with the parameters
function loadHTML(url, selector, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
            if (callback) callback(); // Call the callback function if it exists
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// after defining the loadHTML function now here we are calling the function with the argument for its parameter 
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        loadHTML('/components/footer/footer.html', '#footer');
    }, 1500);  //will load footer after 1.5 second
});








