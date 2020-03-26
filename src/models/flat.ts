import User from './user';

export default class Flat {
	id?: number;
	name: string;
	description: string;
	members?: User[];
	owner: User;
	createAt?: Date;

	constructor(prams: Flat = {} as Flat) {
		const { id, name, description, members, owner, createAt } = prams;

		this.id = id;
		this.name = name;
		this.description = description;
		this.members = members;
		this.owner = owner;
		this.createAt = createAt;
	}
}
