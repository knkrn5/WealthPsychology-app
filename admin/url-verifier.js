const urls = [
    "https://wealthpsychology.in/index.html",
    "https://wealthpsychology.in/modules/stock-market/stock-market.html",
    "https://wealthpsychology.in/modules/mutual-funds/mutual-funds.html",
    "https://wealthpsychology.in/modules/fundamental-analysis/fundamental-analysis.html",
    "https://wealthpsychology.in/modules/technical-analysis/technical-analysis.html",
    "https://wealthpsychology.in/modules/ipo-analysis/ipo-analysis.html",
    "https://wealthpsychology.in/modules/economic-analysis/economic-analysis.html",
    "https://wealthpsychology.in/modules/sector-analysis/sector-analysis.html",
    "https://wealthpsychology.in/modules/money-market/money-market.html",
    "https://wealthpsychology.in/modules/concentrated-investing/concentrated-investing.html",
    "https://wealthpsychology.in/modules/cryptocurrency/cryptocurrency.html",
    "https://wealthpsychology.in/finance-news/",
    "https://wealthpsychology.in/blog/",
    "https://wealthpsychology.in/financial-calculators/",
    "https://wealthpsychology.in/financial-calculators/simple-interest-calculator/simple-interest-calculator.html",
    "https://wealthpsychology.in/financial-calculators/reverse-simple-interest-calculator/reverse-simple-interest-calculator.html",
    "https://wealthpsychology.in/financial-calculators/cagr-calculator/cagr-calculator.html",
    "https://wealthpsychology.in/financial-calculators/reverse-cagr-calculator/reverse-cagr-calculator.html",
    "https://wealthpsychology.in/plans/",
    "https://wealthpsychology.in/quizzes/quizzes.html?quiz=beginner-level",
    "https://wealthpsychology.in/quizzes/quizzes.html?quiz=intermediate-level",
    "https://wealthpsychology.in/quizzes/quizzes.html?quiz=advance-level",
    "https://wealthpsychology.in/contact-us/",
    "https://wealthpsychology.in/about-us/",
    "https://wealthpsychology.in/team/",
    "https://wealthpsychology.in/terms-of-use/",
    "https://wealthpsychology.in/privacy-policy/"
];

urls.forEach(url => {
    fetch(url)
        .then(response => {
            console.log(`${url}: ${response.status}`);
        })
        .catch(error => {
            console.log(`${url}: Error ${error}`);
        });
});