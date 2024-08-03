document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.getElementById('blog-posts');
    const categoryList = document.getElementById('category-list');
    const apiUrl = '/.netlify/functions/fetch-blogs?_embed';
    
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';
    loadingContainer.className = 'loading-indicator';
    loadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';
    blogPosts.appendChild(loadingContainer);

    const categoryMapping = {
        'company-analysis': ['company analysis'],
        'cryptocurrency': ['cryptocurrency'],
        'futures-options': ['derivative assets', 'futures and option'],
        'financial-insights': ['financial insights'],
        'fundamental-analysis': ['fundamental analysis'],
        'ipo': ['ipo analysis'],
        'mutual-funds': ['mutual fund analysis'],
        'personal-finance': ['personal finance'],
        'stock-market': ['stock market blogsdefault'],
        'technical-analysis': ['technical analysis'],
        'union-budget': ['union budget 2024']
    };

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

            const postsByCategory = {
                'all': []
            };

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
                    <p>Published on: ${new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <img src="${imageUrl}" alt="${post.title.rendered}">
                    <div>${post.excerpt.rendered}</div>
                    <a href="post.html?${encodeURIComponent(post.slug)}" class="read-more">Read More...</a>
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

            categoryList.querySelectorAll('li').forEach(li => {
                li.addEventListener('click', () => {
                    const categorySlug = li.getAttribute('data-category');
                    displayPostsByCategory(categorySlug);
                });
            });

            function displayPostsByCategory(categorySlug) {
                blogPosts.innerHTML = '';
                const categoryPosts = postsByCategory[categorySlug] || [];
                if (categoryPosts.length === 0) {
                    blogPosts.innerHTML = '<p>No posts available for this category.</p>';
                } else {
                    categoryPosts.forEach(article => blogPosts.appendChild(article.cloneNode(true)));
                }
            }

            displayPostsByCategory('all');
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            blogPosts.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
        })
        .finally(() => {
            loadingContainer.remove();
        });
});