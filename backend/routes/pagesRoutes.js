import { Router } from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();

// Helpers to get the __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your routes
router.get('/finance-news', (req, res) => {
    res.sendFile(join(__dirname, '../finance-news/finance-news.html')); // Correct path for finance news
});

router.get('/blog', (req, res) => {
    res.sendFile(join(__dirname, '../blog/blog.html')); // Correct path for blog
});

// Other routes...
router.get('/financial-calculators', (req, res) => {
    res.sendFile(join(__dirname, '../financial-calculators/financial-calculators.html')); // Update if applicable
});

router.get('/contact-us', (req, res) => {
    res.sendFile(join(__dirname, '../contact-us/contact-us.html')); // Update if applicable
});

router.get('/about-us', (req, res) => {
    res.sendFile(join(__dirname, '../about-us/about-us.html')); // Update if applicable
});

router.get('/team', (req, res) => {
    res.sendFile(join(__dirname, '../our-team/team.html')); // Update if applicable
});

router.get('/privacy-policy', (req, res) => {
    res.sendFile(join(__dirname, '../privacy-policy/privacy-policy.html')); // Update if applicable
});

router.get('/terms-of-use', (req, res) => {
    res.sendFile(join(__dirname, '../terms-of-use/terms-of-use.html')); // Update if applicable
});

router.get('/plans', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'our-plans', 'plans.html'));
});

export default router;
