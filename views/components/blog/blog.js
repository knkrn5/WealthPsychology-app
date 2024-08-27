document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.getElementById('blog-posts');
    const categoryList = document.getElementById('category-list');
    
    const categoryMapping = {
        'company-analysis': ['company-analysis'],
        'cryptocurrency': ['cryptocurrency'],
        'futures-options': ['derivative-assets', 'futures-and-options'],
        'financial-insights': ['financial-insights'],
        'fundamental-analysis': ['fundamental-analysis'],
        'ipo': ['ipo-analysis'],
        'mutual-funds': ['mutual fund analysis'],
        'personal-finance': ['personal-finance'],
        'technical-analysis': ['technical-analysis'],
        'union-budget': ['union-budget-2024']
    };

    const postsPerPage = 2;
    let currentPage = 1;
    let currentCategory = 'all';

    let postsByCategory = {
        'all': Array.from(blogPosts.children)
    };

    // Initialize and categorize posts
    Object.keys(categoryMapping).forEach(category => {
        postsByCategory[category] = [];
    });

    postsByCategory['all'].forEach(post => {
        const postCategories = post.getAttribute('data-categories').split(',').map(cat => cat.trim().toLowerCase());
        
        Object.entries(categoryMapping).forEach(([frontendCategory, wordpressCategories]) => {
            if (wordpressCategories.some(wpCat => postCategories.includes(wpCat.toLowerCase()))) {
                postsByCategory[frontendCategory].push(post);
            }
        });
    });

    function displayPostsByCategory(categorySlug, page = 1) {
        const categoryPosts = postsByCategory[categorySlug] || [];
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = categoryPosts.slice(startIndex, endIndex);
        
        // Clear previous content
        blogPosts.innerHTML = categoryPosts.length ? '' : '<p>No posts available for this category.</p>';
        
        postsToShow.forEach(article => blogPosts.appendChild(article.cloneNode(true)));
        
        // Navigation buttons
        const navigationDiv = document.createElement('div');
        navigationDiv.className = 'navigation-buttons';
        
        if (page > 1) {
            const seeLessButton = document.createElement('button');
            seeLessButton.textContent = 'See Less';
            seeLessButton.className = 'see-less-button';
            seeLessButton.addEventListener('click', () => displayPostsByCategory(categorySlug, page - 1));
            navigationDiv.appendChild(seeLessButton);
        }
        
        if (endIndex < categoryPosts.length) {
            const seeMoreButton = document.createElement('button');
            seeMoreButton.textContent = 'See More';
            seeMoreButton.className = 'see-more-button';
            seeMoreButton.addEventListener('click', () => displayPostsByCategory(categorySlug, page + 1));
            navigationDiv.appendChild(seeMoreButton);
        }
        
        blogPosts.appendChild(navigationDiv);
    
        // Update URL and state
        const url = new URL(window.location);
        url.searchParams.set('category', categorySlug);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url);
    
        categoryList.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', li.getAttribute('blog-category') === categorySlug);
        });
    
        currentCategory = categorySlug;
        currentPage = page;
    
        updatePostCounts();
    }

    function updatePostCounts() {
        Object.entries(postsByCategory).forEach(([category, posts]) => {
            const listItem = categoryList.querySelector(`li[blog-category="${category}"]`);
            if (listItem) {
                const countSpan = listItem.querySelector('.post-count');
                if (countSpan) {
                    countSpan.textContent = posts.length ? `(${posts.length})` : '';
                }
            }
        });
    }

    categoryList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (e) => {
            e.preventDefault();
            displayPostsByCategory(li.getAttribute('blog-category'), 1);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        displayPostsByCategory(urlParams.get('category') || 'all', parseInt(urlParams.get('page')) || 1);
    });

    // Initial display
    displayPostsByCategory('all');
});