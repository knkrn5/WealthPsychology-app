import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
// import axios from 'axios';
// import { decode } from 'html-entities';
import contentful from 'contentful';
import CircularJSON from 'circular-json';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import dotenv from 'dotenv';
dotenv.config();  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 55555;

// Enable CORS for all routes
app.use(cors());

app.use((req, res, next) => {
  res.removeHeader('X-XSS-Protection');
  next();
});

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/finance-news', (req, res) => {
  res.sendFile(path.join(__dirname, 'finance-news/finance-news.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog/blog.html'));
});

app.get('/financial-calculators', (req, res) => {
  res.sendFile(path.join(__dirname, 'financial-calculators/financial-calculators.html'));
});

app.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact-us/contact-us.html'));
});

app.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'about-us/about-us.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(__dirname, 'our-team/team.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy-policy/privacy-policy.html'));
});

app.get('/terms-of-use', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms-of-use/terms-of-use.html'));
});

app.get('/plans', (req, res) => {
  res.sendFile(path.join(__dirname, 'our-plans/plans.html'));
});


// Initialize Contentful client
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

//proxy for blog contentful cms for blog
app.get('/blog/posts', async (req, res) => {
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
export async function fetchContentBySlug(contentType, slug) {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      'fields.slug': slug,
      limit: 1,
      include: 2, // Include linked assets
    });

    if (entries.items.length > 0) {
      const post = entries.items[0];

      // Render rich text content
      if (post.fields.content) {
        const options = {
          renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
              const assetUrl = node.data.target.fields.file.url;
              const assetAlt = node.data.target.fields.title || 'Embedded Image';
              return `<img class="rich-asset" src="${assetUrl}" alt="${assetAlt}" />`;
            },
            [INLINES.HYPERLINK]: (node) => {
              const url = node.data.uri;
              const linkText = node.content[0].value;
              return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            }
          },
        };
        try {
          post.fields.renderPostRichTextHtml = documentToHtmlString(post.fields.content, options);
        } catch (error) {
          console.error('Error rendering rich text:', error);
          post.fields.renderPostRichTextHtml = 'Error rendering content';
        }
      } else {
        post.fields.renderPostRichTextHtml = 'No content available';
      }

      return post;
    }
    return null;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

// Individual blog post route
app.get('/blog/post/:slug', async (req, res) => {
  try {
    const postSlug = req.params.slug;
    const post = await fetchContentBySlug('pageBlogPost', postSlug);

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
    res.render('pages/post/post', {
      post: post.fields,
      postTitle: post.fields.title || 'Untitled Post',
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


//proxy for finance news contentful cms for blog
app.get('/finnews', async (req, res) => {
  console.log('Received request for /blog');
  try {
    console.log('Attempting to fetch entries from Contentful');
    const response = await client.getEntries({
      content_type: 'pageNewsArticles',
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


// Individual news article route
app.get('/news-article/:slug', async (req, res) => {
  try {
    const postSlug = req.params.slug;
    const post = await fetchContentBySlug('pageNewsArticles', postSlug);

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
    res.render('pages/news-article/news-article', {
      post: post.fields,
      metaTitle: post.fields.title || 'Untitled Post',
      metaDescription: post.fields.excerpt || '',
      metaKeywords: post.fields.tags || ['finance', 'trading', 'investing', 'wealthpsychology', 'blog'],
      imageUrl: imageUrl,
      newsUrl: fullUrl.replace(/^http:/, 'https:'),
      renderPostRichTextHtml: post.fields.renderPostRichTextHtml || 'No content available'
    });

  } catch (error) {
    console.error('Detailed error in /news-article/:slug route:', error);
    res.status(500).render('error', {
      message: 'Error loading post',
      error: { status: 500, stack: process.env.NODE_ENV === 'development' ? error.stack : '' }
    });
  }
});



// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
