
const recentPost = document.querySelector('.recent-posts-wrapper');
const relatedPost = document.querySelector('.related-posts-wrapper');

recentPost.innerHTML = " ";

fetch('/blog/posts')
    .then(res => res.json())
    .then(data => {

        let category;

        // Loop through the first 5 posts
        data.slice(0, 5).forEach(post => {
            console.log(post.fields.category);

            const RecentPostSideBar = createSidePostDiv(post);
            recentPost.appendChild(RecentPostSideBar);

            // Add click event listener to navigate to the post page
            RecentPostSideBar.addEventListener('click', (event) => {
                console.log(event.target);
                category = post.fields.category;
                console.log(category);
                window.location.href = '/blog/post/' + post.fields.slug;
            });
        });


        const filteredPosts = data.filter(post => post.fields.category.toLowerCase() === postCategory.toLowerCase());
        

        // Check if there are any filtered posts
        if (filteredPosts.length === 0) {
            relatedPost.innerHTML = "No post Found";
        } else {
            // Loop through the filtered posts and append them to relatedPost
            filteredPosts.slice(0, 5).forEach(post => {
                console.log(post.fields.category);

                const RelatedPostSideBar = createSidePostDiv(post);
                relatedPost.appendChild(RelatedPostSideBar);


                // Add click event listener to navigate to the post page
                RelatedPostSideBar.addEventListener('click', (event) => {
                    console.log(event.target);
                    console.log(post.fields.category);
                    window.location.href = '/blog/post/' + post.fields.slug;
                });
            });
        }
    })
    .catch(err => {
        console.error(err);
    });


function createSidePostDiv(post) {
    // Ensure the title fallback works as expected
    const postTitle = post.fields && (post.fields.title || post.fields.internalName) || 'No title';

    // Safeguard the featured image rendering with fallback
    const featuredImage = post.fields && post.fields.featuredImage && post.fields.featuredImage.fields
        ? `<img src="${post.fields.featuredImage.fields.file.url}" alt="${post.fields.featuredImage.fields.title}">`
        : '';

    const sidePostDiv = document.createElement('div');
    sidePostDiv.className = 'side-post';
    sidePostDiv.innerHTML = `
         <img>${featuredImage}</img>
         <h3>${postTitle}</h3>
        `;

    /*   const sidePostClone = sidePostDiv.cloneNode(true); // Clone the element with all children (true means deep clone)
      relatedPost.appendChild(sidePostClone); // Append the clone to relatedPost */

    return sidePostDiv;
}
