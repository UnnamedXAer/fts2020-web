import { AxiosError } from 'axios';

interface HttpErrorData {
	msg: string;
	code?: number;
	errorsArray: HttpFieldError[];
}

type HttpFieldError = {
	param: string;
	msg: string;
};

class HttpError implements HttpErrorData {
	msg: string;
	errorsArray: HttpFieldError[];
	code?: number;

	constructor(
		msg: string,
		errorsArray: HttpFieldError[] = [],
		code?: number
	) {
		this.errorsArray = errorsArray;
		this.msg = msg;
		this.code = code;
	}
}

export default class HttpErrorParser {
	private error?: HttpError;
	constructor(err?: AxiosError) {
		if (err) {
			this.error = this.getParsedError(err);
		}
	}

	setError(err: AxiosError) {
		this.error = this.getParsedError(err);
	}

	private getParsedError(err: AxiosError): HttpErrorData {
		let msg;
		let errorsArray: HttpFieldError[] = [];
		if (err.isAxiosError) {
			if (err.response) {
				const data = err.response?.data;
				msg = err.response.data?.message as string;
				if (data && data.errorsArray) {
					errorsArray = data.errorsArray;
				}
			}
		}

		if (!msg) {
			msg = err.message || 'Opss, something went wrong.';
		}

		return new HttpError(msg, errorsArray, err.code  ? +err.code : undefined);
	}

	private checkError() {
		if (!this.error) {
			throw new Error('Error must be set. Use "setError" method first.');
		}
	}

	getMessage() {
		this.checkError();
		return this.error!.msg;
	}

	getCode() {
		this.checkError();
		return this.error!.code;
	}

	getFieldsErrors() {
		this.checkError();
		return this.error!.errorsArray;
	}
}
