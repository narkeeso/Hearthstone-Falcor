import request from 'superagent';
import Promise from 'bluebird';

const HS_API_KEY = process.env.HS_API_KEY;
const HS_BASE_URL = 'https://omgvamp-hearthstone-v1.p.mashape.com';

/**
 * Simple request wrapper for external hearthstone api
 *
 * @param method {string} - GET, POST, DELETE
 * @param uri {string} - /cards/ysera
 * @return {promise}
 */
export default function hsClient(method, uri) {
  return new Promise((resolve, reject) => {
    request(method, `${HS_BASE_URL}/${uri}`)
      .set('X-Mashape-Key', HS_API_KEY)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res.body);
      });
  });
};
