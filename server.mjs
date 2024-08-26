import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import axios from 'axios';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 55555;

// Enable CORS for all routes //CORS (Cross-Origin Resource Sharing) is required when you want to make requests between different domains or subdomains.
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Serve files from the root directory  - so this is the one that serves all the file from the root directory
app.use(express.static(path.join(__dirname)));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/blog', express.static(path.join(__dirname, 'blog')));


// Proxy route for fetching blogs 
app.get('/blog', async (req, res) => {
  try {
    const apiUrl = 'https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts?_embed';
    const response = await axios.get(apiUrl);
    
    const posts = response.data.map(post => {
      const categories = post._embedded['wp:term']
        .flat()
        .filter(term => term.taxonomy === 'category')
        .map(category => category.slug);
    
      return {
        ...post,
        categories: categories,
        featuredImageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url
          || post._embedded?.['wp:featuredmedia']?.[0]?.source_url
          || 'https://default-image-url.jpg'
      };
    });

    res.render('components/blog/blog', {
      posts: posts,
    
    });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).send('Internal Server Error');
  }
});



// Individual blog post route and ------
function decodeHtmlEntities(str) {
  return str.replace(/&#([0-9]{1,4});/g, function(match, dec) {
      return String.fromCharCode(dec);
  }).replace(/&nbsp;/g, ' '); // Replace &nbsp; with a normal space
}

app.get('/blog/post/:slug?', async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).render('error', { message: 'Post slug is required' });
  }

  const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts?slug=${encodeURIComponent(slug)}&_embed`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).render('error', { message: 'Error fetching post from WordPress API' });
    }

    const posts = await response.json();
    console.log('API Response:', posts);

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(404).render('error', { message: 'Post not found' });
    }

    const post = posts[0];
    let tags = [];

    // Check if reader_suggested_tags is present and parse it
    if (post.reader_suggested_tags) {
      try {
        tags = JSON.parse(post.reader_suggested_tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    }

    const metaKeywords = tags.length > 0 ? tags.join(', ') : 'finance, wealth, psychology';
    const decodedTitle = decodeHtmlEntities(post.title.rendered);

    res.render('components/post/post', {
      post: {
        title: { rendered: decodedTitle },
        content: { rendered: decodeHtmlEntities(post.content.rendered) },
        date: post.date
      },
      title: decodedTitle,
      metaDescription: post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").slice(0, 160),
      metaKeywords: metaKeywords,
      metaUrl: req.protocol + '://' + req.get('host') + req.originalUrl
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).render('error', { message: 'Internal Server Error' });
  }
});


// Define the proxy endpoint for finnews news
app.get('/api/finnews', async (req, res) => {
  try {
      // Fetch data from the WordPress API
      const response = await axios.get('https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyfinnews.wordpress.com/posts?_embed');
      res.json(response.data); // Send the data back to the client
  } catch (error) {
      console.error('Error fetching finance news:', error);
      res.status(500).json({ message: 'Error fetching finance news' });
  }
});


// Define the API endpoint for new article
app.get('/api/news-article/:slug', async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: 'Post slug is required' });
  }

  const fullPostUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyfinnews.wordpress.com/posts?slug=${encodeURIComponent(slug)}`;

  try {
    const response = await axios.get(fullPostUrl);
    const posts = response.data;
    
    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(posts[0]); // Send the first post found
  } catch (error) {
    console.error('Error fetching WordPress post:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// console.log('restart')

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));