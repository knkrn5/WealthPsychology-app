import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import axios from 'axios';
import { decode } from 'html-entities';
import contentful from 'contentful';
import CircularJSON from 'circular-json';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 55555;

// Enable CORS for all routes
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve files from the root directory
app.use(express.static(path.join(__dirname)));


// Initialize Contentful client
const client = contentful.createClient({
  space: 'ucfnymwo68v4',
  accessToken: 'pbXCDRwNaD33p8dj3lhOKAJLSezMtbGF4Q9g3-sn10Y'
});

//proxy for contentful cms for blog
app.get('/blog', async (req, res) => {
  console.log('Received request for /blog');
  try {
    console.log('Attempting to fetch entries from Contentful');
    const response = await client.getEntries({
      content_type: 'pageBlogPost',
      order: '-fields.publishedDate'
    });
    
    // Use a custom serializer to handle circular references
    const safeResponse = CircularJSON.stringify(response.items);
    res.send(safeResponse);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
       error: 'Failed to fetch blog articles',
       details: error.message,
      stack: error.stack
    });
  }
});


// Function to fetch a post by its slug and render rich text including assets and links
export async function fetchPostBySlug(slug) {
  try {
    const entries = await client.getEntries({
      content_type: 'pageBlogPost',
      'fields.slug': slug,
      limit: 1,
      include: 2, // Include linked assets
    });

    if (entries.items.length > 0) {
      const post = entries.items[0];
      
      // Render rich text with custom rendering for embedded assets and hyperlinks
      if (post.fields.content) {
        const options = {
          renderNode: {
            // Handle embedded assets (images)
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
              const assetUrl = node.data.target.fields.file.url;
              const assetAlt = node.data.target.fields.title || 'Embedded Image';
              return `<img class="rich-asset" src="${assetUrl}" alt="${assetAlt}" />`;
            },
            // Handle links
            [INLINES.HYPERLINK]: (node) => {
              const url = node.data.uri;
              const linkText = node.content[0].value; // Get the text for the link
              return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            }
          },
        };
        post.fields.renderPostRichTextHtml = documentToHtmlString(post.fields.content, options);
      }

      return post;
    }
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}


// Individual blog post route
app.get('/blog/post/:slug', async (req, res) => {
  try {
    const postSlug = req.params.slug;
    const post = await fetchPostBySlug(postSlug);

    // Check if the post was found
    if (!post) {
      return res.status(404).render('error', {
        message: 'Post not found',
        error: { status: 404, stack: '' }
      });
    }

    // Safely get the image URL with a fallback to a default image
    const imageUrl = post.fields && post.fields.featuredImage && post.fields.featuredImage.fields && post.fields.featuredImage.fields.file
      ? post.fields.featuredImage.fields.file.url
      : 'https://wealthpsychology.in/global/imgs/logo.webp';

    // Determine the protocol and construct the full URL for the blog post
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fullUrl = `${protocol}://${req.get('host')}${req.originalUrl}`;

    // Render the post.ejs template with the full post content
    res.render('components/post/post', {
      post: post.fields,
      title: post.fields.title || 'Untitled Post',
      metaDescription: post.fields.excerpt || '',
      metaKeywords: post.fields.tags || ['finance', 'trading', 'investing', 'wealthpsychology', 'blog'],
      imageUrl: imageUrl,
      blogUrl: fullUrl.replace(/^http:/, 'https:'), // Replace http with https
      renderPostRichTextHtml: post.fields.renderPostRichTextHtml || '' // Ensure rendered HTML is available
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).render('error', {
      message: 'Error loading post',
      error: { status: 500, stack: process.env.NODE_ENV === 'development' ? error.stack : '' }
    });
  }
});


// Define the proxy endpoint for finance news
app.get('/finnews', async (req, res) => {
  try {
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
    const response = await axios.get(`https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyfinnews.wordpress.com/posts?slug=${encodeURIComponent(postSlug)}&_embed`);
    const data = response.data;

    if (!data.length) {
      throw new Error('Post not found');
    }

    // Safely get the image URL, with a fallback to a default image if necessary
    const imageUrl = data[0]._embedded && data[0]._embedded['wp:featuredmedia'] && data[0]._embedded['wp:featuredmedia'][0] && data[0]._embedded['wp:featuredmedia'][0].source_url
      ? data[0]._embedded['wp:featuredmedia'][0].source_url
      : 'https://wealthpsychology.in/global/imgs/logo.webp'; // Use a default image

    const post = {
      title: decode(data[0].title.rendered), // Decode the title
      content: decode(data[0].content.rendered), // Decode the content
      description: decode(data[0].excerpt.rendered).replace(/(<([^>]+)>)/gi, "").slice(0, 160), // Decode and trim the description/excerpt
      keywords: 'Finance News, Stock Market, Corporate Financial News, Market Updates, FinTech, Economic Insights, WealthPsychology',
      author: 'WealthPsychology, Karan',
      imageUrl: imageUrl, 
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`.replace(/^http:/, 'https:')
    };

    res.render('components/finance-news/news-article', { post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Failed to load the article. Please try again later.');
  }
});


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
