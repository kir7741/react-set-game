import { Dispatch } from 'redux';
import { fabric } from 'fabric';
import { Action, createAction, handleActions } from 'redux-actions';
import { NavigateFunction } from 'react-router-dom';
import { useRedux } from '../util/hook/redux';
import { GlobalState } from './reducers';

import { CardInfo } from '../interface/card-info.interface';
import { AmountType } from '../enum/amount-type.enum';
import { ColorType } from '../enum/color-type.enum';
import { FillType } from '../enum/fill-type.enum';
import { ShapeType } from '../enum/shape-type.enum';
import { CardStatusType } from '../enum/card-status-type.enum';
import { checkSet } from '../util/helper/check-set';
import { addScoreToPlayer } from './player';

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

	/**
	 * 得分後的卡片
	 *
	 * @type {CardInfo[]}
	 * @memberof State
	 */
	scoredCards: CardInfo[];

	/**
	 * 是否已經選了足夠張數的卡片
	 *
	 * @type {boolean}
	 * @memberof State
	 */
	isSelectedEnoughCards: boolean;

	/**
	 * 是否結束遊戲
	 *
	 * @type {boolean}
	 * @memberof State
	 */
	isGameOver: boolean;

	/**
	 * 當前正在玩遊戲的玩家 id
	 *
	 * @type {string}
	 * @memberof State
	 */
	currentPlayerId: string;

}

export const defaultState: State = {
	pileOfCards: [],
	cardsOfDeck: [],
	scoredCards: [],
	isSelectedEnoughCards: false,
	isGameOver: false,
	currentPlayerId: ''
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
export const dealCard = createAction(
	'DEAL_THE_CARD',
	() => (_: Dispatch, getState: () => GlobalState) => {
		const {
			game: { pileOfCards, cardsOfDeck },
		} = getState();

		const amtOfCardOfDeck = cardsOfDeck.length;
		let returnPileOfCards = [...pileOfCards];
		let returnCardOfDeck = [...cardsOfDeck];

		// 補到12張
		if (amtOfCardOfDeck < 12) {
			for (let i = 0; i < 12 - amtOfCardOfDeck; i++) {
				const card = returnPileOfCards.shift();
				if (card) {
					card.status = CardStatusType.TABLE_BOARD;
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

			for (let i = index; i < returnCardOfDeck.length; i++) {
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
		};

		// 先檢查一次，發的牌是否有配對的組合
		check([], 0);
		while (!isFoundSet && returnPileOfCards.length) {
			for (let i = 0; i < 3; i++) {
				const card = returnPileOfCards.shift();
				if (card) {
					card.status = CardStatusType.TABLE_BOARD;
					returnCardOfDeck.push(card);
				}
			}

			check([], 0);
		}

		const isGameOver = returnPileOfCards.length < 66;
		// TODO:為了測試先使用上面條件
		// const isGameOver = !isFoundSet && returnPileOfCards.length === 0;

		return {
			pileOfCards: returnPileOfCards,
			cardsOfDeck: returnCardOfDeck,
			isGameOver,
		};
	},
);

/**
 * 改變牌桌上卡片的狀態
 */
export const updateCardStatus = createAction(
	'UPDATE_CARD_STATUS',
	(cardId: string, status: CardStatusType) => (_: Dispatch, getState: () => GlobalState) => {
		const {
			game: { cardsOfDeck },
		} = getState();

		const foundIndex = cardsOfDeck.findIndex(cardInfo => cardInfo.id === cardId);
		console.log(cardId);
		console.log(status);
		if (foundIndex !== -1) {
			console.log('found', foundIndex);
			cardsOfDeck[foundIndex] = {
				...cardsOfDeck[foundIndex],
				status,
			};
		}
		return [...cardsOfDeck];
	},
);

/**
 * 將得分的排移到得分排堆
 */
export const moveCardsToScoredList = createAction(
	'MOVE_CARDS_TO_SCORED_LIST',
	(cardList: CardInfo[]) => (_: Dispatch, getState: () => GlobalState) => {
		const {
			game: { cardsOfDeck, scoredCards },
		} = getState();

		const filtedCardOfDeck = cardsOfDeck.filter(cardInfo => {
			return !cardList.find(selectdCard => {
				return selectdCard.id === cardInfo.id;
			});
		});

		return {
			cardsOfDeck: filtedCardOfDeck,
			scoredCards: [...scoredCards, ...cardList],
		};
	},
);

/**
 * 設定是否選齊足夠的牌卡
 */
export const setSelectedEnoughCards = createAction(
	'SET_SELECTED_ENOUGH_CARDS',
	(status: boolean) => status,
);

/**
 * 選擇卡片
 */
export const selectedCard = createAction(
	'SELECTED_CARD',
	(cardId: string, status: CardStatusType) => (dispatch: Dispatch, getState: () => GlobalState) => {
		const {
			game: { cardsOfDeck: originCardsOfDeck },
		} = getState();
		const foundCard = originCardsOfDeck.find(card => card.id === cardId);

		dispatch(
			updateCardStatus(
				cardId,
				foundCard?.status === CardStatusType.TABLE_BOARD
					? CardStatusType.PICKED
					: CardStatusType.TABLE_BOARD,
			),
		);

		const {
			game: { cardsOfDeck: afterDispatchCardsOfDeck },
		} = getState();

		const pickedCards = afterDispatchCardsOfDeck.filter(
			cardInfo => cardInfo.status === CardStatusType.PICKED,
		);
		dispatch(setSelectedEnoughCards(pickedCards.length === 3));
	},
);

export const chooseCorrectCard = createAction(
	'CHOOSE_CORRECT_CARD',
	(selectedCards: CardInfo[]) => (dispatch: Dispatch, getState: () => GlobalState) => {
		dispatch(moveCardsToScoredList(selectedCards));
		dispatch(addScoreToPlayer());
		dispatch(dealCard());
	},
);

export const drawCardsOfDeck = createAction(
	'DRAW_CARDS_OF_DECK',
	(
			fabricRef: React.MutableRefObject<fabric.Canvas | null>,
			drawFn: (card: CardInfo, index: number, getState: () => GlobalState) => void,
		) =>
		(_: Dispatch, getState: () => GlobalState) => {
			// TODO: 看看有沒有更好的方法，不用傳 getState 的方法
			const {
				game: { cardsOfDeck },
			} = getState();
			fabricRef.current?.clear();
			cardsOfDeck.forEach((cardInfo, index) => {
				drawFn(cardInfo, index, getState);
			});
		},
);

export const chooseErrorCard = createAction('CHOOSE_ERROR_CARD', (selectedCards: CardInfo[]) => {});

const endGame = createAction(
	'END_GAME',
	(navigation: NavigateFunction) => (_: Dispatch, getState: () => GlobalState) => {
		const {
			game: { isGameOver }
		} = getState();

		if (isGameOver) {
			navigation('/score');
		}
	},
);

const setCurrentPlayerId = createAction(
	'SET_CURRENT_PLAYER_ID', 
	(id: string) => id
)
export const reducer = {
	game: handleActions<State, any>(
		{
			INITIAL_PILE_OF_CARDS: (state: State, action: Action<CardInfo[]>) => ({
				...state,
				pileOfCards: [...action.payload],
				cardsOfDeck: [],
				scoredCards: [],
			}),
			DEAL_THE_CARD: (state: State, action: Action<State>) => ({
				...state,
				pileOfCards: [...action.payload.pileOfCards],
				cardsOfDeck: [...action.payload.cardsOfDeck],
				isGameOver: action.payload.isGameOver,
			}),
			UPDATE_CARD_STATUS: (state: State, action: Action<CardInfo[]>) => ({
				...state,
				cardsOfDeck: action.payload,
			}),
			MOVE_CARDS_TO_SCORED_LIST: (state: State, action: Action<Partial<State>>) => ({
				...state,
				cardsOfDeck: action.payload.cardsOfDeck || [],
				scoredCards: action.payload.scoredCards || [],
			}),
			SET_SELECTED_ENOUGH_CARDS: (state: State, action: Action<boolean>) => ({
				...state,
				isSelectedEnoughCards: action.payload,
			}),
			SET_CURRENT_PLAYER_ID: (state: State, action: Action<string>) => ({
				...state,
				currentPlayerId: action.payload
			})
			// CHOOSE_CORRECT_CARD: (state: State, action: Action<Partial<State>>) => ({
			// 	...state,
			// 	cardsOfDeck: action.payload.cardsOfDeck || [],
			// 	scoredCards: action.payload.scoredCards || [],
			// })
		},
		defaultState,
	),
};

// export const
const gameSelector = (state: GlobalState) => ({
	pileOfCards: state.game.pileOfCards,
	cardsOfDeck: state.game.cardsOfDeck,
	scoredCards: state.game.scoredCards,
	isSelectedEnoughCards: state.game.isSelectedEnoughCards,
	currentPlayerId: state.game.currentPlayerId,
});

const gameActionMap = {
	initialPileOfCards,
	dealCard,
	updateCardStatus,
	moveCardsToScoredList,
	selectedCard,
	chooseCorrectCard,
	drawCardsOfDeck,
	endGame,
	setCurrentPlayerId,
	setSelectedEnoughCards,
};

type GameSelector = ReturnType<typeof gameSelector>;
type GameActionMap = typeof gameActionMap;

export const useGame = () => useRedux<GameSelector, GameActionMap>(gameSelector, gameActionMap);
