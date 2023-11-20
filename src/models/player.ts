import { Dispatch } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';
import { useRedux } from '../util/hook/redux';
import { GlobalState } from './reducers';

// Interfaces
import { PlayerInfo } from '../interface/player-info.interface';

export interface State {
	playerList: PlayerInfo[];
}

const addPlayer = createAction(
	'ADD_PLAYER',
	(playerName: string) => (_: Dispatch, getState: () => GlobalState) => {
		const playerInfo: PlayerInfo = {
			id: Math.random() + '',
			name: playerName,
			score: 0,
			playingStatus: false,
			cards: [],
		};
		return [playerInfo];
	},
);

export const initialPlayer = createAction('INITINAL_PLAYER', () => {
	const createPlayerInfo = (): PlayerInfo => ({
		id: Math.random() + '',
		name: '',
		score: 0,
		playingStatus: false,
		cards: [],
	});

	return [createPlayerInfo(), createPlayerInfo()];
});

const removePlayer = createAction('REMOVE_PLAYER', (playerId: string) => playerId);

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
			playingStatus: hasKey('playingStatus')
				? info.playingStatus || false
				: prePlayer.playingStatus,
			cards: hasKey('cards') ? info.cards || [] : prePlayer.cards,
		};

		list[prePlayerIndex] = newPlayer;

		return list.concat();
	},
);

export const addScoreToPlayer = createAction(
	'ADD_SCORE_TO_PLAYER',
	() => (dispatch: Dispatch, getState: () => GlobalState) => {
		const {
			player: { playerList },
		} = getState();

		const playinngPlayer = playerList.find(playerInfo => playerInfo.playingStatus);

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
					playerList: [...state.playerList, ...action.payload],
				};
			},
			INITINAL_PLAYER: (state: State, action: Action<PlayerInfo[]>) => {
				return {
					...state,
					playerList: [...action.payload],
				};
			},
			REMOVE_PLAYER: (state: State, action: Action<string>) => {
				return {
					...state,
					playerList: state.playerList.filter(info => info.id !== action.payload),
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
