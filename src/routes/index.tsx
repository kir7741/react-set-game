import React from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dispatch } from 'redux';

import Game from '../pages/Game/Game';
import Home from '../pages/Home/Home';
import Score from '../pages/Score/Score';
import GameGuard from './guards/GameGuard';

import { initialPlayer } from '../models/player';
import { initialPileOfCards, dealCard } from '../models/game';

const homeInitLoader = (dispatch: Dispatch) => () => {
	dispatch(initialPlayer());
	return null;
};

const gameInitLoader = (dispatch: Dispatch) => () => {
	dispatch(initialPileOfCards());
	dispatch(dealCard());
	return null;
};

const Router: React.FC = () => {
	const dispatch = useDispatch();
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Home />,
			loader: homeInitLoader(dispatch),
		},
		{
			path: 'game',
			element: 
				<GameGuard>
					<Game />
				</GameGuard>,
			loader: gameInitLoader(dispatch),
		},
		{
			path: 'score',
			element: <Score />,
		}
	], {
		basename: process.env.PUBLIC_URL || ''
	});

	return <RouterProvider router={router} />;
};

export default Router;
