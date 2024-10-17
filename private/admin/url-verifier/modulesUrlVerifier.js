const urls = [
    "https://wealthpsychology.in/modules/stock-market/",
    "https://wealthpsychology.in/modules/mutual-funds/",
    "https://wealthpsychology.in/modules/fundamental-analysis/",
    "https://wealthpsychology.in/modules/technical-analysis/",
    "https://wealthpsychology.in/modules/ipo-analysis/",
    "https://wealthpsychology.in/modules/economic-analysis/",
    "https://wealthpsychology.in/modules/sector-analysis/",
    "https://wealthpsychology.in/modules/money-market/",
    "https://wealthpsychology.in/modules/concentrated-investing/",
    "https://wealthpsychology.in/modules/cryptocurrenc/"
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