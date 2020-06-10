import { APIUser, mapApiUserDataToModel } from '../store/actions/users';
import {
	APIFlat,
	mapAPIFlatDataToModel,
	APIInvitation,
} from '../store/actions/flats';
import User from './user';
import Flat from './flat';

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
	'RESEND' = 'RESEND',
}

export enum InvitationStatus {
	'CREATED' = 'CREATED',
	'SEND_ERROR' = 'SEND_ERROR',
	'PENDING' = 'PENDING',
	'ACCEPTED' = 'ACCEPTED',
	'REJECTED' = 'REJECTED',
	'EXPIRED' = 'EXPIRED',
	'CANCELED' = 'CANCELED',
}

export const InvitationStatusInfo = {
	[InvitationStatus.ACCEPTED]: 'Accepted.',
	[InvitationStatus.CANCELED]: 'Cancelled by sender.',
	[InvitationStatus.EXPIRED]: 'Expired.',
	[InvitationStatus.CREATED]: 'Not sent yet.',
	[InvitationStatus.PENDING]: 'Waiting for accept.',
	[InvitationStatus.REJECTED]: 'Rejected by person.',
	[InvitationStatus.SEND_ERROR]: 'Not sent - error.',
};

export type APIInvitationPresentation = {
	id: APIInvitation['id'];
	status: APIInvitation['status'];
	sendDate: APIInvitation['sendDate'];
	actionDate: APIInvitation['actionDate'];
	createAt: APIInvitation['createAt'];
	sender: APIUser;
	invitedPerson: APIUser | string;
	flat: APIFlat;
	flatOwner: APIUser;
};

export class InvitationPresentation {
	public id: number;
	public invitedPerson: string | User;
	public sendDate: Date | null;
	public status: InvitationStatus;
	public actionDate: Date | null;
	public createAt: Date;
	public sender: User;
	public flat: Flat;
	constructor(data: APIInvitationPresentation) {
		this.id = data.id;
		this.invitedPerson =
			typeof data.invitedPerson === 'string'
				? data.invitedPerson
				: mapApiUserDataToModel(data.invitedPerson);
		this.status = data.status;
		this.sendDate =
			typeof data.sendDate === 'string'
				? new Date(data.sendDate)
				: data.sendDate;
		this.actionDate = data.actionDate
			? typeof data.actionDate === 'string'
				? new Date(data.actionDate)
				: data.actionDate
			: null;
		this.createAt =
			typeof data.createAt === 'string'
				? new Date(data.createAt)
				: data.createAt;
		this.sender = User.fromData({
			...data.sender,
		});
		this.flat = mapAPIFlatDataToModel(data.flat);
		this.flat.owner = mapApiUserDataToModel(data.flatOwner);
	}
}

export default Invitation;
