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



export default router;
