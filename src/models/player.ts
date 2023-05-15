import { Action, createAction, handleActions } from 'redux-actions';
import { useRedux } from '../util/hook/redux';
import { GlobalState } from './reducers';

// Interfaces
import { PlayerInfo } from '../interface/player-info.interface';

export interface State {

  playerList: PlayerInfo[];

}

export const addPlayer = createAction('ADD_PLAYER', (playerName: string) => {
  const playerInfo: PlayerInfo = {
    id: Math.random() + '',
    name: playerName,
    score: 0,
    playingStatus: false,
    cards: []
  }
  return [playerInfo];
})

export const setPlayer = createAction('SET_PLAYER', (playerName: string) => {
  const playerInfo: PlayerInfo = {
    id: Math.random() + '',
    name: playerName,
    score: 0,
    playingStatus: false,
    cards: []
  }
  return [playerInfo];
})

export const defaultState: State = {
	playerList: []
};

export const reducer = {
  player: handleActions<State, any>(
    {
      ADD_PLAYER: (state: State, action: Action<PlayerInfo[]>) => {
        return {
          ...state, 
          playerList: [...state.playerList, ...action.payload]
        }
      },
      SET_PLAYER: (state: State, action: Action<PlayerInfo[]>) => {
        return {
          ...state, 
          playerList: [...action.payload]
        }
      },

    },
    defaultState
  )
}

const playerSelector = (state: GlobalState) => ({
	playerList: state.player.playerList
});

const playerActionMap = {
  addPlayer,
  setPlayer
}

type PlayerSelector = ReturnType<typeof playerSelector>;
type PlayerActionMap = typeof playerActionMap;

export const usePlayer = () =>
	useRedux<PlayerSelector, PlayerActionMap>(playerSelector, playerActionMap);
