import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; //CORS (Cross-Origin Resource Sharing) is required when you want to make requests between different domains or subdomains.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes //CORS (Cross-Origin Resource Sharing) is required when you want to make requests between different domains or subdomains.
app.use(cors());

// Serve files from the root directory  - so this is the one that serves all the file from the root directory
app.use(express.static(path.join(__dirname)));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/blog', express.static(path.join(__dirname, 'blog')));


// Set EJS as the view engine
/* app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); */

//index route
/* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
}); */


// Proxy route for fetching posts
app.get('/api/posts', async (req, res) => {
    try {
      const apiUrl = 'https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Error fetching posts' });
    }
  });


// Individual post route
app.get('/blog/post/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log('Requested slug:', slug);

    const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts?slug=${encodeURIComponent(slug)}`;
    console.log('WordPress API URL:', apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

   /*  const posts = await response.json();
    console.log('WordPress API response:', JSON.stringify(posts, null, 2));

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    } */

    res.json(posts); // Send the entire array, let the client handle it
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Error loading blog post', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));