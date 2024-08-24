document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');

    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';
    loadingContainer.className = 'loading-indicator';
    loadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';
    newsContainer.appendChild(loadingContainer);

    if (postSlug) {
        loadFullNewsArticle(postSlug);
    } else {
        newsContainer.innerHTML = '<p>No article specified.</p>';
    }

    function loadFullNewsArticle(postSlug) {
        
        // const fullPostUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyfinnews.wordpress.com/posts?slug=${postSlug}`;
        const fullPostUrl = `/api/news-article/${encodeURIComponent(postSlug)}`;
        
        fetch(fullPostUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let post;
                if (Array.isArray(data)) {
                    post = data[0];
                } else {
                    post = data;
                }
                
                if (!post || !post.title || !post.content) {
                    throw new Error('Invalid post data');
                }
                
                newsContainer.innerHTML = `
                    <div class="news-article-container">
                        <article class="full-news-article">
                            <h2 class="full-news-article-title">${post.title.rendered}</h2>
                            <div class="full-news-article-content">${post.content.rendered}</div>
                            <a href="finance-news.html" class="back"><i class="fa-solid fa-caret-left"></i>Back</a>
                        </article>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error fetching full post:', error);
                newsContainer.innerHTML = '<p>Failed to load the full article. Please try again later.</p>';
            })
            .finally(() => {
                loadingContainer.remove();
            });
    }
});