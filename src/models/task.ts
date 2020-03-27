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
	title?: string;
	description?: string;
	startDate?: Date;
	endDate?: Date;
	timePeriodUnit?: TaskPeriodUnit;
	timePeriodValue?: number;
	active?: boolean;
	createBy?: number;
	createAt?: Date;

	constructor(params: Task = {} as Task) {
		const {
			id,
			flatId,
			title,
			description,
			startDate,
			endDate,
			timePeriodUnit,
			timePeriodValue,
			active,
			createBy,
			createAt
		} = params;

		this.id = id;
		this.flatId = flatId;
		this.title = title;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.timePeriodUnit = timePeriodUnit;
		this.timePeriodValue = timePeriodValue;
		this.active = active;
		this.createBy = createBy;
		this.createAt = createAt;
	}
}