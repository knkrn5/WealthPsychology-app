const recentPost = document.querySelector('.recent-posts-wrapper');
const relatedPost = document.querySelector('.related-posts-wrapper');

// Create separate loading indicators for each section
const skeletonContainer = document.createElement('div');
skeletonContainer.className = 'skeleton-container';
skeletonContainer.innerHTML = `
   <div class="skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text short"></div>
   </div>
`;

const relatedSkeletonContainer = skeletonContainer.cloneNode(true);

// Display loading indicator at the top of both sections
recentPost.appendChild(skeletonContainer);
relatedPost.appendChild(relatedSkeletonContainer);

fetch('/blog/posts')
    .then(res => res.json())
    .then(data => {

        // Loop through the first 5 posts
        data.slice(0, 5).forEach(post => {
            // console.log(post.fields.category);

            const RecentPostSideBar = createSideNewsDiv(post);
            recentPost.appendChild(RecentPostSideBar);

            // Add click event listener to navigate to the post page
            RecentPostSideBar.addEventListener('click', (event) => {
                console.log(event.target);
                window.location.href = '/blog/post/' + post.fields.slug;
            });
        });

        // Filter posts based on the category
        const filteredPosts = data.filter(post => {
            let postCategories = Array.isArray(post.fields.category) ? post.fields.category : [post.fields.category];
            // console.log(postCategories);
            return postCategories.some(category => category.toLowerCase() === postCategory.toLowerCase());
        });

        // Check if there are any filtered posts
        if (filteredPosts.length === 0) {
            relatedPost.innerHTML = "No post Found";
        } else {
            // Loop through the filtered posts and append them to relatedPost
            filteredPosts.slice(0, 5).forEach(post => {
                const RelatedPostSideBar = createSideNewsDiv(post);
                relatedPost.appendChild(RelatedPostSideBar);

                // Add click event listener to navigate to the post page
                RelatedPostSideBar.addEventListener('click', (event) => {
                    window.location.href = '/blog/post/' + post.fields.slug;
                });
            });
        }
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        skeletonContainer.remove();
        relatedSkeletonContainer.remove();
    });


function createSideNewsDiv(post) {
    // Ensure the title fallback works as expected
    const postTitle = post.fields && (post.fields.title || post.fields.internalName) || 'No title';

    // Safeguard the featured image rendering with fallback
    const featuredImage = post.fields && post.fields.featuredImage && post.fields.featuredImage.fields
        ? `<img src="${post.fields.featuredImage.fields.file.url}" alt="${post.fields.featuredImage.fields.title}">`
        : '';

    const sidePostDiv = document.createElement('div');
    sidePostDiv.className = 'side-content';
    sidePostDiv.innerHTML = `
         ${featuredImage}
         <h3>${postTitle}</h3>
        `;

    return sidePostDiv;
}


const shareButton = document.getElementById('share-button');

shareButton.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: location.href
        })
            .then(() => console.log('Content shared successfully!'))
            .catch((error) => console.error('Error sharing content:', error));
    } else {
        alert('This Share API is not supported in your browser.');
    }
});