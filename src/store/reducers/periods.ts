import { PeriodsState, AppReducer, SimpleReducer } from '../storeTypes';
import { TaskPeriodsTypes } from '../actions/actionTypes';
import { SetTaskPeriodsActionPayload } from '../actions/periods';

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

const reducer: AppReducer<PeriodsState, TaskPeriodsTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case TaskPeriodsTypes.SetTaskPeriods:
			return setTaskPeriods(state, action);
		default:
			return state;
	}
};

export default reducer;
