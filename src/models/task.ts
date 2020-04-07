import User from './user';

export enum TaskPeriodUnit {
	'HOUR' = 'HOUR',
	'DAY' = 'DAY',
	'WEEK' = 'WEEK',
	'MONTH' = 'MONTH',
	'YEAR' = 'YEAR'
}

export default class Task {
	id?: number;
	flatId?: number;
	name?: string;
	description?: string;
	startDate?: Date;
	endDate?: Date;
	timePeriodUnit?: TaskPeriodUnit;
	timePeriodValue?: number;
	members?: User[];
	active?: boolean;
	createBy?: User;
	createById?: number;
	createAt?: Date;

	constructor(params: Task = {} as Task) {
		const {
			id,
			flatId,
			name,
			description,
			startDate,
			endDate,
			timePeriodUnit,
			timePeriodValue,
			members,
			active,
			createBy,
			createAt
		} = params;

		this.id = id;
		this.flatId = flatId;
		this.name = name;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.timePeriodUnit = timePeriodUnit;
		this.timePeriodValue = timePeriodValue;
		this.members = members;
		this.active = active;
		this.createBy = createBy;
		this.createAt = createAt;
	}
}
