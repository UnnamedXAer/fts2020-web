import { PeriodsState, AppReducer, SimpleReducer } from '../storeTypes';
import { TaskPeriodsActionTypes } from '../actions/actionTypes';
import {
	SetTaskPeriodsActionPayload,
	CompletePeriodActionPayload,
} from '../actions/periods';

const initialState: PeriodsState = {
	taskPeriods: {},
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
		case TaskPeriodsActionTypes.CompletePeriod:
			return completePeriod(state, action);
		case TaskPeriodsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
