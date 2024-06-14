
// global course js----------------------------------

//javascript to handle courses card buttons hovering....
document.addEventListener("DOMContentLoaded", function() {
    let addToCartButtons = document.querySelectorAll('.add-to-cart');
    let buyNowButtons = document.querySelectorAll('.buy-now');
    let headings = document.querySelectorAll('.smcourse-card h3');

    // Function to handle mouse enter event
    function handleMouseEnter(event) {
        event.target.style.backgroundColor = 'black'; // Change to desired hover color
        event.target.style.color = 'white'; // Change text color if needed
        event.target.style.textDecoration = "underline";
    }

    // Function to handle mouse leave event
    function handleMouseLeave(event) {
        event.target.style.backgroundColor = ''; // Reset to original background color
        event.target.style.color = ''; // Reset text color if changed
        event.target.style.textDecoration = '';
    }


    function buyNowclick(event) {
        alert("Oops! Payment options aren't available yet because the course videos are still being prepared. In the meantime, click the image or title to see the concepts you'll learn in this course")
    }

       // Function to handle mouse enter event for headings    
    function handleHeadingMouseEnter(event) {
        let hoverTextHeading = document.createElement('span');
        hoverTextHeading.innerText = 'Learn more about this course';
        hoverTextHeading.className = 'hover-text'; // Assigning class name to be used for CSS styling
        event.target.appendChild(hoverTextHeading);
        event.target.style.backgroundColor = "#444"; 
        event.target.style.textDecoration = 'underline'; 
        event.target.hoverTextHeading = hoverTextHeading; // Save reference to the created span
    }

    function handleHeadingMouseLeave(event) {
        if (event.target.hoverTextHeading) {
            event.target.hoverTextHeading.remove(); // Remove the hover text
        }
        event.target.style.backgroundColor = ''; // Reset to original color
        event.target.style.textDecoration = 'none'; 
    }

    // Add event listeners for all Add to Cart buttons
    addToCartButtons.forEach(addToCartButton => {
        addToCartButton.addEventListener('mouseenter', handleMouseEnter);
        addToCartButton.addEventListener('mouseleave', handleMouseLeave);
    });

    // Add event listeners for all Buy Now buttons
    buyNowButtons.forEach(buyNowButton => {
        buyNowButton.addEventListener('mouseenter', handleMouseEnter);
        buyNowButton.addEventListener('mouseleave', handleMouseLeave);
        buyNowButton.addEventListener('click', buyNowclick);
    });

     // Add event listeners for all headings
     headings.forEach(heading => {
        heading.addEventListener('mouseenter', handleHeadingMouseEnter);
        heading.addEventListener('mouseleave', handleHeadingMouseLeave);
    });

});


