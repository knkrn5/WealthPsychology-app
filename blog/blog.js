document.addEventListener('DOMContentLoaded', () => {
    const blogPostsLeftContainer = document.getElementById('blog-posts-left-container');
    const categoryList = document.getElementById('category-list');

    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';
    loadingContainer.className = 'loading-indicator';
    loadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';
    blogPostsLeftContainer.appendChild(loadingContainer);

    const categoryMapping = {
        'company-analysis': ['company analysis'],
        'cryptocurrency': ['cryptocurrency'],
        'futures-options': ['futures and option'],
        'finance-insights': ['finance insights'],
        'fundamental-analysis': ['fundamental analysis'],
        'ipo': ['ipo analysis', 'ipo review'],
        'mutual-funds': ['mutual fund analysis'],
        'personal-finance': ['personal finance'],
        'technical-analysis': ['technical analysis'],
        'union-budget': ['union budget']
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
        .then(blogPosts => {
            console.log(`Found ${blogPosts.length} post(s)`);
            displayBlogPosts(blogPosts);
        })
        .catch(error => {
            console.error('Error fetching or processing entries:', error);
            let errorMessage = 'Unknown error';
            if (typeof error === 'object' && error !== null) {
                errorMessage = error.details || error.message || JSON.stringify(error);
            }
            blogPostsLeftContainer.innerHTML = `<p>Error: ${errorMessage}</p>`;
        })
        .finally(() => {
            loadingContainer.remove();
        });

    function displayBlogPosts(posts) {
        blogPostsLeftContainer.innerHTML = '';
        postsByCategory = { 'all': [] };

        posts.forEach(post => {
            postsByCategory['all'].push(post);

            if (post.fields && post.fields.category) {
                let categories = Array.isArray(post.fields.category) ? post.fields.category : [post.fields.category];

                categories.forEach(category => {
                    Object.entries(categoryMapping).forEach(([categorySlug, keywords]) => {
                        if (keywords.some(keyword => category.toLowerCase().includes(keyword))) {
                            if (!postsByCategory[categorySlug]) {
                                postsByCategory[categorySlug] = [];
                            }
                            postsByCategory[categorySlug].push(post);
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

    function createPostExcerpt(post) {
        const publishedDate = post.fields && post.fields.publishedDate 
            ? new Date(post.fields.publishedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) 
            : 'No date';

        const authorName = post.fields && post.fields.author && post.fields.author.fields && post.fields.author.fields.name
            ? post.fields.author.fields.name
            : 'WealthPsychology';

        const postElement = document.createElement('article');
        postElement.className = "post";
        postElement.innerHTML = `
            <h2>${post.fields && (post.fields.title || post.fields.internalName) || 'No title'}</h2>
            <p>${publishedDate}</p>
            <p class="blog-author">Post By: ${authorName}</p>
            ${post.fields && post.fields.featuredImage && post.fields.featuredImage.fields 
                ? `<img src="${post.fields.featuredImage.fields.file.url}" alt="${post.fields.featuredImage.fields.title}">`
                : ''}
            <p>${post.fields && post.fields.excerpt ? post.fields.excerpt + ' [...]' : 'No excerpt available'}</p>
            <a href="/blog/post/${post.fields.slug}" class="read-more">Read More</a>
        `;
        return postElement;
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
        blogPostsLeftContainer.innerHTML = '';
        const categoryPosts = postsByCategory[categorySlug] || [];
        if (categoryPosts.length === 0) {
            blogPostsLeftContainer.innerHTML = '<p>No posts available for this category.</p>';
        } else {
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const postsToShow = categoryPosts.slice(startIndex, endIndex);

            postsToShow.forEach(post => {
                const postExcerpt = createPostExcerpt(post);
                blogPostsLeftContainer.appendChild(postExcerpt);
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

            blogPostsLeftContainer.appendChild(navigationDiv);
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
