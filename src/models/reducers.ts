import { combineReducers } from "redux";

import * as player from './player';
import * as game from './game';

export interface GlobalState {
  player: player.State,
  game: game.State,
}

export const defaultGlobalState: GlobalState = {
  player: player.defaultState,
  game: game.defaultState,
};

const reducers = combineReducers<GlobalState>({
  ...player.reducer,
  ...game.reducer,
});

export default reducers;
