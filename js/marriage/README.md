# Задача «Свадьба Аркадия»

> Мы очень хотим, чтобы код вы написали сами, а не пользовались внешними библиотеками.

## Основное задание

Лекция прошла очень удачно для Аркадия, он познакомился с девушкой, и спустя какое-то время его корабль,
под названием «Любовь», наконец-то готов отправиться в бухту, под названием «Семья». Настало время организовать свадьбу для него.

Аркадий вновь достаёт свою телефонную книгу с записями о друзьях. Кстати, он немного обновил её после
лекции — добавил информацию о том, кто и с кем дружит (`friends`), и кто является его лучшими друзьями (`best`):

```javascript
const friends = [
  {
    name: 'Sam',
    friends: ['Mat', 'Sharon'],
    gender: 'male',
    best: true
  },
  {
    name: 'Sally',
    friends: ['Brad', 'Emily'],
    gender: 'female',
    best: true
  }
];
```

Аркадий хочет, чтобы обязательно был соблюдён ряд условий:

- Во-первых, на свадьбе должны быть не только друзья, но и друзья друзей
- Во-вторых, слишком незнакомые парни смущают Аркадия и он планирует ограничить уровень неизвестности определённым кругом
- В-третьих, чтобы никому не было грустно – он их собирает в пары «парень + девушка»

Для того, чтобы это реализовать понадобятся фильтры и итераторы:

```javascript
// Создаем фильтры парней и девушек
const maleFilter = new lib.MaleFilter();
const femaleFilter = new lib.FemaleFilter();

// Создаем итераторы
const femaleIterator = new lib.Iterator(friends, femaleFilter);

// Среди парней приглашаем только луших друзей и друзей лучших друзей
const maleIterator = new lib.LimitedIterator(friends, maleFilter, 2);

const invitedFriends = [];

// Собираем пары «парень + девушка»
while (!maleIterator.done() && !femaleIterator.done()) {
  invitedFriends.push([maleIterator.next(), femaleIterator.next()]);
}

// Если остались девушки, то приглашаем остальных
while (!femaleIterator.done()) {
  invitedFriends.push(femaleIterator.next());
}
```

### Общие условия

- Лучшие друзья помечены флагом `best`
- Для каждого друга указан список его друзей
- Дружба всегда взаимная
- Обход должен происходить, начиная с **лучших** друзей
- Обход всегда идет **в алфавитном порядке** имен
- Друзья не должны обходиться дважды
- Первый круг друзей – это лучшие друзья
- Второй круг друзей – это друзья лучших друзей
- Третий круг и остальные строятся аналогичным образом
- Гарантируется, что на входе будут корректные условия
  - Неориентированный граф друзей
  - Все перечисленные друзья в свойствах `friends` будут существовать во входном массиве
- Граф друзей может быть несвязным и/или цикличным

### Условия для Iterator

- Создает объект итератора, с помощью которого можно обойти друзей по заданным правилам
- На вход он принимает массив и объект фильтра для фильтрации некоторых друзей
- Если объект фильтра не является инстансом функции-конструктора `Filter`, должна выброситься ошибка `TypeError`
- Итератор должен иметь два метода: `done()` и `next()`
- Метод `done()` возвращает `true`, если обход закончен, и `false` в противном случае
- Метод `next()` возвращает объект друга и `null`, если обход закончен

### Условия для LimitedIterator

- Наследник `Iterator`
- Имеет ограничение по кругу (`maxLevel`).
  Если передан 1, то такой итератор обойдет только первый круг друзей.
  Если передано 2, то обойдет первый и второй. И так далее.

### Условия для Filter

- Создает фильтр, который решает какой друг подходит для итерации
- По умолчанию такой фильтр никого не отсеивает

### Условия для MaleFilter

- Наследник `Filter`
- Позволяет итерироваться по друзьям мужского пола

### Условия для FemaleFilter

- Наследник `Filter`
- Позволяет итерироваться по друзьям женского пола

## Доступные команды

Запускаются так: `npm run <command>`

| Команда       | Действие                                |
| ------------- | --------------------------------------- |
| start         | Запуск src/index.js                     |
| test          | Запуск всех тестов                      |
| test:watch    | Запуск тестов при изменении кода        |
| test:coverage | Проверка уровня покрытия кода тестами   |
| lint          | Проверка кода линтером                  |
| lint-fix      | Исправление ошибок, выявленных линтером |
| format        | Форматирование кода                     |

## Полезные ссылки

- [Прототипы, наследование](https://learn.javascript.ru/prototypes)

<img
    src="https://yastatic.net/s3/lyceum/ifmo-homeworks/cake.jpeg" 
    width="1024"
    height="637"
    alt="Programmers Cake"
/>
