const urls = [
    "https://wealthpsychology.in/index.html",
    "https://wealthpsychology.in/finance-news/",
    "https://wealthpsychology.in/blog/",
    "https://wealthpsychology.in/financial-calculators/",
    "https://wealthpsychology.in/plans/",
    "https://wealthpsychology.in/contact-us/",
    "https://wealthpsychology.in/about-us/",
    "https://wealthpsychology.in/team/",
    "https://wealthpsychology.in/terms-of-use/",
    "https://wealthpsychology.in/privacy-policy/"
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