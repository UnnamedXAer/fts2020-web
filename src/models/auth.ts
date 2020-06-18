export class Credentials {
	userName?: string;
	emailAddress: string;
	password: string;
	confirmPassword?: string;
	avatarUrl?: string;

	constructor(params: Credentials) {
		const {
			userName,
			emailAddress,
			password,
			confirmPassword,
			avatarUrl,
		} = params;

		this.userName = userName;
		this.emailAddress = emailAddress;
		this.password = password;
		this.confirmPassword = confirmPassword;
		this.avatarUrl = avatarUrl;
	}
}
