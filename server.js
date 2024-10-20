
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import pagesRoutes from './backend/routes/pagesRoutes.js';
import modulesController from './backend/controllers/modulesController.js'
import fincalculatorsRoutes from './backend/routes/fincalculatorsRoutes.js';
import blogRoutes from './backend/routes/blogRoutes.js';
import newsRoutes from './backend/routes/finnewsRoutes.js';

import wealthSensedbRoutes from './backend/routes/wealthSensedbRoutes.js';



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
app.set('views', path.join(__dirname, 'backend', 'views'));

// Serve files from the root directory
app.use(express.static(path.join(__dirname)));


// Serve static files
// app.use(express.static(path.join(__dirname, 'public')));


// Use the controller and routes for routing
app.use('/', pagesRoutes);
app.use('/', modulesController);
app.use('/', fincalculatorsRoutes);

// Use the route files
app.use('/blog', blogRoutes);
app.use('/finance-news', newsRoutes);


app.use('/wealth-sense', wealthSensedbRoutes); 

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
