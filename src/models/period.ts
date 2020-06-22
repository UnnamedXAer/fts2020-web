export type PeriodUser = {
	emailAddress: string;
	userName: string;
};

export class Period {
	id: number;
	startDate: Date;
	endDate: Date;
	assignedTo: PeriodUser;
	completedBy: PeriodUser | null;
	completedAt: Date | null;

	constructor(params: Period = {} as Period) {
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
		this.assignedTo = assignedTo;
		this.completedBy = completedBy;
		this.completedAt = completedAt;
	}
}

export class CurrentPeriod {
	id: number;
	taskId: number;
	taskName: string;
	startDate: Date;
	endDate: Date;

	constructor(params: CurrentPeriod = {} as CurrentPeriod) {
		const { id, taskId, taskName, startDate, endDate } = params;

		this.id = id;
		this.taskId = taskId;
		this.taskName = taskName;
		this.startDate = startDate;
		this.endDate = endDate;
	}
}
