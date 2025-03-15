const recentPost = document.querySelector('.recent-posts-wrapper');
const relatedPost = document.querySelector('.related-posts-wrapper');

// Ensure containers exist before appending
if (!recentPost || !relatedPost) {
    console.error("Post containers not found!");
} else {
    const skeletonContainer = createSkeletonLoader();
    const relatedSkeletonContainer = createSkeletonLoader();

    recentPost.appendChild(skeletonContainer);
    relatedPost.appendChild(relatedSkeletonContainer);

    fetch('/blog/posts')
        .then(res => res.json())
        .then(data => {
            data.slice(0, 5).forEach(post => {
                const RecentPostSideBar = createSideNewsDiv(post);
                recentPost.appendChild(RecentPostSideBar);

                RecentPostSideBar.addEventListener('click', (event) => {
                    console.log(event.target);
                    window.location.href = '/blog/post/' + post.fields.slug;
                });
            });


            const filteredPosts = data.filter(post => {
                console.log(post)
                let postCategories = Array.isArray(post.fields.category) ? post.fields.category : [post.fields.category];
                // return postCategories.some(category => category.toLowerCase() === postCategory.toLowerCase());
                return postCategories.some(category => category.toLowerCase() === 'technical analysis');
            });

            relatedSkeletonContainer.remove();

            if (filteredPosts.length === 0) {
                relatedPost.innerHTML = "<p>No post Found</p>";
            } else {
                filteredPosts.slice(0, 5).forEach(post => {
                    const RelatedPostSideBar = createSideNewsDiv(post);
                    relatedPost.appendChild(RelatedPostSideBar);

                    RelatedPostSideBar.addEventListener('click', () => {
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

    function createSkeletonLoader() {
        const div = document.createElement('div');
        div.className = 'skeleton-container';
        div.innerHTML = `
            <div class="skeleton">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `;
        return div;
    }

    function createSideNewsDiv(post) {
        const postTitle = post.fields?.title || post.fields?.internalName || 'No title';
        const featuredImage = post.fields?.featuredImage?.fields?.file?.url
            ? `<img src="${post.fields.featuredImage.fields.file.url}" alt="${post.fields.featuredImage.fields.title}">`
            : '';

        const sidePostDiv = document.createElement('div');
        sidePostDiv.className = 'side-content';
        sidePostDiv.innerHTML = `${featuredImage}<h3>${postTitle}</h3>`;
        return sidePostDiv;
    }

    const shareButton = document.getElementById('share-button');
    if (shareButton) {
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
    }
}
