export type Provider = 'local' | 'google';

export default class User {
    constructor(
        public id: number,
        public emailAddress: string,
        public userName: string,
        public provider: Provider,
        public joinDate: Date,
		public avatarUrl: string | undefined,
		public active: boolean
    ) {}
};
