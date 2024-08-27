import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import axios from 'axios';
import { decode } from 'html-entities';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 55555;

app.set('trust proxy', true);

// Enable CORS for all routes
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve files from the root directory  - so this is the one that serves all the file from the root directory
app.use(express.static(path.join(__dirname)));


// Proxy route for fetching blogs 
app.get('/blog', async (req, res) => {
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

    // Parse reader_suggested_tags
    if (post.reader_suggested_tags) {
      try {
        tags = JSON.parse(post.reader_suggested_tags);
      } catch (e) {
        console.error('Error parsing reader_suggested_tags:', e);
      }
    }

    // If reader_suggested_tags parsing failed or is empty, try to get tags from _embedded
    if (tags.length === 0 && post._embedded && post._embedded['wp:term']) {
      const tagTerms = post._embedded['wp:term'].find(terms => terms[0] && terms[0].taxonomy === 'post_tag');
      if (tagTerms) {
        tags = tagTerms.map(tag => tag.name);
      }
    }

    const metaKeywords = tags.length > 0 ? tags.join(', ') : 'finance, wealth, psychology';
    const decodedTitle = decode(post.title.rendered);
    const decodedContent = decode(post.content.rendered);
    const metaDescription = decode(post.excerpt.rendered).replace(/(<([^>]+)>)/gi, "").slice(0, 160);

    // Determine the protocol
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fullUrl = `${protocol}://${req.get('host')}${req.originalUrl}`;

    res.render('components/post/post', {
      post: {
        title: { rendered: decodedTitle },
        content: { rendered: decodedContent },
        date: post.date
      },
      title: decodedTitle,
      metaDescription: metaDescription,
      metaKeywords: metaKeywords,
      blogUrl: fullUrl.replace(/^http:/, 'https:') // Replace http with https
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).render('error', { message: 'Internal Server Error' });
  }
});


// Define the proxy endpoint for finance news
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
app.get('/news-article/:postSlug', async (req, res) => {
  const postSlug = req.params.postSlug;

  try {
    const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyfinnews.wordpress.com/posts?slug=${encodeURIComponent(postSlug)}`);
    const data = await response.json();

    if (!response.ok || !data.length) {
      throw new Error('Post not found');
    }

    const post = {
      title: decode(data[0].title.rendered), // Decode the title
      content: decode(data[0].content.rendered), // Decode the content
      description: decode(data[0].excerpt.rendered), // Decode the description/excerpt
      keywords: 'Finance News, Stock Market, Corporate Financial News, Market Updates, FinTech, Economic Insights, WealthPsychology',
      author: 'WealthPsychology, karan',
      imageUrl: '/global/imgs/logo.webp',
      
      // Determine the protocol
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`.replace(/^http:/, 'https:') // Replace http with https
    };

    res.render('components/finance-news/news-article', { post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Failed to load the article. Please try again later.');
  }
});


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
