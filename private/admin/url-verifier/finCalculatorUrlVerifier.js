const urls = [
    "https://wealthpsychology.in/financial-calculators/simple-interest-calculator/",
    "https://wealthpsychology.in/financial-calculators/reverse-simple-interest-calculator/",
    "https://wealthpsychology.in/financial-calculators/cagr-calculator/",
    "https://wealthpsychology.in/financial-calculators/reverse-cagr-calculator/"
];

urls.forEach(url => {
    fetch(url)
        .then(response => {
            if (response.status === 200) {
                console.log(`${url}: Status 200 OK`);
            } else {
                console.log(`${url}: Status ${response.status}`);
            }
        })
        .catch(error => {
            console.log(`${url}: Error ${error}`);
        });
});