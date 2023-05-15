import { bindActionCreators, ActionCreatorsMapObject } from 'redux';

import { useSelector, useDispatch } from 'react-redux';

import { GlobalState } from '../../models/reducers';

type Selector<ReturnState> = (s: GlobalState) => ReturnState;

interface Option {
	shouldHooksUpdate?: (left: unknown, right: unknown) => boolean;
}

interface DefaultActionMap {
	[key: string]: (
		...params: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
	) => void;
}

export const useRedux = <ReturnState, ActionMap extends DefaultActionMap>(
	selector: Selector<ReturnState>,
	actions: ActionCreatorsMapObject,
	options: Option = {},
): [ReturnState, ActionCreatorsMapObject<ActionMap>] => {
	const state = useSelector<GlobalState, ReturnState>(selector, options.shouldHooksUpdate);
	const dispatch = useDispatch();

	// 強制轉型
	const boundActions = bindActionCreators<ActionMap, ActionCreatorsMapObject<ActionMap>>(
		actions,
		dispatch,
	);

	return [state, boundActions];
};
