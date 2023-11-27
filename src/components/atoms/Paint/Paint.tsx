import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardInfo } from '../../../interface/card-info.interface';
import { CardStatusType } from '../../../enum/card-status-type.enum';
import useCanvas from '../../../util/hook/useCanvas';
import { useGame } from '../../../models/game';
import { checkSet } from '../../../util/helper/check-set';
import { usePlayer } from '../../../models/player';
import { GlobalState } from '../../../models/reducers';

/**
 * 樣式的介面
 *
 * @interface StyleMap
 */
interface StyleMap {}

interface PaintProperty extends HTMLAttributes<HTMLDivElement> {
	/**
	 * 元件 id
	 *
	 * @type {string}
	 * @memberof PaintProperty
	 */
	id: string;

}

const Paint: React.FC<PaintProperty> = ({
	id
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const navigation = useNavigate();
	const [
		{ cardsOfDeck, isSelectedEnoughCards, currentPlayerId},
		{ selectedCard, chooseCorrectCard, drawCardsOfDeck, endGame, setCurrentPlayerId, setSelectedEnoughCards },
	] = useGame();

	const [
		{ playerList }
	] = usePlayer();

	const [{ fabricRef }, { toggleCardSelected, drawCard }] = useCanvas(canvasRef, {
		width: window.innerWidth,
		height: window.innerHeight,
	});


	const drawFn = (card: CardInfo, index: number, getState: () => GlobalState) => {
		drawCard(card, index, () => {
			const {
				game: { currentPlayerId },
			} = getState();
			// TODO: 待解 playerList 為何可以成功，currentPlayerId卻無法
			// setPlayer, setCurrentPlayerId
			if (!currentPlayerId) {
				return;
			}
			// if (playerList.every((player) => !player.playingStatus)) {
			// 	return;
			// }
			toggleCardSelected(card.id);
			selectedCard(card.id, card.status);
		});
	}

	useEffect(() => {
		// dependency array 有 cardsOfDeck 時，不論有沒有 clear 都無法切換狀態
		// dependency array 有 fabricRef.current 時，沒有 clear 無法切換狀態，有 clear 要第二次才會切換狀態
		if (fabricRef) {
			drawCardsOfDeck(fabricRef,drawFn);
		}
	}, [fabricRef]);

	return (
		<>
			<canvas ref={canvasRef} />
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
							drawCardsOfDeck(fabricRef, drawFn);
							endGame(navigation);
						} else {
							// 沒選擇正確的處理
							// selectedCard.forEach((card) => toggleCardSelected(card.id));
						}
						setCurrentPlayerId('');
						setSelectedEnoughCards(false);
						// 4. 否 清空，跳通知 回到選擇角色頁面
						
					}}
				>
					確定選完了嗎？
				</button>
			)}
		</>
	);
};

export default Paint;
