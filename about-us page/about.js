


function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    var selectedFruit = document.getElementById('fruit').value;
    var redirectUrl;

    // Define URLs for each option
    switch(selectedFruit) {
        case 'apple':
            redirectUrl = 'https://example.com/apple';
            break;
        case 'banana':
            redirectUrl = 'https://example.com/banana';
            break;
        case 'cherry':
            redirectUrl = 'https://example.com/cherry';
            break;
        case 'date':
            redirectUrl = 'https://example.com/date';
            break;
        default:
            redirectUrl = 'https://example.com';
            break;
    }

    // Redirect to the specified URL
    window.location.href = redirectUrl;
}
