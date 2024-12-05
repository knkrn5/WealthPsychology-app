// aiRoutes.js
import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API,
});

const urls = [
  "https://wealthpsychology.in/index.html",
  "https://wealthpsychology.in/blog/",
  "https://wealthpsychology.in/financial-calculators/",
  "https://wealthpsychology.in/finance-quizzes/",
  "https://wealthpsychology.in/contact-us/",
  "https://wealthpsychology.in/about-us/",
  "https://wealthpsychology.in/our-team/",
  "https://wealthpsychology.in/our-plans/",
];

let websiteText = ''; // Store scraped text globally

// Function to scrape website text
const extractAllText = async (urls) => {
  const allData = [];
  try {
    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        });
        const $ = cheerio.load(response.data);
        const text = $('body')
          .text()
          .replace(/\s+/g, ' ')
          .trim();
        allData.push(text);
      } catch (urlError) {
        console.error(`Error scraping ${url}:`, urlError.message);
        allData.push(`Error scraping ${url}: ${urlError.message}`);
      }
    }
    return allData.join('\n\n');
  } catch (error) {
    console.error('Overall extraction error:', error);
    return null;
  }
};

// Route to scrape text
router.get('/scraped-data', async (req, res) => {
  console.log('Scraping website...');
  websiteText = await extractAllText(urls);

  if (websiteText) {
    res.json({
      success: true,
      message: 'Website scraped successfully',
      textLength: websiteText.length,
      scrapedText: websiteText,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to scrape website',
    });
  }
});

// Route to handle AI questions
router.post('/wp-ask', async (req, res) => {
  const { question } = req.body;
  console.log('Received question:', question);

  // Check if websiteText is empty and call the scraping function if needed
  if (!websiteText) {
    console.log('websiteText is empty, scraping website...');
    websiteText = await extractAllText(urls);
    if (!websiteText) {
      // If scraping fails, return an error
      return res.status(400).json({ error: 'Failed to scrape website' });
    } else {
      console.log('Scraped website successfully');
    }
  }

  try {
    const shortenedText = websiteText.slice(0, 5000); // Limit to 5000 characters
    const completion = await client.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant. Use the provided website data to answer questions. Do not answer any questions that are not based on the data." },
        { role: "assistant", content: "I will only answer based on this website data only." },
        { role: "system", content: `URL Data:\n${shortenedText}` },
        { role: "user", content: question },
      ],
      temperature: 0.5,
      top_p: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || "No response generated.";
    // console.log('Generated response:', response);
    res.json({ response });
  } catch (error) {
    console.error('Error during AI API call:', error);
    res.status(500).json({ error: 'An error occurred processing your request' });
  }
});

export default router;
