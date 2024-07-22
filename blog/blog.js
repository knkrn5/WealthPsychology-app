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
          //  blogPosts.innerHTML = ''; // Clear existing content
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
                    <a href="#" class="read-more" data-id="${post.id}">Read More...</a>
                `;
                blogPosts.appendChild(article);
            });

            // Add event listeners to "Read more" links
            document.querySelectorAll('.read-more').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadFullPost(e.target.dataset.id);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            blogPosts.innerHTML = '<p>Failed to load news articles. Please try again later.</p>';
        });
});

function loadFullPost(postId) {
    const blogPosts = document.getElementById('blog-posts');
    const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts/${postId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(post => {
            blogPosts.innerHTML = `
                <article class="full-article">
                    <h2>${post.title.rendered}</h2>
                    <div>${post.content.rendered}</div>
                    <a href="#" class="back"><i class="fa-solid fa-caret-left"></i>Back</a>
                </article>
            `;

            // Add event listener to "Back to list" link
            document.querySelector('.back').addEventListener('click', (e) => {
                e.preventDefault();
                location.reload(); // This will reload the page, showing the list of posts again
            });
        })
        .catch(error => {
            console.error('Error fetching full post:', error);
            blogPosts.innerHTML = '<p>Failed to load the full article. Please try again later.</p>';
        });
}
