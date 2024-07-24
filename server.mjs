import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

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
/* app.get('/blog/post/:id', async (req, res) => {
    try {
        const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts/${req.params.id}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const post = await response.json();
        res.render('post', { post });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).render('error', { message: 'Error loading blog post' });
    }
}); */

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));