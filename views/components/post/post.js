document.addEventListener('DOMContentLoaded', () => {
    const articleElement = document.querySelector('#post-content .full-article');
    const loadingContainer = document.getElementById('loading-container');

    // Hide loading indicator and show content
    loadingContainer.style.display = 'none';
    articleElement.style.display = 'block';
});