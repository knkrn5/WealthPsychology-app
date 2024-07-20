// contact-script.js

document.addEventListener('DOMContentLoaded', function () {
   
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // You can perform additional validation or processing here before submitting the form

        // just see in debugging
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);

        // here we have to send the form data to a server using AJAX or another method


        // Here, we are simulating a successful submission
        alert("We're sorry, our contact form is currently not working. Please email us directly at contact@wealthpsychology.in for assistance. Thank you for your understanding!");
    });
});

