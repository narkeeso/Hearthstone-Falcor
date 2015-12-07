import FalcorRouter from 'falcor-router';
import {Observable} from 'rx';

class CardsByClass extends FalcorRouter.createClass([
  {
    route: 'cardsByClass[{keys:playerClass}].length',
    get: (pathSet) => {
      const playerClass = pathSet.playerClass[0];

      return Observable.fromPromise(
        hsClient('GET', `/cards/classes/${playerClass}?collectible=1`)
      )
      .map((collectibles) => {
        // Remove Hero type collectibles to get all cards for deck creation
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
        // Remove Hero type collectibles to get all cards for deck creation
        return Observable
          .fromArray(collectibles)
          .filter((collectible) => {
            return collectible.type !== 'Hero';
          });
      })
      .filter((card, cardIndex) => {
        // Filter by requested range
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

export default CardsByClass;
