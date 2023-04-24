import { compose, createStore, Store } from "redux";
import reducers, { GlobalState } from '../models/reducers';

let composeEnhancers = compose;

composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line @typescript-eslint/no-explicit-any

export default function configureStore(preState: GlobalState): Store {
  const store = createStore(reducers, preState, composeEnhancers());
  return store;
}
