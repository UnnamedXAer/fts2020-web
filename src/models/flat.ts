import User from './user';

export default class Flat {
	id?: number;
	name: string;
	description: string;
	members?: User[];
	ownerId: number;
	owner?: User;
	createAt?: Date;

	constructor(prams: Flat = {} as Flat) {
		const {
			id,
			name,
			description,
			members,
			owner,
			ownerId,
			createAt,
		} = prams;

		this.id = id;
		this.name = name;
		this.description = description;
		this.members = members;
		this.owner = owner;
		this.ownerId = ownerId;
		this.createAt = createAt;
	}
}

export class FlatData {
	name: string;
	description: string;
	members?: User['emailAddress'][];

	constructor(prams: FlatData = {} as FlatData) {
		const { name, description, members } = prams;

		this.name = name;
		this.description = description;
		this.members = members;
	}
}
