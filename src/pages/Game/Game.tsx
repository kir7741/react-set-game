import React, { useEffect, useState } from 'react';

import RaceAnswerDialog from '../../components/molecules/RaceAnswerDialog/RaceAnswerDialog';

import { usePlayer } from '../../models/player';

import styles from './Game.module.css';
import Paint from '../../components/atoms/Paint/Paint';

const Game = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [{ playerList }, { setPlayer }] = usePlayer();

	useEffect(() => {
		setIsOpen(true);
	}, []);

	useEffect(() => {
		setIsOpen(true);
	}, []);

	return (
		<>
			<div className="home">
				{playerList.find(player => player.playingStatus)
					? <Paint id="test"></Paint>
					: ''}
			</div>
			<RaceAnswerDialog
				isOpen={isOpen}
				onChoosePlayer={id => {
					const list = [...playerList];
					list.find(player => player.id === id)!.playingStatus = true;
					setPlayer(list);
					setIsOpen(false);
				}}
			/>
		</>
	);
};

export default Game;
