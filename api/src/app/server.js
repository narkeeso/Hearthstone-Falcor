import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import FalcorRouter from 'falcor-router';
import FalcorServer from 'falcor-express';

import hsClient from '../lib/hs-api-client';
import CardsByClass from './routers/cards-by-class';

const app = express();

app.listen(4000, () => {
  console.log('Hearthstone Falcor API Started on Port 4000');
});

app.use(cors({
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
  origin: 'http://localhost:8080'
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/model.json', FalcorServer.dataSourceRoute((req, res, next) => {
  return new CardsByClass;
}));
