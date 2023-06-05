import React from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Game from '../pages/Game/Game';

import { Dispatch } from 'redux';
import { initialPlayer } from '../models/player';

const homeLoader = (dispatch: Dispatch) => () => {
	dispatch(initialPlayer());
	return null;
};

const Router: React.FC = () => {
	const dispatch = useDispatch();
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Home />,
			loader: homeLoader(dispatch),
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

	return <RouterProvider router={router} />;
};

export default Router;
