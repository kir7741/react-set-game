import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home/Home';
import Game from './pages/Game/Game';

import configureStore from './store/store';
import { defaultGlobalState } from './models/reducers';

import './index.css';

import reportWebVitals from './reportWebVitals';
import { initialPlayer } from './models/player';
import { Dispatch } from 'redux';

const store = configureStore(defaultGlobalState);

const homeLoader = (dispatch: Dispatch) => () => {
  dispatch(initialPlayer(''));
  return null;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Router: React.FC = () => {
  const dispatch = useDispatch();
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      loader: homeLoader(dispatch)
    },
    {
      path: 'game',
      element: <Game />,
    },
    {
      path: 'score',
      element: <div>score</div>,
    },
  ]);

  return <RouterProvider router={router} />

}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
