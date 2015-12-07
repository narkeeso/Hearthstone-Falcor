import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import falcor from 'falcor';
import FalcorRouter from 'falcor-router';
import FalcorServer from 'falcor-express';
import {Observable} from 'rx';

import hsClient from '../lib/hs-api-client';

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

class CardsRouter extends FalcorRouter.createClass([
  {
    route: 'cardsByClass[{keys:playerClass}].length',
    get: (pathSet) => {
      const playerClass = pathSet.playerClass[0];

      return Observable.fromPromise(
        hsClient('GET', `/cards/classes/${playerClass}?collectible=1`)
      )
      .map((collectibles) => {
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
      const range = pathSet.index[0];

      return Observable.fromPromise(
        hsClient('GET', `/cards/classes/${playerClass}?collectible=1`)
      )
      .flatMap((collectibles) => {
        return Observable
          .fromArray(collectibles)
          .filter((collectible) => {
            return collectible.type !== 'Hero';
          });
      })
      .filter((card, cardIndex) => {
        return cardIndex >= range.from && cardIndex <= range.to;
      })
      .flatMap((card, cardIndex) => {
        return Observable
          .fromArray(pathSet[3])
          .map((key) => {
            return {
              path: ['cardsByClass', playerClass, cardIndex + range.from, key],
              value: card[key]
            };
          });
      });
    }
  }
]) {
  constructor() {
    super();
  }
}

app.use('/model.json', FalcorServer.dataSourceRoute((req, res, next) => {
  return new CardsRouter;
}));
