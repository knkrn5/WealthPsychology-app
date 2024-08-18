document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loadingContainer = document.getElementById('loading-container');
    //const apiUrl = 'https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyfinnews.wordpress.com/posts?_embed';
    const apiUrl = '/api/finnews';
    
    const categoryMapping = {
        'market-updates': 'Market Updates',
        'corporate-news': 'Corporate News',
        'economy': 'Economy',
        'fintech': 'FinTech'
    };

    function shortenExcerpt(excerpt, maxLength = 100) {
        const textOnly = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
        return textOnly.length <= maxLength ? textOnly : textOnly.substr(0, maxLength).trim() + "...";
    }

    function createArticleElement(post) {
        const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url 
            || post._embedded?.['wp:featuredmedia']?.[0]?.source_url
            || 'https://default-image-url.jpg';

        const article = document.createElement('article');
        article.className = 'news-content';
        article.innerHTML = `
            <div class="news-article" data-slug="${post.slug}">
                <img class="news-image" src="${imageUrl}" alt="${post.title.rendered}">
                <div class="news-source">${post._embedded.author[0].name || 'Author Name'}</div>
                <p class="news-date">${new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <h2 class="news-title">${post.title.rendered}</h2>
                <p class="news-excerpt">${shortenExcerpt(post.excerpt.rendered, 100)}</p>
            </div>
        `;
        return article;
    }

    function loadNewsArticles() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(posts => {
                console.log('Fetched posts:', posts);
                const categorizedPosts = {
                    'market-updates': [],
                    'corporate-news': [],
                    'economy': [],
                    'fintech': []
                };
        
                posts.forEach(post => {
                    console.log('Processing post:', post.title.rendered, 'Categories:', post._embedded['wp:term']);

                    if (Array.isArray(post.categories) && post._embedded && post._embedded['wp:term']) {
                        const postCategories = post._embedded['wp:term'][0];
                        postCategories.forEach(cat => {
                            for (const [category, displayName] of Object.entries(categoryMapping)) {
                                if (cat.name.toLowerCase() === displayName.toLowerCase()) {
                                    categorizedPosts[category].push(post);
                                    console.log('Assigned to category:', category);
                                    break;
                                }
                            }
                        });
                    }
                });
        
                console.log('Categorized posts:', categorizedPosts);
                displayCategorizedPosts(categorizedPosts);
                if (loadingContainer) loadingContainer.remove();
                setupCategoryFilters();

                // Check for category in URL
                const urlParams = new URLSearchParams(window.location.search);
                const categoryParam = urlParams.get('category');
                if (categoryParam && categoryMapping[categoryParam]) {
                    const categoryLink = document.querySelector(`.category-filter[data-category="${categoryParam}"]`);
                    if (categoryLink) {
                        categoryLink.click();
                    } else {
                        updateHeading('all');
                        updateURL('all');
                    }
                } else {
                    updateHeading('all');
                    updateURL('all');
                }
            })
            
            .catch(error => {
                console.error('Error fetching posts:', error);
                newsContainer.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
                if (loadingContainer) loadingContainer.remove();
            });
    }

    function displayCategorizedPosts(categorizedPosts) {
        console.log('Displaying categorized posts:', categorizedPosts);
        newsContainer.innerHTML = '';
        
        for (const [category, posts] of Object.entries(categorizedPosts)) {
            console.log(`Category: ${category}, Posts: ${posts.length}`);
            posts.forEach(post => {
                const articleElement = createArticleElement(post);
                articleElement.dataset.category = category; // Add category as a data attribute
                newsContainer.appendChild(articleElement);
            });
        }
        
        addArticleEventListeners();
    }
    
  
    function setupCategoryFilters() {
        const categoryLinks = document.querySelectorAll('.category-filter');
        const articles = document.querySelectorAll('.news-content');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                
                // Remove 'active' class from all links
                categoryLinks.forEach(l => l.classList.remove('dropdown-active'));
                
                if (category === 'all') {
                    articles.forEach(article => article.style.display = 'block');
                    updateHeading('all');
                    updateURL('all');
                } else {
                    this.classList.add('dropdown-active');
                    articles.forEach(article => {
                        if (article.dataset.category === category) {
                            article.style.display = 'block';
                        } else {
                            article.style.display = 'none';
                        }
                    });
                    updateHeading(category);
                    updateURL(category);
                }
            });
        });
    }

    function updateHeading(category) {
        const heading = document.getElementsByTagName('h1')[0];
        if (category === 'all') {
            heading.textContent = 'Finance News';
        } else {
            heading.textContent = categoryMapping[category] || 'Finance News';
        }
    }

    //function for URL manipulation
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
                const postSlug = article.dataset.slug;
                window.location.href = `/finance-news/news-article.html?post=${postSlug}`;
            });
        });
    }

    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.category) {
            const category = state.category;
            const categoryLink = document.querySelector(`.category-filter[data-category="${category}"]`);
            if (categoryLink) {
                categoryLink.click();
            } else {
                const articles = document.querySelectorAll('.news-content');
                if (category === 'all') {
                    articles.forEach(article => article.style.display = 'block');
                } else {
                    articles.forEach(article => {
                        if (article.dataset.category === category) {
                            article.style.display = 'block';
                        } else {
                            article.style.display = 'none';
                        }
                    });
                }
                updateHeading(category);
            }
        } else {
            // Default to showing all if no state or category is found
            updateHeading('all');
            const articles = document.querySelectorAll('.news-content');
            articles.forEach(article => article.style.display = 'block');
        }
    });

    loadNewsArticles();
});
