import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('<h1>Blessyou</h1>');
  next();
});

router.get('/hello', async (req, res) => {
  res.send('Hello');
});

const routerMiddleware = () => router;

export default routerMiddleware;
