
document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.getElementById('post-content');
    const urlParams = new URLSearchParams(window.location.search);
    // const postSlug = urlParams.get('slug');
    const postSlug = window.location.search.substring(1); 

    if (!postSlug) {
        postContent.innerHTML = '<p>No post slug provided.</p>';
        return;
    }

    // const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts/${postId}`;
    // const apiUrl = `http://localhost:3000/blog/post/${postId}`;
    const apiUrl = `/.netlify/functions/fetch-posts?slug=${postSlug}`; // fetching from netlify serverless function


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(post => {
            document.title = post.title.rendered + ' - WealthPsychology';
            postContent.innerHTML = `
                <article class="full-article">
                    <h2>${post.title.rendered}</h2>
                    <div>${post.content.rendered}</div>
                    <a href="blog.html" class="back"><i class="fa-solid fa-caret-left"></i>Back</a>
                </article>
            `;
        })
        .catch(error => {
            console.error('Error fetching full post:', error);
            postContent.innerHTML = '<p>Failed to load the full article. Please try again later.</p>';
        });
});