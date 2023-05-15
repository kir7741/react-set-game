import { combineReducers } from "redux";

import * as player from './player' 

export interface GlobalState {
  player: player.State
}

export const defaultGlobalState: GlobalState = {
  player: player.defaultState
};

const reducers = combineReducers<GlobalState>({
  ...player.reducer
});

export default reducers;
