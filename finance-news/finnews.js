document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loadingContainer = document.getElementById('loading-container');
    const apiUrl = '/finnews';
    
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

        const categories = post._embedded['wp:term'][0].map(cat => cat.name).join(', ');

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
                
                displayAllPosts(posts);
                
                if (loadingContainer) loadingContainer.remove();
                setupCategoryFilters(posts);

                // Check for category in URL
                const urlParams = new URLSearchParams(window.location.search);
                const categoryParam = urlParams.get('category');
                if (categoryParam && categoryMapping[categoryParam]) {
                    filterByCategory(posts, categoryParam);
                    updateHeading(categoryParam);
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

    function displayAllPosts(posts) {
        newsContainer.innerHTML = '';
        posts.forEach(post => {
            const articleElement = createArticleElement(post);
            newsContainer.appendChild(articleElement);
        });
        addArticleEventListeners();
    }

    function setupCategoryFilters(posts) {
        const categoryLinks = document.querySelectorAll('.category-filter');
        const mainFinanceNewsLink = document.querySelector('a.active');
        
        // Handle main "Finance News" link
        mainFinanceNewsLink.addEventListener('click', function(e) {
            e.preventDefault();
            displayAllPosts(posts);
            updateHeading('all');
            updateURL('all');
            // Remove 'dropdown-active' class from all category links
            categoryLinks.forEach(l => l.classList.remove('dropdown-active'));
        });
    
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                
                // Remove 'dropdown-active' class from all links
                categoryLinks.forEach(l => l.classList.remove('dropdown-active'));
                
                if (category === 'all') {
                    displayAllPosts(posts);
                    updateHeading('all');
                    updateURL('all');
                } else {
                    // Add 'dropdown-active' class to clicked link
                    this.classList.add('dropdown-active');
                    filterByCategory(posts, category);
                    updateHeading(category);
                    updateURL(category);
                }
            });
        });
    }

    function filterByCategory(posts, category) {
        const filteredPosts = posts.filter(post => {
            if (post._embedded && post._embedded['wp:term']) {
                const postCategories = post._embedded['wp:term'][0];
                return postCategories.some(cat => cat.name.toLowerCase() === categoryMapping[category].toLowerCase());
            }
            return false;
        });

        newsContainer.innerHTML = '';
        filteredPosts.forEach(post => {
            const articleElement = createArticleElement(post);
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
                const postSlug = article.dataset.slug;
                window.location.href = `/news-article/${postSlug}`;
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
                updateHeading(category);
                loadNewsArticles(); // Reload all articles and then filter
            }
        } else {
            updateHeading('all');
            loadNewsArticles(); // Reload all articles
        }
    });

    loadNewsArticles();
});