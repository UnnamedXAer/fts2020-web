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
			createAt
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
