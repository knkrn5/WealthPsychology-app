let lastverticalScroll = 0;
const navbar = document.querySelector("header");

// Scroll threshold in pixels
const scrollThreshold = 10; 

window.addEventListener("scroll", function () {

    let verticalScroll = window.pageYOffset || document.documentElement.verticalScroll;

    // Check if the scroll difference exceeds the threshold
    if (Math.abs(verticalScroll - lastverticalScroll) > scrollThreshold) {
        if (verticalScroll > lastverticalScroll) {
            // User scrolled down past the threshold
            navbar.style.transform = "translateY(-100%)"; // Hide navbar
        } else {
            // User scrolled up past the threshold
            navbar.style.transform = "translateY(0)"; // Show navbar
        }
    }
 
    // Update last scroll position
    lastverticalScroll = verticalScroll <= 0 ? 0 : verticalScroll; // For mobile or negative scrolling
});
