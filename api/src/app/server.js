import express from 'express';

const app = express();

app.listen(4000, () => {
  console.log('Hearthstone API Started on Port 4000');
});

const router = express.Router();

app.use(router);

router.get('/brew', (req, res) => {
  res.status(418).send('short and stout');
});
