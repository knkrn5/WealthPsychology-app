document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.getElementById('blog-posts');
    const categoryList = document.getElementById('category-list');

    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';
    loadingContainer.className = 'loading-indicator';
    loadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';
    blogPosts.appendChild(loadingContainer);

    const categoryMapping = {
        'company-analysis': ['company analysis'],
        'cryptocurrency': ['cryptocurrency'],
        'futures-options': ['futures and option'],
        'finance-insights': ['finance insights'],
        'fundamental-analysis': ['fundamental analysis'],
        'ipo': ['ipo analysis'],
        'mutual-funds': ['mutual fund analysis'],
        'personal-finance': ['personal finance'],
        'technical-analysis': ['technical analysis'],
        'union-budget': ['union budget 2024']
    };

    let postsByCategory = {
        'all': []
    };

    const postsPerPage = 3;

    fetch('/blog')
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(blogArticles => {
            console.log(`Found ${blogArticles.length} article(s)`);
            displayBlogArticles(blogArticles);
        })
        .catch(error => {
            console.error('Error fetching or processing entries:', error);
            let errorMessage = 'Unknown error';
            if (typeof error === 'object' && error !== null) {
                errorMessage = error.details || error.message || JSON.stringify(error);
            }
            blogPosts.innerHTML = `<p>Error: ${errorMessage}</p>`;
        })
        .finally(() => {
            loadingContainer.remove();
        });

    function displayBlogArticles(articles) {
        blogPosts.innerHTML = '';
        postsByCategory = { 'all': [] };

        articles.forEach(article => {
            postsByCategory['all'].push(article);

            if (article.fields && article.fields.category) {
                let categories = Array.isArray(article.fields.category) ? article.fields.category : [article.fields.category];

                categories.forEach(category => {
                    Object.entries(categoryMapping).forEach(([categorySlug, keywords]) => {
                        if (keywords.some(keyword => category.toLowerCase().includes(keyword))) {
                            if (!postsByCategory[categorySlug]) {
                                postsByCategory[categorySlug] = [];
                            }
                            postsByCategory[categorySlug].push(article);
                        }
                    });
                });
            }
        });

        updatePostCounts();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category') || 'all';
        displayPostsByCategory(categoryFromUrl);
    }

    function createArticleExcerpt(article) {
        const publishedDate = article.fields && article.fields.publishedDate 
            ? new Date(article.fields.publishedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) 
            : 'No date';

        const authorName = article.fields && article.fields.author && article.fields.author.fields && article.fields.author.fields.name
            ? article.fields.author.fields.name
            : 'Unknown';

        const articleElement = document.createElement('article');
        articleElement.className = "article";
        articleElement.innerHTML = `
            <h2>${article.fields && (article.fields.title || article.fields.internalName) || 'No title'}</h2>
            <p>${publishedDate}</p>
            <p class="blog-author">Post By: ${authorName}</p>
            ${article.fields && article.fields.featuredImage && article.fields.featuredImage.fields 
                ? `<img src="${article.fields.featuredImage.fields.file.url}" alt="${article.fields.featuredImage.fields.title}">`
                : ''}
            <p>${article.fields && article.fields.excerpt ? article.fields.excerpt + ' [...]' : 'No excerpt available'}</p>
            <a href="/blog/post/${article.fields.slug}" class="read-more">Read More</a>
        `;
        return articleElement;
    }

    function updatePostCounts() {
        Object.entries(postsByCategory).forEach(([categorySlug, posts]) => {
            const categoryItem = categoryList.querySelector(`[blog-category="${categorySlug}"]`);
            if (categoryItem) {
                categoryItem.querySelector('.post-count').textContent = `(${posts.length})`;
            }
        });
    }

    function displayPostsByCategory(categorySlug, page = 1) {
        blogPosts.innerHTML = '';
        const categoryPosts = postsByCategory[categorySlug] || [];
        if (categoryPosts.length === 0) {
            blogPosts.innerHTML = '<p>No posts available for this category.</p>';
        } else {
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const postsToShow = categoryPosts.slice(startIndex, endIndex);

            postsToShow.forEach(article => {
                const articleExcerpt = createArticleExcerpt(article);
                blogPosts.appendChild(articleExcerpt);
            });

            const navigationDiv = document.createElement('div');
            navigationDiv.className = 'navigation-buttons';

            if (page > 1) {
                const seeLessButton = document.createElement('button');
                seeLessButton.textContent = 'See Less';
                seeLessButton.className = 'see-less-button';
                seeLessButton.addEventListener('click', () => {
                    displayPostsByCategory(categorySlug, page - 1);
                    window.scrollTo({ top: 0 });
                });
                navigationDiv.appendChild(seeLessButton);
            }

            if (endIndex < categoryPosts.length) {
                const seeMoreButton = document.createElement('button');
                seeMoreButton.textContent = 'See More';
                seeMoreButton.className = 'see-more-button';
                seeMoreButton.addEventListener('click', () => {
                    displayPostsByCategory(categorySlug, page + 1);
                    window.scrollTo({ top: 0 });
                });
                navigationDiv.appendChild(seeMoreButton);
            }

            blogPosts.appendChild(navigationDiv);
        }

        const url = new URL(window.location);
        url.searchParams.set('category', categorySlug);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url);

        categoryList.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', li.getAttribute('blog-category') === categorySlug);
        });
    }

    categoryList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (e) => {
            e.preventDefault();
            const categorySlug = li.getAttribute('blog-category');
            displayPostsByCategory(categorySlug);
        });
    });

    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category') || 'all';
        const pageFromUrl = parseInt(urlParams.get('page')) || 1;
        displayPostsByCategory(categoryFromUrl, pageFromUrl);
    });
});