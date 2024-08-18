import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 55555;

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


// Proxy route for fetching blogs 
app.get('/api/blogs', async (req, res) => {
  try {
    const apiUrl = 'https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts?_embed';
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error fetching posts' });
    }
    
    const posts = await response.json();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Individual blog post route
app.get('/api/blog/post/:slug?', async (req, res) => {
  const { slug } = req.params;

  // Log the slug to ensure it is being received correctly
  console.log("Received slug:", slug);

  if (!slug) {
      return res.status(400).json({ error: 'Post slug is required' });
  }

  const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts?slug=${encodeURIComponent(slug)}`;

  try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
          return res.status(response.status).json({ error: 'Error fetching post from WordPress API' });
      }

      const posts = await response.json();
      if (!Array.isArray(posts) || posts.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json(posts[0]);

  } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));