export class Credentials{

	userName?: string;
	emailAddress: string;
	password: string;
	confirmPassword?: string;

	constructor(params: Credentials) {
		const {
			userName,
			emailAddress,
			password,
			confirmPassword,
		} = params;

		this.userName = userName;
		this.emailAddress = emailAddress;
		this.password = password;
		this.confirmPassword = confirmPassword;
	}
}