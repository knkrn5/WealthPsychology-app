
document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.getElementById('post-content');
    const loadingContainer = document.getElementById('loading-container');
    const urlParams = new URLSearchParams(window.location.search);
    // const postId = urlParams.get('id'); //this fetch the data with Id in the URL
    //const postSlug = urlParams.get('slug'); //this fetch the data with slug= in the URL
    const postSlug = window.location.search.substring(1); //used to fetch data without slug= in URL

    if (!postSlug) {
        postContent.innerHTML = '<p>No post slug provided.</p>';
        loadingContainer.style.display = 'none'; // Hide loading indicator if no slug
        return;
    }

    // const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts/${postSlug}`;
    // const apiUrl = `http://localhost:55555/blog/post/${postId}`;
    // const apiUrl = `http://localhost:55555/blog/post/${encodeURIComponent(postSlug)}`;
    const apiUrl = `/.netlify/functions/fetch-posts?slug=${postSlug}`; // fetching from netlify serverless function

     // Show loading indicator
     loadingContainer.style.display = 'block';

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
            // Hide loading indicator after content is loaded
            loadingContainer.style.display = 'none';
        })
        .finally(() => {
            // Remove loading indicator after content is loaded or on error
            loadingContainer.remove();
        });
});


