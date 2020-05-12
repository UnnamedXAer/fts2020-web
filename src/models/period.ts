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
