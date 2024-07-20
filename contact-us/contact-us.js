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
        alert('Form submitted successfully!');
    });
});

const validation = document.getElementById('contact-form');
validation.addEventListener('submit', function(event) {
    const name = document.getElementById('name').value;
    if (name === 'karan') {
        alert("Enter the correct name");
        event.preventDefault(); // Prevent form submission
    }
});

