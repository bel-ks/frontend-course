'use strict';

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;

const startTime = 0;
const endTime = 3 * 24 * 60 - 1;

let commonSchedule = [];
let robberyTimes = [];

const dayByStr = {
  ПН: 0,
  ВТ: 1,
  СР: 2,
  ЧТ: 3,
  ПТ: 4,
  СБ: 5,
  ВС: 6
};

const dayByNumber = {
  0: 'ПН',
  1: 'ВТ',
  2: 'СР'
};

const type = {
  startTime: 0,
  endTime: 1
};

function parseDate(time, zoneDiff, dd) {
  const checkedTime = /^\d/.test(time) ? `${dayByNumber[dd]} ${time}` : time;
  const day = dayByStr[checkedTime.slice(0, 2)];
  const hours = parseInt(checkedTime.slice(3, 5)) + zoneDiff;
  const minutes = parseInt(checkedTime.slice(6, 8));

  return Math.max(startTime, Math.min(endTime, day * 24 * 60 + hours * 60 + minutes));
}

function compareDates(a, b) {
  const fromA = `${dayByStr[a.from.slice(0, 2)]} ${a.from.slice(3)}`;
  const fromB = `${dayByStr[b.from.slice(0, 2)]} ${b.from.slice(3)}`;
  if (fromA > fromB) {
    return 1;
  }
  if (fromA < fromB) {
    return -1;
  }

  return 0;
}

function compare(a, b) {
  for (const field of ['time', 'type']) {
    if (a[field] > b[field]) {
      return 1;
    }

    if (a[field] < b[field]) {
      return -1;
    }
  }

  return 0;
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  commonSchedule = [];

  [0, 1, 2].forEach(day => {
    commonSchedule.push({
      person: 'bank',
      time: parseDate(workingHours['from'], 0, day),
      type: type.startTime
    });

    commonSchedule.push({
      person: 'bank',
      time: parseDate(workingHours['to'], 0, day),
      type: type.endTime
    });
  });

  const zone = parseInt(workingHours['from'].slice(6));

  ['Danny', 'Rusty', 'Linus'].forEach(person => {
    commonSchedule.push({
      person: person,
      time: startTime,
      type: type.startTime
    });

    commonSchedule.push({
      person: person,
      time: endTime,
      type: type.endTime
    });

    let [fromTime, toTime] = [-1, -1];

    schedule[person].sort(compareDates).forEach(({ from, to }) => {
      const zoneDiff = zone - parseInt(from.slice(9));
      const parsedFrom = parseDate(from, zoneDiff);
      const parsedTo = parseDate(to, zoneDiff);

      if (fromTime === -1) {
        [fromTime, toTime] = [parsedFrom, parsedTo];
      } else if (parsedTo > fromTime) {
        commonSchedule.push({
          person: person,
          time: fromTime,
          type: type.endTime
        });

        commonSchedule.push({
          person: person,
          time: toTime,
          type: type.startTime
        });

        [fromTime, toTime] = [parsedFrom, parsedTo];
      }

      toTime = Math.max(toTime, parsedTo);
    });

    commonSchedule.push({
      person: person,
      time: fromTime,
      type: type.endTime
    });

    commonSchedule.push({
      person: person,
      time: toTime,
      type: type.startTime
    });
  });

  robberyTimes = [];
  let start = startTime;
  const people = {
    bank: 0,
    Danny: 0,
    Rusty: 0,
    Linus: 0
  };

  commonSchedule.sort(compare).forEach(({ person, time, type }) => {
    if (type === 0) {
      people[person]++;
      start = time;
    } else {
      if (Object.values(people).filter(type => type > 0).length === 4) {
        const currentDuration = time - start;

        if (duration <= currentDuration) {
          robberyTimes.push({
            from: start,
            to: time
          });
        }
      }

      people[person] = Math.max(people[person] - 1, 0);
    }
  });

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return robberyTimes.length > 0;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      if (this.exists()) {
        const dd = Math.floor(robberyTimes[0]['from'] / (24 * 60));
        const hh = Math.floor((robberyTimes[0]['from'] % (24 * 60)) / 60);
        const mm = robberyTimes[0]['from'] % 60;

        return template
          .replace('%DD', dayByNumber[dd])
          .replace('%HH', (hh.toString().length === 1 ? '0' : '') + hh)
          .replace('%MM', (mm.toString().length === 1 ? '0' : '') + mm);
      }

      return '';
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      if (this.exists()) {
        const from = robberyTimes[0]['from'] + 30;
        const currentDuration = robberyTimes[0]['to'] - from;

        if (duration > currentDuration) {
          if (robberyTimes.length > 1) {
            robberyTimes.shift();

            return true;
          }

          return false;
        }

        robberyTimes[0]['from'] = from;

        return true;
      }

      return false;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
