'use strict';

let currentResult = -1;
let maxResult = 5;
let coordinates = [];

const suggest = document.querySelector('.suggest');

for (let i = 0; i < 5; ++i) {
  const result = document.createElement('div');
  result.className = 'hiddenResult';
  suggest.appendChild(result);
}

const forecast = document.querySelector('.forecast');
forecast.className = 'hiddenForecast';

const showButton = document.getElementById('button');
showButton.onclick = showForecast;

const suggestField = document.getElementById('field');
suggestField.oninput = getSuggest;
suggestField.addEventListener('focus', () => {
  currentResult = -1;
  forecast.className = 'hiddenForecast';
});

document.onclick = () => (suggest.className = 'hiddenSuggest');

document.addEventListener('keydown', button => {
  switch (button.key) {
    case 'ArrowDown':
      if (currentResult !== -1) {
        suggest.children.item(currentResult).className = 'result';
      }
      currentResult = Math.min(maxResult - 1, currentResult + 1);
      if (currentResult !== -1) {
        suggest.children.item(currentResult).className = 'hoveredResult';
      }
      break;
    case 'ArrowUp':
      if (currentResult !== -1) {
        suggest.children.item(currentResult).className = 'result';
      }
      currentResult = Math.max(-1, currentResult - 1);
      if (currentResult !== -1) {
        suggest.children.item(currentResult).className = 'hoveredResult';
      }
      break;
    case 'Enter':
      if (currentResult !== -1) {
        suggestField.value = suggest.children.item(currentResult).children.item(0).textContent;
        suggest.className = 'hiddenSuggest';
      }
      break;
  }
});

function getSuggest() {
  const searchText = suggestField.value;
  const locale = 'ru';
  const url = 'https://autocomplete.travelpayouts.com/places2';
  const isCode = searchText.match(/[A-Z]{3}/);
  const type = isCode ? 'airport' : 'city';
  fetch(url + '?term=' + searchText + '&locale=' + locale + '&types[]=' + type)
    .then(res => res.json())
    .then(data => {
      suggest.className = 'suggest';
      currentResult = -1;
      coordinates = [];

      for (let i = 0; i < 5; ++i) {
        suggest.children.item(i).className = 'hiddenResult';
      }

      maxResult = Math.min(5, data.length);

      for (let i = 0; i < maxResult; ++i) {
        suggest.children.item(i).className = 'result';
        const mainPort = data[i]['main_airport_name'];
        suggest.children.item(i).innerHTML =
          "<span class='airport'>" +
          data[i]['name'] +
          '</span>' +
          "<span class='info'>" +
          data[i]['code'] +
          ' · ' +
          (isCode ? data[i]['city_name'] + ' · ' : mainPort ? mainPort + ' · ' : '') +
          data[i]['country_name'] +
          '</span>';
        suggest.children.item(i).onclick = () => {
          currentResult = i;
          suggestField.value = data[i]['name'];
        };
        coordinates.push(data[i]['coordinates']);
      }
    });
}

function showForecast() {
  forecast.className = 'forecast';
  const url = 'https://fcc-weather-api.glitch.me/api/current';
  fetch(
    url + '?lon=' + coordinates[currentResult]['lon'] + '&lat=' + coordinates[currentResult]['lat']
  )
    .then(res => res.json())
    .then(data => {
      forecast.innerHTML =
        "<img src='" +
        data['weather'][0]['icon'] +
        "' alt='forecast'>" +
        "<div class='forecast-info'>" +
        '<span>' +
        data['weather'][0]['main'] +
        '</span>' +
        '<span>' +
        ' Temperature: ' +
        data['main']['temp'] +
        '°C' +
        '</span>' +
        '</div>';
    });
}
