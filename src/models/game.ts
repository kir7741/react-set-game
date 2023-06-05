import { Action, createAction, handleActions } from 'redux-actions';
import { useRedux } from '../util/hook/redux';
import { GlobalState } from './reducers';

import { CardInfo } from '../interface/card-info.interface';
import { AmountType } from '../enum/amount-type.enum';
import { ColorType } from '../enum/color-type.enum';
import { FillType } from '../enum/fill-type.enum';
import { ShapeType } from '../enum/shape-type.enum';
import { CardStatusType } from '../enum/card-status-type.enum';

export interface State {
	pileOfCards: CardInfo[];
}

export const defaultState: State = {
	pileOfCards: [],
};

export const initialPileOfCards = createAction('INITIAL_PILE_OF_CARDS', () => {
	const amountList = [AmountType.ONE, AmountType.TWO, AmountType.THREE];
	const colorList = [ColorType.RED, ColorType.GREEN, ColorType.BLUE];
	const fillList = [FillType.TRANSPARENT, FillType.FILLED, FillType.SLASH];
	const shapeList = [ShapeType.CIRCLE, ShapeType.SQUARE, ShapeType.TRIANGLE];
	const pileOfCards: CardInfo[] = [];

	// 生成牌組
	for (const amount of amountList) {
		for (const color of colorList) {
			for (const fill of fillList) {
				for (const shape of shapeList) {
					pileOfCards.push({
						amount,
						color,
						fill,
						shape,
						status: CardStatusType.DECK,
					});
				}
			}
		}
	}

	// 洗牌
	for (let i = 0; i < pileOfCards.length; i++) {
		const j = Math.floor(Math.random() * pileOfCards.length);
		const temp = pileOfCards[i];
		pileOfCards[i] = pileOfCards[j];
		pileOfCards[j] = temp;
	}

	return pileOfCards;
});

export const reducer = {
	game: handleActions<State, any>(
		{
			INITIAL_PILE_OF_CARDS: (state: State, action: Action<CardInfo[]>) => ({
				...state,
				pileOfCards: action.payload || [],
			}),
		},
		defaultState,
	),
};

const gameSelector = (state: GlobalState) => ({
	pileOfCards: state.game.pileOfCards,
});

const gameActionMap = {
	initialPileOfCards,
};

type GameSelector = ReturnType<typeof gameSelector>;
type GameActionMap = typeof gameActionMap;

export const usePlayer = () => useRedux<GameSelector, GameActionMap>(gameSelector, gameActionMap);
