import path from 'path';
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get('/financial-calculators/simple-interest-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/financial-calculators/simple-interest-calculator/simple-interest-calculator.html'));
});

router.get('/financial-calculators/reverse-simple-interest-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/financial-calculators/reverse-simple-interest-calculator/reverse-simple-interest-calculator.html'));
});

router.get('/financial-calculators/cagr-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/financial-calculators/cagr-calculator/cagr-calculator.html'));
});

router.get('/financial-calculators/reverse-cagr-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/financial-calculators/reverse-cagr-calculator/reverse-cagr-calculator.html'));
});



export default router;
