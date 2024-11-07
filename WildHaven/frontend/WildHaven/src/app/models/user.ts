export class User{
    constructor(
        public _id: String,
        public name: String,
        public surname: String,
        public password: String,
        public email: String,
        public role: String,
        public image: String,
        public created_at: String,
    ){}
}