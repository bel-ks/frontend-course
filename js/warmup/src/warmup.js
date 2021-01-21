'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError('Args should be integers');
  }

  return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
  if (typeof year !== 'number') {
    throw new TypeError('Arg should be a number');
  }

  if (year <= 0 || !Number.isInteger(year)) {
    throw new RangeError('Arg should be a positive number');
  }

  return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
  if (typeof hexColor !== 'string') {
    throw new TypeError('Arg should be a string');
  }

  if (!/#[\da-f]{6}/i.test(hexColor)) {
    throw new RangeError('Arg should be a correct HEX color');
  }

  return `(${parseInt(hexColor.slice(1, 3), 16)}, ${parseInt(hexColor.slice(3, 5), 16)}, ${parseInt(
    hexColor.slice(5, 7),
    16
  )})`;
}

function getFibNum(n, prev, cur) {
  if (n === 0) {
    return cur;
  } else {
    return getFibNum(n - 1, cur, prev + cur);
  }
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
  if (typeof n !== 'number') {
    throw new TypeError('Arg should be a number');
  }

  if (n <= 0 || !Number.isInteger(n)) {
    throw new RangeError('Arg should be a positive integer');
  }

  return getFibNum(n, 1, 0);
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
  if (!Array.isArray(matrix) || !matrix.every(Array.isArray)) {
    throw new TypeError('Arg should be a matrix');
  }

  const rowLength = matrix[0].length;

  if (matrix.some(row => row.length !== rowLength)) {
    throw new TypeError('Arg should be a matrix');
  }

  const transposedMatrix = [];

  for (let i = 0; i < matrix[0].length; ++i) {
    transposedMatrix[i] = [];
  }

  for (let i = 0; i < matrix.length; ++i) {
    for (let j = 0; j < matrix[i].length; ++j) {
      transposedMatrix[j][i] = matrix[i][j];
    }
  }

  return transposedMatrix;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
  if (typeof n !== 'number' || typeof targetNs !== 'number') {
    throw new TypeError('Args should be numbers');
  }

  if (targetNs < 2 || targetNs > 36 || !Number.isInteger(targetNs)) {
    throw new RangeError('Second arg should be in range [2, 36]');
  }

  return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    throw new TypeError('Arg should be string');
  }

  return /^8-800-\d{3}-\d{2}-\d{2}$/.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Arg should be a string');
  }

  return (text.match(/:-\)|\(-:/g) || []).length;
}

function isRowWin(row) {
  if (row[0] === row[1] && row[0] === row[2]) {
    return row[0];
  } else {
    return undefined;
  }
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
  const winCombinations = [
    [field[0][0], field[0][1], field[0][2]],
    [field[1][0], field[1][1], field[1][2]],
    [field[2][0], field[2][1], field[2][2]],
    [field[0][0], field[1][0], field[2][0]],
    [field[0][1], field[1][1], field[2][1]],
    [field[0][2], field[1][2], field[2][2]],
    [field[0][0], field[1][1], field[2][2]],
    [field[2][0], field[1][1], field[0][2]]
  ].map(isRowWin);

  if (winCombinations.every(res => res === undefined)) {
    return 'draw';
  } else {
    return winCombinations.filter(res => res !== undefined)[0];
  }
}

module.exports = {
  abProblem,
  centuryByYearProblem,
  colorsProblem,
  fibonacciProblem,
  matrixProblem,
  numberSystemProblem,
  phoneProblem,
  smilesProblem,
  ticTacToeProblem
};
