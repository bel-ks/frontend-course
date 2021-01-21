import { AnyAction, AnyState, Reducer, Store, Unsubscribe } from './types';

const createStore = (reducer: Reducer, initialState?: AnyState, enhancer?: any): Store => {
  if (typeof reducer !== 'function') {
    throw new Error('Reducer must be a function.');
  }

  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Enhancer must be a function.');
    }

    return enhancer(createStore)(reducer, initialState);
  }

  const currentReducer = reducer;
  let currentState = initialState ? initialState : reducer(initialState, { type: undefined });
  let currentListeners: (() => void)[] = [];
  let nextListeners = currentListeners;

  return {
    getState(): AnyState {
      return currentState;
    },

    dispatch(action: AnyAction): void {
      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property.');
      }

      currentState = currentReducer(currentState, action);
      currentListeners = nextListeners;
      const listeners = currentListeners;

      for (let i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
    },

    subscribe(listener: () => void): Unsubscribe {
      if (typeof listener !== 'function') {
        throw new Error('Listener must be a function.');
      }

      let isSubscribed = true;

      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }

      nextListeners.push(listener);

      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        isSubscribed = false;

        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice();
        }

        nextListeners.splice(nextListeners.indexOf(listener), 1);
        currentListeners = [];
      };
    }
  };
};

const applyMiddleware = (...middlewares: any[]) => (
  storeCreator: (reducer: Reducer, initialState?: AnyState) => Store
) => (reducer: Reducer) => {
  const store = storeCreator(reducer);

  let dispatch = (action: any): any => {
    throw new Error('Dispatching during middleware constructing.');
  };

  const middlewareAPI = {
    getState: store.getState,
    dispatch: (action: any) => dispatch(action)
  };

  dispatch = middlewares
    .map(middleware => middleware(middlewareAPI))
    .reduce((acc, cur) => (middleware: any) => acc(cur(middleware)))(store.dispatch);

  return {
    getState: store.getState,
    dispatch: dispatch,
    subscribe: store.subscribe
  };
};

export { createStore, applyMiddleware };
