import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import pagesRoutes from './backend/routes/pages.routes.js';
import servicesRoutes from './backend/routes/services.routes.js';
import blogRoutes from './backend/routes/blog.routes.js';
import newsRoutes from './backend/routes/finnews.routes.js';
import wealthSensedbRoutes from './backend/routes/wealthSensedb.routes.js';
import wpUrlCbRoutes from './backend/routes/wpUrlCb.routes.js'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 55555;

// Enable CORS for all routes
app.use(cors());

// Middleware to remove unnecessary headers
app.use((req, res, next) => {
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('X-Powered-By');
  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'backend', 'views'));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Use route files for routing
app.use('/', pagesRoutes);
app.use('/', servicesRoutes);
app.use('/blog', blogRoutes);
app.use('/finance-news', newsRoutes);
app.use('/wealth-sense', wealthSensedbRoutes);
app.use('/wp-url-cb', wpUrlCbRoutes);


// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
