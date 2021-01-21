'use strict';

/**
 * Если вы решили сделать дополнительное задание и реализовали функцию importFromDsv,
 * то выставьте значение переменной isExtraTaskSolved в true.
 */
const isExtraTaskSolved = true;

/**
 * Телефонная книга
 */
const phoneBook = new Map();

function checkNote(phone, name, email) {
  return (
    typeof phone === 'string' &&
    /^\d{10}$/.test(phone) &&
    typeof name === 'string' &&
    name &&
    typeof email === 'string'
  );
}

/**
 * Добавление записи в телефонную книгу
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function add(phone, name, email = '') {
  if (!checkNote(phone, name, email) || phoneBook.has(phone)) {
    return false;
  }
  phoneBook.set(phone, { name, email });

  return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function update(phone, name, email = '') {
  if (!checkNote(phone, name, email) || !phoneBook.has(phone)) {
    return false;
  }
  phoneBook.set(phone, { name, email });

  return true;
}

function checkQuery(query) {
  return typeof query === 'string' && query.length > 0;
}

function checkNoteByQuery(phone, name, email, query) {
  return phone.includes(query) || name.includes(query) || email.includes(query);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {string} query
 * @returns {string[]}
 */
function find(query) {
  if (!checkQuery(query)) {
    return [];
  }

  const res = [];
  const needAll = query === '*';

  phoneBook.forEach((note, phone) => {
    const currentNote =
      `${note['name']}, +7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(
        6,
        8
      )}-${phone.slice(8, 10)}` + (note['email'] !== '' ? `, ${note['email']}` : '');

    if (needAll || checkNoteByQuery(phone, note['name'], note['email'], query)) {
      res.push(currentNote);
    }
  });

  return res.sort();
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {string} query
 * @returns {number}
 */
function findAndRemove(query) {
  if (!checkQuery(query)) {
    return 0;
  }

  let removedCount = 0;
  const needAll = query === '*';

  phoneBook.forEach((note, phone) => {
    if (needAll || checkNoteByQuery(phone, note['name'], note['email'], query)) {
      removedCount++;
      phoneBook.delete(phone);
    }
  });

  return removedCount;
}

/**
 * Импорт записей из dsv-формата
 * @param {string} dsv
 * @returns {number} Количество добавленных и обновленных записей
 */
function importFromDsv(dsv) {
  if (typeof dsv !== 'string') {
    return 0;
  }

  let importedCount = 0;

  dsv.split('\n').forEach(note => {
    const [name, phone, email] = note.split(';');

    if (add(phone, name, email) || update(phone, name, email)) {
      importedCount++;
    }
  });

  return importedCount;
}

module.exports = {
  add,
  update,
  find,
  findAndRemove,
  importFromDsv,

  isExtraTaskSolved
};
