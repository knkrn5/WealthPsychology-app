
const recentNews = document.querySelector('.recent-news-wrapper');
const relatedNews = document.querySelector('.related-news-wrapper');

// Create separate loading indicators for each section
const recentLoadingContainer = document.createElement('div');
recentLoadingContainer.id = 'loading-container';
recentLoadingContainer.className = 'loading-indicator';
recentLoadingContainer.innerHTML = '<i class="fa-solid fa-spinner"></i><p>Loading...</p>';

const relatedLoadingContainer = recentLoadingContainer.cloneNode(true);

// Display loading indicator at the top of both sections
recentNews.appendChild(recentLoadingContainer);
relatedNews.appendChild(relatedLoadingContainer);

fetch('/finnews')
    .then(response => response.json())
    .then((data) => {
        console.log(data);

        data.forEach((article) => {
            console.log(article);

            const RecentNewsSideBar = createSideNewsDiv(article);
            recentNews.appendChild(RecentNewsSideBar);

            RecentNewsSideBar.addEventListener('click', () => {
                // window.location.href = `/news-article/${article.fields.slug}`
                window.location.href = `/news-article/` + article.fields.slug;
            })
        })

        const filteredArticle = data.filter(article => {
            let articleCategories = Array.isArray(article.fields.category) ? article.fields.category : [article.fields.category];
            console.log(articleCategories);
            return articleCategories.some(category => category.toLowerCase() === articleCategory.toLowerCase());
        });

        filteredArticle.forEach(article => {
            const RelatedNewsSideBar = createSideNewsDiv(article);
            relatedNews.appendChild(RelatedNewsSideBar);

            RelatedNewsSideBar.addEventListener('click', () => {
                // window.location.href = `/news-article/${article.fields.slug}`
                window.location.href = `/news-article/` + article.fields.slug;
            })
        })


    })
    .catch((error) => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Remove loading indicator after content is loaded
        recentLoadingContainer.remove();
        relatedLoadingContainer.remove();
    });


function createSideNewsDiv(article) {
    // Ensure the title fallback works as expected
    const NewsTitle = article.fields && (article.fields.title || article.fields.internalName) || 'No title';

    // Safeguard the featured image rendering with fallback
    const featuredImage = article.fields && article.fields.featuredImage && article.fields.featuredImage.fields
        ? `<img src="${article.fields.featuredImage.fields.file.url}" alt="${article.fields.featuredImage.fields.title}">`
        : '';

    const sideNewsDiv = document.createElement('div');
    sideNewsDiv.className = 'side-content';
    sideNewsDiv.innerHTML = `
             ${featuredImage}
             <h3>${NewsTitle}</h3>
            `;

    return sideNewsDiv;
}