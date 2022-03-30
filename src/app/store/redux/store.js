import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { initialState, rootReducer } from './reducers';
import throttle from 'redux-throttle';
import createDebounce from 'redux-debounced';

const defaultWait = 300
const defaultThrottleOption = {
  leading: true,
  trailing: true
}

const throttleMiddleware = throttle(defaultWait, defaultThrottleOption);
const debounceMiddleware = createDebounce();
const middleware = [thunk, throttleMiddleware, debounceMiddleware];
const middlewares = applyMiddleware(...middleware);
let composition = middlewares;

if (process.env.APP_STAGE !== 'prod' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  composition = compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 }))
}

export const Store = createStore(
  rootReducer,
  initialState,
  composition
);