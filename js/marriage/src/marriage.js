'use strict';

/**
 * @typedef {Object} Friend
 * @property {string} name Имя
 * @property {'male' | 'female'} gender Пол
 * @property {boolean} best Лучший ли друг?
 * @property {string[]} friends Список имён друзей
 */

/**
 * Итератор по друзьям
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 */
function Iterator(friends, filter) {
  if (!(filter instanceof Filter)) {
    throw TypeError('Second argument must be instance of Filter');
  }

  this.guests = (() => {
    const possibleGuests = friends.filter(friend => {
      return friend.best;
    });

    const invited = new Set();
    let currentLevel = this.maxLevel ? this.maxLevel : Infinity;

    while (currentLevel > 0 && possibleGuests.length > 0) {
      const count = possibleGuests.length;

      possibleGuests
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .forEach(guest => {
          if (!invited.has(guest)) {
            invited.add(guest);

            guest.friends.forEach(name => {
              possibleGuests.push(
                friends.find(friend => {
                  return friend.name === name;
                })
              );
            });
          }
        });

      possibleGuests.splice(0, count);
      --currentLevel;
    }

    return [...invited].filter(filter.check);
  })();

  this.index = 0;

  this.done = () => {
    return this.index === this.guests.length;
  };

  this.next = () => {
    return this.done() ? null : this.guests[this.index++];
  };
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 * @param {Number} maxLevel Максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  this.maxLevel = maxLevel;
  Iterator.call(this, maxLevel ? friends : [], filter);
}
LimitedIterator.prototype = Iterator.prototype;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  this.check = () => {
    return true;
  };
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  this.check = friend => {
    return friend.gender === 'male';
  };
}
MaleFilter.prototype = Filter.prototype;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  this.check = friend => {
    return friend.gender === 'female';
  };
}
FemaleFilter.prototype = Filter.prototype;

module.exports = {
  Iterator,
  LimitedIterator,
  Filter,
  MaleFilter,
  FemaleFilter
};
