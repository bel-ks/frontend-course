'use strict';

global.fetch = require('node-fetch');

/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

class TripBuilder {
  constructor(geoids) {
    this.geoids = geoids;
    this.expectedWeather = [];
    this.maxDuration = Infinity;
    this.forecast = {};
    this.result = [];
    this.ready = false;

    this.used = geoids.reduce((acc, geoid) => {
      acc[geoid] = false;

      return acc;
    }, {});
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    for (let i = 0; i < daysCount; ++i) {
      this.expectedWeather.push(['clear', 'partly-cloudy']);
    }

    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    for (let i = 0; i < daysCount; ++i) {
      this.expectedWeather.push(['cloudy', 'overcast']);
    }

    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.maxDuration = Math.min(this.maxDuration, daysCount);

    return this;
  }

  getRoute(currentDay = 0, daysInTrip = 0, prevGeoId) {
    if (this.ready) {
      return;
    }

    if (prevGeoId) {
      this.result.push({
        geoid: prevGeoId,
        day: currentDay
      });
    }

    if (currentDay === this.expectedWeather.length) {
      this.ready = true;

      return;
    }

    const expectedWeather = this.expectedWeather[currentDay];

    if (
      prevGeoId &&
      daysInTrip < this.maxDuration &&
      expectedWeather.includes(this.forecast[prevGeoId][currentDay])
    ) {
      this.getRoute(currentDay + 1, daysInTrip + 1, prevGeoId);
    }

    this.geoids
      .filter(geoid => !this.used[geoid])
      .forEach(geoid => {
        const actualWeather = this.forecast[geoid][currentDay];

        if (expectedWeather.includes(actualWeather)) {
          this.used[geoid] = true;
          this.getRoute(currentDay + 1, 1, geoid);
          this.used[geoid] = false;
        }
      });

    if (prevGeoId && !this.ready) {
      this.result.pop();
    }
  }

  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  build() {
    return new Promise((resolve, reject) => {
      if (this.expectedWeather.length > 7) {
        reject(new Error('Не могу построить маршрут!'));
      }

      Promise.all(
        this.geoids.map(geoid =>
          global
            .fetch(`https://api.weather.yandex.ru/v1/forecast?hours=false&limit=7&geoid=${geoid}`)
            .then(res => res.json())
            .catch(error => reject(error))
        )
      )
        .then(jsons => {
          jsons.forEach(currentGeo => {
            this.forecast[currentGeo.info.geoid] = currentGeo.forecasts.map(
              current => current.parts.day_short.condition
            );
          });

          this.getRoute();

          if (this.ready) {
            resolve(this.result);
          } else {
            reject(new Error('Не могу построить маршрут!'));
          }
        })
        .catch(error => reject(error));
    });
  }
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
