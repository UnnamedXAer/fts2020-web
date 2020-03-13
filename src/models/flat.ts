export default class Flat {
	id: number;
	name: string;
	address: string;
	members: number[];
	createBy: number;
	createAt: Date;

	constructor(prams: Flat = {} as Flat) {
		const { id, name, address, members, createBy, createAt } = prams;

		this.id = id;
		this.name = name;
		this.address = address;
		this.members = members;
		this.createBy = createBy;
		this.createAt = createAt;
	}
}
