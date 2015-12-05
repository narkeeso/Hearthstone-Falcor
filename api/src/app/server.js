import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import falcor from 'falcor';
import FalcorRouter from 'falcor-router';
import FalcorServer from 'falcor-express';

import hsClient from '../lib/hs-api-client';

const app = express();

app.listen(4000, () => {
  console.log('Hearthstone API Started on Port 4000');
});

app.use(cors({
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
  origin: 'http://localhost:8080'
}));

app.use(bodyParser.json());

app.use('/model.json', FalcorServer.dataSourceRoute((req, res, next) => {
  return new FalcorRouter([
    {
      route: 'cardsByClass[{keys:playerClass}].length',
      get: (pathSet) => {
        const playerClass = pathSet.playerClass[0];

        return hsClient('GET', `/cards/classes/${playerClass}?collectible=1`)
          .then((collectibles) => {
            const cards = collectibles.filter((collectible) => {
              return collectible.type !== 'Hero';
            });

            return {
              path: ['cardsByClass', playerClass, 'length'],
              value: cards.length
            };
          });
      }
    },
    {
      route: 'cardsByClass[{keys:playerClass}][{ranges:index}]["name", "img", "imgGold"]',
      get: (pathSet) => {
        const playerClass = pathSet.playerClass[0];

        return hsClient('GET', `/cards/classes/${playerClass}?collectible=1`)
          .then((collectibles) => {
            const results = [];
            const cards = collectibles.filter((collectible) => {
              return collectible.type !== 'Hero';
            });

            for (let i = pathSet.index[0].from; i < pathSet.index[0].to; i++) {
              const card = cards[i];
              const cardKeys = pathSet[3];

              cardKeys.forEach((cardKey) => {
                results.push({
                  path: ['cardsByClass', playerClass, i, cardKey],
                  value: card[cardKey]
                });
              });
            }

            return results;
          });
      }
    }
  ]);

  next();
}));

