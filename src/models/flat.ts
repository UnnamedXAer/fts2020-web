import User from './user';

export default class Flat {
	id?: number;
	name: string;
	description: string;
	members?: User[];
	ownerId: number;
	owner?: User;
	createAt?: Date;
	active?: boolean;

	constructor(prams: Flat = {} as Flat) {
		const {
			id,
			name,
			description,
			members,
			owner,
			ownerId,
			createAt,
			active,
		} = prams;

		this.id = id;
		this.name = name;
		this.description = description;
		this.members = members;
		this.owner = owner;
		this.ownerId = ownerId;
		this.createAt = createAt;
		this.active = active;
	}
}

export class FlatData {
	id?: number
	name?: string;
	description?: string;
	members?: User['emailAddress'][];
	active?: boolean;

	constructor(prams: FlatData = {} as FlatData) {
		const { id, name, description, members, active } = prams;

		this.id = id;
		this.name = name;
		this.description = description;
		this.members = members;
		this.active = active;
	}
}
