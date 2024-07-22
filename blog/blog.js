document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.getElementById('blog-posts');
    const apiUrl = 'https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(posts => {
            blogPosts.innerHTML = ''; // Clear existing content
            if (posts.length === 0) {
                blogPosts.innerHTML = '<p>No posts available.</p>';
                return;
            }
            posts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'article';
                article.innerHTML = `
                    <h2>${post.title.rendered}</h2>
                    <div>${post.excerpt.rendered}</div>
                    <a href="post.html?id=${post.id}" class="read-more">Read More...</a>
                `;
                blogPosts.appendChild(article);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            blogPosts.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
        });
});