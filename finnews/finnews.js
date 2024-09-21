document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loadingContainer = document.getElementById('loading-container');
    
    const categoryMapping = {
        'market-updates': 'Market Updates',
        'corporate-news': 'Corporate News',
        'economy': 'Economy',
        'fintech': 'FinTech'
    };

    let articlesByCategory = {};

    function loadNewsArticles() {
        fetch('/finnews')
            .then(response => response.json())
            .then(items => {
                console.log('Fetched items:', items);
                
                const articles = items.map(item => item.fields);
                displayNewsArticles(articles);
                displayAllArticles(articles);
                
                if (loadingContainer) 
                     loadingContainer.remove();
                setupCategoryFilters(articles);

                // Check for category in URL
                const urlParams = new URLSearchParams(window.location.search);
                const categoryParam = urlParams.get('category');
                if (categoryParam && categoryMapping[categoryParam]) {
                    filterByCategory(articles, categoryParam);
                    updateHeading(categoryParam);
                } else {
                    updateHeading('all');
                    updateURL('all');
                }
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                newsContainer.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
                if (loadingContainer) loadingContainer.remove();
            });
    }

    function displayNewsArticles(articles) {
        newsContainer.innerHTML = '';
        articlesByCategory = { 'all': [] };
        articles.forEach(article => {
            articlesByCategory['all'].push(article);
            if (article.category) {
                let categories = Array.isArray(article.category) ? article.category : [article.category];
                categories.forEach(category => {
                    Object.entries(categoryMapping).forEach(([categorySlug, categoryName]) => {
                        if (category.toLowerCase() === categoryName.toLowerCase()) {
                            if (!articlesByCategory[categorySlug]) {
                                articlesByCategory[categorySlug] = [];
                            }
                            articlesByCategory[categorySlug].push(article);
                        }
                    });
                });
            }
        });
        // updateArticleCounts();
    }

   /*  function updateArticleCounts() {
        Object.entries(categoryMapping).forEach(([categorySlug, categoryName]) => {
            const countElement = document.querySelector(`.category-filter[data-category="${categorySlug}"] .count`);
            if (countElement) {
                countElement.textContent = articlesByCategory[categorySlug] ? articlesByCategory[categorySlug].length : 0;
            }
        });
    } */

    function displayAllArticles(articles) {
        newsContainer.innerHTML = '';
        articles.forEach(article => {
            const articleElement = createArticleElement(article);
            newsContainer.appendChild(articleElement);
        });
        addArticleEventListeners();
    }

    function shortenExcerpt(excerpt, maxLength = 100) {
        const textOnly = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
        return textOnly.length <= maxLength ? textOnly : textOnly.substr(0, maxLength).trim() + "...";
    }

    function createArticleElement(article) {
        const featuredImage = article.featuredImage?.fields?.file?.url || 'https://default-image-url.jpg';

        const authorName = article.author && article.author.fields && article.author.fields.name
            ? article.author.fields.name
            : 'WealthPsychology';

        const categories = article.category ? (Array.isArray(article.category) ? article.category.join(', ') : article.category) : '';

        const articleElem = document.createElement('article');
        articleElem.className = 'news-content';
        articleElem.innerHTML = `
            <div class="news-article" data-slug="${article.slug}">
                <img class="news-image" src="${featuredImage}" alt="${article.title}">
                <p class="news-source">${authorName}</p>
                <p class="news-date">${new Date(article.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <h2 class="news-title">${article.title}</h2>
                <p class="news-excerpt">${shortenExcerpt(article.excerpt || '', 100)}</p>
            </div>
        `;
        return articleElem;
    }

    function setupCategoryFilters(articles) {
        const categoryLinks = document.querySelectorAll('.category-filter');
        const mainFinanceNewsLink = document.querySelector('.dropdown > a.active');
        
        mainFinanceNewsLink.addEventListener('click', function(e) {
            e.preventDefault();
            displayAllArticles(articlesByCategory['all']);
            updateHeading('all');
            updateURL('all');
            categoryLinks.forEach(l => l.classList.remove('dropdown-active'));
        });
    
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                
                categoryLinks.forEach(l => l.classList.remove('dropdown-active'));
                
                if (category === 'all') {
                    displayAllArticles(articlesByCategory['all']);
                    updateHeading('all');
                    updateURL('all');
                } else {
                    this.classList.add('dropdown-active');
                    filterByCategory(category);
                    updateHeading(category);
                    updateURL(category);
                }
            });
        });
    }

    function filterByCategory(category) {
        const filteredArticles = articlesByCategory[category] || [];

        newsContainer.innerHTML = '';
        filteredArticles.forEach(article => {
            const articleElement = createArticleElement(article);
            newsContainer.appendChild(articleElement);
        });
        addArticleEventListeners();
    }

    function updateHeading(category) {
        const heading = document.getElementsByTagName('h1')[0];
        if (category === 'all') {
            heading.textContent = 'Finance News';
        } else {
            heading.textContent = categoryMapping[category] || 'Finance News';
        }
    }

    function updateURL(category) {
        if (category === 'all') {
            history.pushState({ category: 'all' }, '', window.location.pathname);
        } else {
            history.pushState({ category }, '', `${window.location.pathname}?category=${category}`);
        }
    }

    function addArticleEventListeners() {
        document.querySelectorAll('.news-article').forEach(article => {
            article.addEventListener('click', (e) => {
                e.preventDefault();
                const articleSlug = article.dataset.slug;
                window.location.href = `/news-article/${articleSlug}`;
            });
        });
    }

    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.category) {
            const category = state.category;
            const categoryLink = document.querySelector(`.category-filter[data-category="${category}"]`);
            if (categoryLink) {
                categoryLink.click();
            } else {
                updateHeading(category);
                loadNewsArticles();
            }
        } else {
            updateHeading('all');
            loadNewsArticles();
        }
    });

    loadNewsArticles();
});
