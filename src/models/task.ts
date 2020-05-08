import User from './user';

export enum TaskPeriodUnit {
	'HOUR' = 'HOUR',
	'DAY' = 'DAY',
	'WEEK' = 'WEEK',
	'MONTH' = 'MONTH',
	'YEAR' = 'YEAR',
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
	createBy?: number;
	createAt?: Date;
	owner?: User;

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
			createAt,
			createBy,
			owner,
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
		this.createAt = createAt;
		this.createBy = createBy;
		this.owner = owner;
	}
}
export class UserTask {
	id?: number;
	flatId?: number;
	flatName?: string;
	name?: string;
	timePeriodUnit?: TaskPeriodUnit;
	timePeriodValue?: number;
	active?: boolean;

	constructor(params: UserTask = {} as UserTask) {
		const {
			id,
			flatId,
			name,
			flatName,
			timePeriodUnit,
			timePeriodValue,
			active,
		} = params;

		this.id = id;
		this.flatId = flatId;
		this.name = name;
		this.flatName = flatName;
		this.timePeriodUnit = timePeriodUnit;
		this.timePeriodValue = timePeriodValue;
		this.active = active;
	}
}
