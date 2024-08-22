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
    setTimeout(() =>{
    loadHTML('/layouts/footer/footer.html', '#footer');  
    },1500);  //will load footer after 1.5 second
});



// another way to load the footer--My logic--------------------------------------------------
/* document.addEventListener("DOMContentLoaded", () => {
    const footer = document.getElementById('footer');
     
    function loadFooter() {
        fetch('/footer/footer.html')
        .then(response => response.text())
        .then(data => {
            footer.innerHTML = data;
            if (callback) callback(); // If you need to use a callback, you can add it here
        })
        .catch(error => console.error('Error loading footer:', error));
    }

    // Setting time to load footer
    setTimeout(() => {
        loadFooter();
    }, 1500);  // Load footer after 1.5 seconds
}); */







