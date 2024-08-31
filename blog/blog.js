document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.getElementById('blog-posts');
    const categoryList = document.getElementById('category-list');
    const apiUrl = '/blog';

    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';
    loadingContainer.className = 'loading-indicator';
    loadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';
    blogPosts.appendChild(loadingContainer);

    const categoryMapping = {
        'company-analysis': ['company analysis'],
        'cryptocurrency': ['cryptocurrency'],
        'futures-options': ['futures and option'],
        'financial-insights': ['financial insights'],
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

    function fetchPosts() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(posts => {
                console.log('API Response:', posts);

                blogPosts.innerHTML = '';
                if (posts.length === 0) {
                    blogPosts.innerHTML = '<p>No posts available.</p>';
                    return;
                }

                posts.forEach(post => {
                    console.log('Processing post:', post.title.rendered, 'Categories:', post.categories);

                    let imageUrl = 'https://default-image-url.jpg';
                
                    if (post._embedded?.['wp:featuredmedia']?.[0]) {
                        imageUrl = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium?.source_url 
                            || post._embedded['wp:featuredmedia'][0].source_url;
                    }
                    
                    const article = document.createElement('article');
                    article.className = 'article';
                    article.innerHTML = `
                    <h2>${post.title.rendered}</h2>
                    <p>${new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p class="blog-author">Post by: ${post._embedded.author[0].name || 'Author Name'}</p>
                    <img src="${imageUrl}" alt="${post.title.rendered}">
                    <div>${post.excerpt.rendered}</div>
                    <a href="/blog/post/${encodeURIComponent(post.slug)}" class="read-more">Read More...</a>
                  `;
                  
                  
                    
                    postsByCategory['all'].push(article);

                    if (Array.isArray(post.categories) && post._embedded && post._embedded['wp:term']) {
                        const categories = post._embedded['wp:term'][0];
                        post.categories.forEach(categoryId => {
                            const category = categories.find(cat => cat.id === categoryId);
                            if (category) {
                                Object.entries(categoryMapping).forEach(([categorySlug, keywords]) => {
                                    if (keywords.some(keyword => category.name.toLowerCase().includes(keyword))) {
                                        if (!postsByCategory[categorySlug]) {
                                            postsByCategory[categorySlug] = [];
                                        }
                                        postsByCategory[categorySlug].push(article);
                                    }
                                });
                            }
                        });
                    }
                });

                console.log('Posts by Category:', postsByCategory);

                // Update post counts in the category list
                updatePostCounts();

                // Get the category from URL or default to 'all'
                const urlParams = new URLSearchParams(window.location.search);
                const categoryFromUrl = urlParams.get('category') || 'all';
                displayPostsByCategory(categoryFromUrl);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                blogPosts.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
            })
            .finally(() => {
                loadingContainer.remove();
            });
    }

    function updatePostCounts() {
        const allCount = postsByCategory['all'].length;
        categoryList.querySelector('[blog-category="all"] .post-count').textContent = `(${allCount})`;

        Object.entries(postsByCategory).forEach(([categorySlug, posts]) => {
            const categoryItem = categoryList.querySelector(`[blog-category="${categorySlug}"]`);
            if (categoryItem) {
                categoryItem.querySelector('.post-count').textContent = `(${posts.length})`;
            }
        });
    }

    function displayPostsByCategory(categorySlug, page = 1) {
        blogPosts.innerHTML = ''; // Clear all existing content
        const categoryPosts = postsByCategory[categorySlug] || [];
        if (categoryPosts.length === 0) {
            blogPosts.innerHTML = '<p>No posts available for this category.</p>';
        } else {
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const postsToShow = categoryPosts.slice(startIndex, endIndex); // Change this line
    
            postsToShow.forEach(article => blogPosts.appendChild(article.cloneNode(true)));
    
            const navigationDiv = document.createElement('div');
            navigationDiv.className = 'navigation-buttons';
    
            if (page > 1) {
                const seeLessButton = document.createElement('button');
                seeLessButton.textContent = 'See Less';
                seeLessButton.className = 'see-less-button';
                seeLessButton.addEventListener('click', () => {
                    displayPostsByCategory(categorySlug, page - 1);
                });
                navigationDiv.appendChild(seeLessButton);
            }
    
            if (endIndex < categoryPosts.length) {
                const seeMoreButton = document.createElement('button');
                seeMoreButton.textContent = 'See More';
                seeMoreButton.className = 'see-more-button';
                seeMoreButton.addEventListener('click', () => {
                    displayPostsByCategory(categorySlug, page + 1);
                });
                navigationDiv.appendChild(seeMoreButton);
            }
    
            blogPosts.appendChild(navigationDiv);
        }
    
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('category', categorySlug);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url);
    
        // Update active class on category list
        categoryList.querySelectorAll('li').forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('blog-category') === categorySlug) {
                li.classList.add('active');
            }
        });
    
    }

    
    categoryList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (e) => {
            e.preventDefault();
            const categorySlug = li.getAttribute('blog-category');
            displayPostsByCategory(categorySlug);
        });
    });

    // Initial fetch
    fetchPosts();

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category') || 'all';
        const pageFromUrl = parseInt(urlParams.get('page')) || 1;
        displayPostsByCategory(categoryFromUrl, pageFromUrl);
    });
});
