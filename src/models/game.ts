import { Dispatch } from 'redux';
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

	/**
	 * 排堆卡片
	 *
	 * @type {CardInfo[]}
	 * @memberof State
	 */
	pileOfCards: CardInfo[];

	/**
	 * 桌面卡片
	 *
	 * @type {CardInfo[]}
	 * @memberof State
	 */
	cardsOfDeck: CardInfo[];
}

export const defaultState: State = {
	pileOfCards: [],
	cardsOfDeck: [],
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
						id: Math.random().toString(),
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

export const dealCard = createAction('DEAL_THE_CARD', () => (_: Dispatch, getState: () => GlobalState) => {

	const {
		game: {
			pileOfCards,
			cardsOfDeck
		}
	} = getState();

	const amtOfCardOfDeck = cardsOfDeck.length;
	let returnPileOfCards = [...pileOfCards];
	let returnCardOfDeck = [];

	// 補到12張
	if (amtOfCardOfDeck < 12) {
		for (let i = 0; i < 12 - amtOfCardOfDeck; i++) {
			const card = returnPileOfCards.shift();
			if (card) {
				returnCardOfDeck.push(card)
			}
		}
		console.log('returnPileOfCards', returnPileOfCards.length)
		// 確認是否有set
	} else if (false) {

	}

	return {
		pileOfCards: returnPileOfCards,
		cardsOfDeck: returnCardOfDeck,
	}

})

export const reducer = {
	game: handleActions<State, any>(
		{
			INITIAL_PILE_OF_CARDS: (state: State, action: Action<CardInfo[]>) => ({
				...state,
				pileOfCards: [...action.payload] || [],
				cardsOfDeck: []
			}),
			DEAL_THE_CARD: (state: State, action: Action<State>) => ({
				...state,
				pileOfCards: [...action.payload.pileOfCards] || [],
				cardsOfDeck: [...action.payload.cardsOfDeck] || [],
			}),
		},
		defaultState,
	),
};

const gameSelector = (state: GlobalState) => ({
	pileOfCards: state.game.pileOfCards,
	cardsOfDeck: state.game.cardsOfDeck,
});

const gameActionMap = {
	initialPileOfCards,
	dealCard
};

type GameSelector = ReturnType<typeof gameSelector>;
type GameActionMap = typeof gameActionMap;

export const useGame = () => useRedux<GameSelector, GameActionMap>(gameSelector, gameActionMap);
