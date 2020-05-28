interface InvitationParams {
	id: number;
	createBy: number;
	createAt: Date | string;
	emailAddress: string;
	actionDate: Date | string | null;
	sendDate: Date | string | null;
	status: InvitationStatus;
}

class Invitation {
	id: number;
	createBy: number;
	createAt: Date;
	emailAddress: string;
	actionDate: Date | null;
	sendDate: Date | null;
	status: InvitationStatus;

	constructor(params: InvitationParams = {} as InvitationParams) {
		const {
			id,
			createBy,
			createAt,
			emailAddress,
			actionDate,
			sendDate,
			status,
		} = params;

		this.id = id;
		this.createBy = createBy;
		this.createAt =
			typeof createAt === 'string' ? new Date(createAt) : createAt;
		this.emailAddress = emailAddress;
		this.actionDate =
			typeof actionDate === 'string' ? new Date(actionDate) : actionDate;
		this.sendDate =
			typeof sendDate === 'string' ? new Date(sendDate) : sendDate;
		this.status = status;
	}
}

export enum InvitationAction {
	'ACCEPT' = 'ACCEPT',
	'REJECT' = 'REJECT',
	'CANCEL' = 'CANCEL',
}

export enum InvitationStatus {
	'NOT_SENT' = 'NOT_SENT',
	'SEND_ERROR' = 'SEND_ERROR',
	'PENDING' = 'PENDING',
	'ACCEPTED' = 'ACCEPTED',
	'REJECTED' = 'REJECTED',
	'EXPIRED' = 'EXPIRED',
	'CANCELED' = 'CANCELED',
}

export const InvitationStatusInfo = {
	[InvitationStatus.ACCEPTED]: 'Accepted',
	[InvitationStatus.CANCELED]: 'Cancelled by sender.',
	[InvitationStatus.EXPIRED]: 'Expired',
	[InvitationStatus.NOT_SENT]: 'Not sent yet.',
	[InvitationStatus.PENDING]: 'Waiting for accept.',
	[InvitationStatus.REJECTED]: 'Rejected by person.',
	[InvitationStatus.SEND_ERROR]: 'Accepted',
};

export default Invitation;
