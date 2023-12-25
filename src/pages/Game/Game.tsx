import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Paint, { PaintRefProperty } from '../../components/atoms/Paint/Paint';

import { useGame } from '../../models/game';
import { usePlayer } from '../../models/player';

import { checkSet } from '../../util/helper/check-set';

import { CardStatusType } from '../../enum/card-status-type.enum';

import styles from './Game.module.css';

const Game = () => {
	const [{ playerList }] = usePlayer();
	const paintRef = useRef<PaintRefProperty>(null);
	const navigation = useNavigate();
	const [
		{ cardsOfDeck, isSelectedEnoughCards, currentPlayerId },
		{ selectedCard, chooseCorrectCard, endGame, setCurrentPlayerId, setSelectedEnoughCards },
	] = useGame();
	return (
		<>
			<div className={styles['player-list']}>
				{playerList.map(playerInfo => (
					<div key={playerInfo.id}>
						<div className={styles['player-board']}> 
							<label>{`${playerInfo.name} - ${playerInfo.score || 0} 分`} </label>
							{!currentPlayerId && (
								<button
									className={styles['c-button']}
									type="button"
									onClick={() => {
										setCurrentPlayerId(playerInfo.id);
									}}
								>
									搶答
								</button>
							)}
						</div>

					</div>
				))}
			</div>
			<Paint ref={paintRef} />
			{isSelectedEnoughCards && (
				<button
					type="button"
					onClick={() => {
						// 1. 取得使用者選取的卡片
						const pickedCard = cardsOfDeck.filter(card => card.status === CardStatusType.PICKED);
						// 2. 檢查卡片是否可以得分
						if (checkSet(pickedCard)) {
							// 3. 若可以得分則更新卡片狀態，重新繪製牌桌上的卡片，直到排堆中沒有卡片
							chooseCorrectCard(pickedCard);
							paintRef.current?.redrawCardsOfDeck();
							endGame(navigation);
						} else {
							// 沒選擇正確的處理
							pickedCard.forEach(card => {
								selectedCard(card.id);
							});
							paintRef.current?.redrawCardsOfDeck();
						}
						setCurrentPlayerId('');
						setSelectedEnoughCards(false);
					}}
				>
					確定選完了嗎？
				</button>
			)}
		</>
	);
};

export default Game;
