import { applyMiddleware, compose, createStore, Store } from "redux";
import reducers, { GlobalState } from '../models/reducers';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk-fsa';
import promiseMiddleware from 'redux-promise-middleware';

let composeEnhancers = compose;
const middleware = [thunkMiddleware, promiseMiddleware, logger];

composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line @typescript-eslint/no-explicit-any

export default function configureStore(preState: GlobalState): Store {
  const store = createStore(reducers, preState, composeEnhancers(applyMiddleware(...middleware)));
  return store;
}
