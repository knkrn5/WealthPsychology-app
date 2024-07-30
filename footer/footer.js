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

// after defining the loadHTML funciton now here we are calling the function with the argument for its parameter after 2 second
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() =>{
    loadHTML('/footer/footer.html', '#footer');  
    },2000);  //will load footer after 2 second
});






