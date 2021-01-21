'use strict';

/**
 * Сделано дополнительное задание: реализованы методы several и through.
 */
const isExtraTaskSolved = true;

/**
 * Получение нового Emitter'а
 * @returns {Object}
 */
function getEmitter() {
  const expectedEvents = [];

  function applyChanges(event) {
    if (!(event in expectedEvents)) {
      expectedEvents[event] = [];
    }

    return expectedEvents[event].map(info => {
      const context = info.context;
      const handler = info.handler;
      const isSeveral = info.isSeveral;
      let count = info.count;
      let eventCounter = info.eventCounter;

      if (isSeveral) {
        if (count > 0) {
          handler.call(context);
          count--;
        }
      } else {
        if (eventCounter === 0) {
          handler.call(context);
        }

        eventCounter = (eventCounter + 1) % count;
      }

      return { context, handler, isSeveral, count, eventCounter };
    });
  }

  return {
    /**
     * Подписка на событие
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     */
    on: function(event, context, handler) {
      if (!(event in expectedEvents)) {
        expectedEvents[event] = [];
      }

      expectedEvents[event].push({ context, handler, isSeveral: false, count: 1, eventCounter: 0 });

      return this;
    },

    /**
     * Отписка от события
     * @param {string} event
     * @param {Object} context
     */
    off: function(event, context) {
      for (const currentEvent of Object.keys(expectedEvents)) {
        if (currentEvent === event || currentEvent.startsWith(`${event}.`)) {
          expectedEvents[currentEvent] = expectedEvents[currentEvent].filter(info => {
            return info['context'] !== context;
          });
        }
      }

      return this;
    },

    /**
     * Уведомление о событии
     * @param {string} event
     */
    emit: function(event) {
      expectedEvents[event] = applyChanges(event);
      let currentEvent = event;

      while (/\./.test(currentEvent)) {
        currentEvent = currentEvent.slice(0, currentEvent.lastIndexOf('.'));
        expectedEvents[currentEvent] = applyChanges(currentEvent);
      }

      return this;
    },

    /**
     * Подписка на событие с ограничением по количеству отправляемых уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} times Сколько раз отправить уведомление
     */
    several: function(event, context, handler, times) {
      if (times <= 0) {
        this.on(event, context, handler);
      }

      if (!(event in expectedEvents)) {
        expectedEvents[event] = [];
      }

      expectedEvents[event].push({
        context,
        handler,
        isSeveral: true,
        count: times,
        eventCounter: 0
      });

      return this;
    },

    /**
     * Подписка на событие с ограничением по частоте отправки уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} frequency Как часто уведомлять
     */
    through: function(event, context, handler, frequency) {
      if (frequency <= 0) {
        this.on(event, context, handler);
      }

      if (!(event in expectedEvents)) {
        expectedEvents[event] = [];
      }

      expectedEvents[event].push({
        context,
        handler,
        isSeveral: false,
        count: frequency,
        eventCounter: 0
      });

      return this;
    }
  };
}

module.exports = {
  getEmitter,

  isExtraTaskSolved
};
