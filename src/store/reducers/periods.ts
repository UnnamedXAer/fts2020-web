import { PeriodsState, AppReducer, SimpleReducer } from '../storeTypes';
import { TaskPeriodsActionTypes } from '../actions/actionTypes';
import {
	SetTaskPeriodsActionPayload,
	CompletePeriodActionPayload,
	SetCurrentPeriodsActionPayload,
} from '../actions/periods';

const initialState: PeriodsState = {
	taskPeriods: {},
	currentPeriods: null,
};

const setTaskPeriods: SimpleReducer<
	PeriodsState,
	SetTaskPeriodsActionPayload
> = (state, action) => {
	const { periods, taskId } = action.payload;

	const updatedPeriods = { ...state.taskPeriods };

	updatedPeriods[taskId] = periods;

	return {
		...state,
		taskPeriods: updatedPeriods,
	};
};
const setCurrentPeriods: SimpleReducer<
	PeriodsState,
	SetCurrentPeriodsActionPayload
> = (state, action) => {
	const { periods } = action.payload;
	const updatedCurrentPeriods = [...periods];

	return {
		...state,
		currentPeriods: updatedCurrentPeriods,
	};
};

const completePeriod: SimpleReducer<
	PeriodsState,
	CompletePeriodActionPayload
> = (state, action) => {
	const { period, taskId } = action.payload;

	const updatedPeriods = { ...state.taskPeriods };
	const updatedTaskPeriods = [...updatedPeriods[taskId]];
	const periodIdx = updatedTaskPeriods.findIndex((x) => x.id === period.id);
	updatedTaskPeriods[periodIdx] = period;
	updatedPeriods[taskId] = updatedTaskPeriods;

	return {
		...state,
		taskPeriods: updatedPeriods,
	};
};

const clearTaskPeriods: SimpleReducer<PeriodsState, { taskId: number }> = (
	state,
	action
) => {
	const updatedPeriods = { ...state.taskPeriods };
	delete updatedPeriods[action.payload.taskId];

	return {
		...state,
		taskPeriods: updatedPeriods,
	};
};

const clearState: SimpleReducer<PeriodsState, undefined> = (state, action) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<PeriodsState, TaskPeriodsActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case TaskPeriodsActionTypes.SetTaskPeriods:
			return setTaskPeriods(state, action);
		case TaskPeriodsActionTypes.SetCurrentPeriods:
			return setCurrentPeriods(state, action);
		case TaskPeriodsActionTypes.CompletePeriod:
			return completePeriod(state, action);
		case TaskPeriodsActionTypes.ClearTaskPeriods:
			return clearTaskPeriods(state, action);
		case TaskPeriodsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
