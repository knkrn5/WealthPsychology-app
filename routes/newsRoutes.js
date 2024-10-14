import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import contentful from 'contentful';
import CircularJSON from 'circular-json';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Initialize Contentful client
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

// Function to fetch a post by its slug and render rich text
async function fetchContentBySlug(contentType, slug) {
  // ... (keep the existing function implementation)
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

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../finance-news/finance-news.html'));
});

router.get('/finnews', async (req, res) => {
  // ... (keep the existing /finnews route implementation)
  console.log('Received request for /news');
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
      error: 'Failed to fetch news articles',
      details: error.message,
      stack: error.stack
    });
  }
});

router.get('/article/:slug', async (req, res) => {
  // ... (keep the existing /news-article/:slug route implementation)
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

    // Determine the protocol and construct the full URL for the news post
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fullUrl = `${protocol}://${req.get('host')}${req.originalUrl}`;

    // Render the post.ejs template with the full post content
    res.render('pages/news-article/news-article', {
      post: post.fields,
      metaTitle: post.fields.title || 'Untitled Post',
      metaDescription: post.fields.excerpt || '',
      metaKeywords: post.fields.tags || ['finance', 'trading', 'investing', 'wealthpsychology', 'news'],
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

export default router;