


function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    var myPnL = document.getElementById('mypnl').value;
    var redirectUrl;

    // Define URLs for each option
    switch (myPnL) {
        case 'value1':
            redirectUrl = 'https://docs.google.com/spreadsheets/d/1sy5YNpgrk0VcZdWFdWS7KFHzsDOuDFKbOZnUyOzAf6I/edit?usp=sharing';
            break;
        case 'value2':
            redirectUrl = 'https://docs.google.com/spreadsheets/d/1sy5YNpgrk0VcZdWFdWS7KFHzsDOuDFKbOZnUyOzAf6I/edit?usp=sharing';
            break;
        case 'value3':
            redirectUrl = 'https://docs.google.com/spreadsheets/d/1sy5YNpgrk0VcZdWFdWS7KFHzsDOuDFKbOZnUyOzAf6I/edit?usp=sharing';
            break;
        default:
            alert('Please select a valid P&L statement.')
            redirectUrl = null; // Ensure redirectUrl is null for default case
            break;
    }

    if (redirectUrl) {
        window.open(redirectUrl, '_blank');  // Open the specified URL in a new tab
    }
}
