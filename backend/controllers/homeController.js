import path from 'path';
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get('/modules/stock-market', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/stock-market/stock-market.html'));
});

router.get('/modules/mutual-funds', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/mutual-funds/mutual-funds.html'));
});

router.get('/modules/fundamental-analysis', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/fundamental-analysis/fundamental-analysis.html'));
});

router.get('/modules/technical-analysis', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/technical-analysis/technical-analysis.html'));
});

router.get('/modules/ipo-analysis', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/ipo-analysis/ipo-analysis.html'));
});

router.get('/modules/economic-analysis', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/economic-analysis/economic-analysis.html'));
});

router.get('/modules/sector-analysis', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/sector-analysis/sector-analysis.html'));
});

router.get('/modules/money-market', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/money-market/money-market.html'));
});

router.get('/modules/concentrated-investing', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/concentrated-investing/concentrated-investing.html'));
});

router.get('/modules/cryptocurrency', (req, res) => {
  res.sendFile(path.join(__dirname, '../../modules/cryptocurrency/cryptocurrency.html'));
});



export default router;
