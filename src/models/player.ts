import { Dispatch } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';
import { useRedux } from '../util/hook/redux';
import { GlobalState } from './reducers';

// Interfaces
import { PlayerInfo } from '../interface/player-info.interface';

const MIN_PLAYER_AMOUNT = 2;
const MAX_PLAYER_AMOUNT = 8;

export interface State {
	playerList: PlayerInfo[];
}

export const initialPlayer = createAction('INITINAL_PLAYER', () => {
	const createPlayerInfo = (): PlayerInfo => ({
		id: `${Math.random()}`,
		name: '',
		score: 0,
		cards: [],
	});

	return [createPlayerInfo(), createPlayerInfo()];
});

const addPlayer = createAction(
	'ADD_PLAYER',
	(playerName: string) => (_: Dispatch, getState: () => GlobalState) => {
		const {
			player: { playerList },
		} = getState();

		if (playerList.length >= MAX_PLAYER_AMOUNT) {
			return playerList;
		}

		const playerInfo: PlayerInfo = {
			id: `${Math.random()}`,
			name: playerName,
			score: 0,
			cards: [],
		};

		return [...playerList, playerInfo];
	},
);

const removePlayer = createAction(
	'REMOVE_PLAYER',
	(playerId: string) => (_: Dispatch, getState: () => GlobalState) => {
		const {
			player: { playerList },
		} = getState();

		if (playerList.length <= MIN_PLAYER_AMOUNT) {
			return playerList;
		}

		return playerList.filter(info => info.id !== playerId);
	},
);

const setPlayer = createAction(
	'SET_PLAYER',
	(info: Partial<PlayerInfo>) => (dispatch: Dispatch, getState: () => GlobalState) => {
		const {
			player: { playerList: list },
		} = getState();

		const prePlayerIndex = list.findIndex(oldPlayerInfo => oldPlayerInfo.id === info.id);
		const prePlayer = list[prePlayerIndex];

		if (!prePlayer) {
			return list;
		}

		const hasKey = (key: string) => info.hasOwnProperty(key);

		const newPlayer: PlayerInfo = {
			id: prePlayer.id,
			name: hasKey('name') ? info.name || '' : prePlayer.name,
			score: hasKey('score') ? info.score || 0 : prePlayer.score,
			cards: hasKey('cards') ? info.cards || [] : prePlayer.cards,
		};

		list[prePlayerIndex] = newPlayer;

		return [...list];
	},
);

export const addScoreToPlayer = createAction(
	'ADD_SCORE_TO_PLAYER',
	() => (dispatch: Dispatch, getState: () => GlobalState) => {
		const {
			player: { playerList },
			game: { currentPlayerId },
		} = getState();

		const playinngPlayer = playerList.find(playerInfo => playerInfo.id === currentPlayerId);

		if (playinngPlayer) {
			const newPlayer: PlayerInfo = {
				...playinngPlayer,
				score: playinngPlayer.score + 3,
			};
			dispatch(setPlayer(newPlayer));
		}
	},
);

const clearAllPlayerScore = createAction(
	'CLEAR_ALL_PLAYER_SCORE',
	() => (dispatch: Dispatch, getState: () => GlobalState) => {
		const {
			player: { playerList },
		} = getState();

		const newPlayerList = playerList.map(playerInfo => ({
			...playerInfo,
			score: 0,
		}));

		return newPlayerList;
	},
);

export const defaultState: State = {
	playerList: [],
};

export const reducer = {
	player: handleActions<State, any>(
		{
			ADD_PLAYER: (state: State, action: Action<PlayerInfo[]>) => {
				return {
					...state,
					playerList: action.payload,
				};
			},
			INITINAL_PLAYER: (state: State, action: Action<PlayerInfo[]>) => {
				return {
					...state,
					playerList: [...action.payload],
				};
			},
			REMOVE_PLAYER: (state: State, action: Action<PlayerInfo[]>) => {
				return {
					...state,
					playerList: action.payload,
				};
			},
			SET_PLAYER: (state: State, action: Action<PlayerInfo[]>) => {
				return {
					...state,
					playerList: [...action.payload],
				};
			},
			CLEAR_ALL_PLAYER_SCORE: (state: State, action: Action<PlayerInfo[]>) => ({
				...state,
				playerList: [...action.payload],
			}),
		},
		defaultState,
	),
};

const playerSelector = (state: GlobalState) => ({
	playerList: state.player.playerList,
});

const playerActionMap = {
	addPlayer,
	initialPlayer,
	removePlayer,
	setPlayer,
	addScoreToPlayer,
	clearAllPlayerScore,
};

type PlayerSelector = ReturnType<typeof playerSelector>;
type PlayerActionMap = typeof playerActionMap;

export const usePlayer = () =>
	useRedux<PlayerSelector, PlayerActionMap>(playerSelector, playerActionMap);
