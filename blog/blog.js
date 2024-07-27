document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.getElementById('blog-posts');
    // const apiUrl = 'http://localhost:1000/api/posts'; // this will show output in both live server and localhost
    // const apiUrl = '/api/posts'; // fetching wordpress api from the proxy server and this will only show output in localhost only
    const apiUrl = '/.netlify/functions/fetch-blogs'; // fetching netlify serverless function
    

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
                blogPosts.innerHTML = '<p>No blogs available.</p>';
                return;
            }
            /* posts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'article';
                article.innerHTML = `
                    <h2>${post.title.rendered}</h2>
                    <img src="${post.featured_image_url}" alt="${post.title.rendered}">
                    <div>${post.excerpt.rendered}</div>
                    <p>Published on: ${new Date(post.date).toLocaleDateString()}</p>
                    <a href="post.html?id=${post.id}" class="read-more">Read More...</a>
                `;
                blogPosts.appendChild(article);
            }); */

            posts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'article';
                article.innerHTML = `
                <h2>${post.title.rendered}</h2>
                <img src="${post.featured_image_url}" alt="${post.title.rendered}">
                <div>${post.excerpt.rendered}</div>
                <p>Published on: ${new Date(post.date).toLocaleDateString()}</p>
                <a href="post.html?${encodeURIComponent(post.slug)}" class="read-more">Read More...</a>
            `;
                blogPosts.appendChild(article);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            blogPosts.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
        });
});
