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
import { checkSet } from '../util/helper/check-set';

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

/**
 * 初始化排堆並洗牌
 */
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

/**
 * 發牌，發12張 + 判斷 是否有 set 後補排
 */
export const dealCard = createAction('DEAL_THE_CARD', () => (_: Dispatch, getState: () => GlobalState) => {

	const {
		game: {
			pileOfCards,
			cardsOfDeck
		}
	} = getState();

	const amtOfCardOfDeck = cardsOfDeck.length;
	let returnPileOfCards = [...pileOfCards];
	let returnCardOfDeck = [...cardsOfDeck];

	// 補到12張
	if (amtOfCardOfDeck < 12) {
		for (let i = 0; i < 12 - amtOfCardOfDeck; i++) {
			const card = returnPileOfCards.shift();
			if (card) {
				returnCardOfDeck.push(card);
			}
		}
	} 

	const selectedCards: CardInfo[] = [];
	let isFoundSet = false;
	const check = (checkSelectedCards: CardInfo[], index: number) => {

		if (isFoundSet) {
			return;
		}
		
		if (checkSelectedCards.length === 3) {
			isFoundSet = checkSet(checkSelectedCards);
			return;
		}

		for(let i = index ; i < returnCardOfDeck.length; i++) {

			if (!returnCardOfDeck[i]) {
				break;
			}
			selectedCards.push(returnCardOfDeck[i]);
			check(selectedCards, i + 1); 
			selectedCards.pop();

			if (isFoundSet) {
				break;
			}
		}
	}

	check([], 0);
	
	// 確認是否有set
	// 暫不考慮結束遊戲的情況
	// 但後續開始玩之後確認是否可以正確執行補牌
	// TODO: 7/10 開發搶答功能(預計以modal方式呈現) => 選卡片
	while (
		!isFoundSet &&
		returnPileOfCards.length
	) {
		for (let i = 0; i < 3; i++) {
			const card = returnPileOfCards.shift();
			if (card) {
				returnCardOfDeck.push(card);
			}
		}
		check([], 0);
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
