const postDate = new Date();
const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
const optionsTime = { hour: '2-digit', minute: '2-digit' };

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('post-date').textContent = postDate.toLocaleDateString(undefined, optionsDate);
    document.getElementById('post-time').textContent = postDate.toLocaleTimeString(undefined, optionsTime);
});
