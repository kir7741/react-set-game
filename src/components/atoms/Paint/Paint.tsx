/* eslint-disable react-hooks/exhaustive-deps */
import { HTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';

import { useGame } from '../../../models/game';
import { GlobalState } from '../../../models/reducers';

import useCanvas from '../../../util/hook/useCanvas';

import { CardInfo } from '../../../interface/card-info.interface';

import styles from './Paint.module.css';

/**
 * 樣式的介面
 *
 * @interface StyleMap
 */
interface StyleMap {
	deck: string;
}

interface PaintProperty extends HTMLAttributes<HTMLDivElement> {
	styleMap?: Partial<StyleMap>;
}

export interface PaintRefProperty {
	redrawCardsOfDeck: () => void;
}

const Paint = forwardRef<PaintRefProperty, PaintProperty>(({ styleMap = {} }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [, { selectedCard, drawCardsOfDeck }] = useGame();

	const [{ fabricRef }, { toggleCardSelected, drawCard }] = useCanvas(canvasRef, {
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const drawFn = (card: CardInfo, index: number, getState: () => GlobalState) => {
		drawCard(card, index, () => {
			const {
				game: { currentPlayerId },
			} = getState();
			if (!currentPlayerId) {
				return;
			}
			toggleCardSelected(card.id);
			selectedCard(card.id, card.status);
		});
	};

	useEffect(() => {
		// dependency array 有 cardsOfDeck 時，不論有沒有 clear 都無法切換狀態
		// dependency array 有 fabricRef.current 時，沒有 clear 無法切換狀態，有 clear 要第二次才會切換狀態
		if (fabricRef) {
			drawCardsOfDeck(fabricRef, drawFn);
		}
	}, [fabricRef]);

	useImperativeHandle(ref, () => ({
		redrawCardsOfDeck: () => {
			drawCardsOfDeck(fabricRef, drawFn);
		},
	}));

	return (
		<div className={classnames(styles.deck, styleMap.deck)}>
			<canvas ref={canvasRef} />
		</div>
	);
});

export default Paint;
