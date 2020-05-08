import User from './user';

export class TaskPeriod {
	id: number;
	startDate: Date;
	endDate: Date;
	assignedTo: User;
	completedBy?: User;
	completedAt?: Date;

	constructor(params: TaskPeriod = {} as TaskPeriod) {
		const {
			id,
			startDate,
			endDate,
			assignedTo,
			completedBy,
			completedAt,
		} = params;

		this.id = id;
		this.startDate = startDate;
		this.endDate = endDate;
		this.completedAt = completedAt;
		this.completedBy = completedBy;
		this.assignedTo = assignedTo;
	}
}
