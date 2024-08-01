document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.getElementById('blog-posts');
    // const apiUrl = 'http://localhost:55555/api/posts'; // this will show output in both live server and localhost
    // const apiUrl = '/api/posts'; // fetching wordpress api from the proxy server and this will only show output in localhost only
    const apiUrl = '/.netlify/functions/fetch-blogs'; // fetching netlify serverless function
    
       // Create and append loading indicator
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';
    loadingContainer.className = 'loading-indicator'; 
    loadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';
    blogPosts.appendChild(loadingContainer);

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
                let imageUrl = 'https://default-image-url.jpg'; // this is Default placeholder image
            
                if (post._embedded?.['wp:featuredmedia']?.[0]) {
                    imageUrl = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium?.source_url 
                        || post._embedded['wp:featuredmedia'][0].source_url;
                }
                            
                const article = document.createElement('article');
                article.className = 'article';
                article.innerHTML = `
                    <h2>${post.title.rendered}</h2>
                    <img src="${imageUrl}" alt="${post.title.rendered}">
                    <div>${post.excerpt.rendered}</div>
                    <p>Published on: ${new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <a href="post.html?${encodeURIComponent(post.slug)}" class="read-more">Read More...</a>
                `;
                
                blogPosts.appendChild(article);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            blogPosts.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
        })
        .finally(() => {
            // Remove loading indicator after content is loaded or on error
            loadingContainer.remove();
        });
});
