import User from './user';

export default class Flat {
	id?: number;
	name: string;
	description: string;
	members: User[];
	createBy?: number;
	createAt?: Date;

	constructor(prams: Flat = {} as Flat) {
		const { id, name, description, members, createBy, createAt } = prams;

		this.id = id;
		this.name = name;
		this.description = description;
		this.members = members;
		this.createBy = createBy;
		this.createAt = createAt;
	}
}
