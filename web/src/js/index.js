var falcor = require('falcor');
var FalcorHttpDataSource = require('falcor-http-datasource');
var _ = require('lodash');

var model = new falcor.Model({
  source: new FalcorHttpDataSource('http://localhost:4000/model.json'),
  crossDomain: true,
  withCredentials: true
});

model.get('cardsByClass["Hunter"][0..49]["name","img"]', 'cardsByClass["Hunter"].length').then((data) => {
  document.getElementById('data').innerHTML = JSON.stringify(data, null, 2);
  var cards = _.values(data.json.cardsByClass.Hunter);

  cards.forEach(function(card) {
    var img = document.createElement('img');
    img.setAttribute('src', card.img);
    document.body.appendChild(img);
  });
});
