function searchPosts() {
    const searchInput = document.querySelector('.search-container .inputBox');
    searchInput.addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase();
        console.log(searchValue);
        const filteredPosts = postsByCategory['all'].filter(posts => {
          return (posts.fields.title.includes("searchValue") || posts.fields.tags.includes("searchvalue"))
        });
        displayPostsByCategory(filteredPosts);
    });
}
searchPosts()