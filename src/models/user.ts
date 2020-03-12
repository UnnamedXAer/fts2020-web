export default class User {
	constructor(
		public id: number,
		public emailAddress: string,
		public userName: string,
		public joinDate: Date,
		public active: boolean
	) {}
}