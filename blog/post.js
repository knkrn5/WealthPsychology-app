
document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.getElementById('post-content');
    const urlParams = new URLSearchParams(window.location.search);
    // const postId = urlParams.get('id'); //this fetch the data with Id in the URL
    //const postSlug = urlParams.get('slug'); //this fetch the data with slug= in the URL
    const postSlug = window.location.search.substring(1); //used to fetch data without slug= in URL

    if (!postSlug) {
        postContent.innerHTML = '<p>No post slug provided.</p>';
        return;
    }

    // const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts/${postSlug}`;
    // const apiUrl = `http://localhost:5000/blog/post/${postId}`;
    const apiUrl = `http://localhost:8000/blog/post/${encodeURIComponent(postSlug)}`;
    // const apiUrl = `/.netlify/functions/fetch-posts?slug=${postSlug}`; // fetching from netlify serverless function


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(postData => {
            // console.log('Received post data:', JSON.stringify(postData, null, 2));

            if (!postData || typeof postData !== 'object') {
                throw new Error('Invalid post data received');
            }

            // Extract the actual post data from the response
            const post = postData[0] || {};

            const title = post.title && post.title.rendered ? post.title.rendered : 'Untitled';
            const content = post.content && post.content.rendered ? post.content.rendered : 'No content available';

          /* console.log('Processed title:', title);
            console.log('Processed content:', content); */

            document.title = title + ' - WealthPsychology';
            postContent.innerHTML = `
                <article class="full-article">
                    <h2>${title}</h2>
                    <div>${content}</div>
                    <a href="blog.html" class="back"><i class="fa-solid fa-caret-left"></i>Back</a>
                </article>
            `;
        })
        .catch(error => {
            console.error('Error fetching full post:', error);
            postContent.innerHTML = '<p>Failed to load the full article. Please try again later.</p>';
        });
});


