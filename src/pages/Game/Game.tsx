import React, { useEffect, useState } from 'react';

import RaceAnswerDialog from '../../components/molecules/RaceAnswerDialog/RaceAnswerDialog';

import { usePlayer } from '../../models/player';

import styles from './Game.module.css';
import Paint from '../../components/atoms/Paint/Paint';
import { useGame } from '../../models/game';

const Game = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [{ playerList }, { setPlayer }] = usePlayer();
	const [{
	},
	{
		setCurrentPlayerId
	}
	] = useGame();

	useEffect(() => {
		setIsOpen(true);
	}, []);

	useEffect(() => {
		setIsOpen(true);
	}, []);

	return (
		<>

			<div className={styles['player-list']}>
				{
					playerList.map(playerInfo => (
						<div key={playerInfo.id}>
							<p>{playerInfo.name}</p>
							<button 
								type="button" 
								onClick={() => {

									// TODO: 更新 player 狀態，paint拿到新狀態 => 怪異，可能是reference 引起，待複查
									setPlayer({
										...playerInfo,
										playingStatus: true
									});
									setIsOpen(false);

									// TODO: 更新 當前玩遊戲的 playerId 狀態， paint拿不到新狀態 => 正常
									setCurrentPlayerId(playerInfo.id)
									setIsOpen(false);

								}}
							>
								搶答
							</button>
							
						</div>
					))
				}
			</div>

			<div className="home">
				<Paint id="test"></Paint>
			</div>


				{/* 彈窗，之後可能拿來做其他用途顯示分數之類的 */}
		{/* 
			<RaceAnswerDialog
				isOpen={isOpen}
				onChoosePlayer={id => {
					const list = [...playerList];
					list.find(player => player.id === id)!.playingStatus = true;
					setPlayer(list);
					setIsOpen(false);
				}}
			/> */}
		</>
	);
};

export default Game;
