import { APIUser } from '../store/actions/users';

export type Provider = 'local' | 'google';

export default class User {
	public id: number;
	public emailAddress: string;
	public userName: string;
	public provider: Provider;
	public joinDate: Date;
	public avatarUrl: string | undefined;
	public active: boolean;
	constructor(
		id: number,
		emailAddress: string,
		userName: string,
		provider: Provider,
		joinDate: Date,
		avatarUrl: string | undefined,
		active: boolean
	) {
		this.id = id;
		this.emailAddress = emailAddress;
		this.userName = userName;
		this.provider = provider;
		this.joinDate = joinDate;
		this.avatarUrl = avatarUrl;
		this.active = active;
	}

	static fromData(params: APIUser = {} as APIUser): User {
		const {
			id,
			emailAddress,
			userName,
			provider,
			joinDate,
			avatarUrl,
			active,
		} = params;
		return new User(
			id,
			emailAddress,
			userName,
			provider,
			typeof joinDate === 'string' ? new Date(joinDate) : joinDate,
			avatarUrl,
			active
		);
	}
}
