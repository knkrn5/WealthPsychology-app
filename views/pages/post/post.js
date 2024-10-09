const recentPost = document.querySelector('.recent-posts-wrapper');
const relatedPost = document.querySelector('.related-posts-wrapper');

// Create separate loading indicators for each section
const recentLoadingContainer = document.createElement('div');
recentLoadingContainer.id = 'loading-container';
recentLoadingContainer.className = 'loading-indicator';
recentLoadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';

const relatedLoadingContainer = recentLoadingContainer.cloneNode(true); 

// Display loading indicator at the top of both sections
recentPost.appendChild(recentLoadingContainer);
relatedPost.appendChild(relatedLoadingContainer); 

fetch('/blog/posts')
    .then(res => res.json())
    .then(data => {

        // Loop through the first 5 posts
        data.slice(0, 5).forEach(post => {
            console.log(post.fields.category);

            const RecentPostSideBar = createSideNewsDiv(post);
            recentPost.appendChild(RecentPostSideBar);

            // Add click event listener to navigate to the post page
            RecentPostSideBar.addEventListener('click', (event) => {
                console.log(event.target);
                window.location.href = '/blog/post/' + post.fields.slug;
            });
        });

        // Log and filter posts based on the category
        console.log(postCategory.toUpperCase());
        const filteredPosts = data.filter(post => post.fields.category.toLowerCase() === postCategory.toLowerCase());

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
        // Remove loading indicator after content is loaded
        recentLoadingContainer.remove(); 
        relatedLoadingContainer.remove(); 
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
