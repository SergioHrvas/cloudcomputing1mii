export class sponsorship{
    constructor(
        public sponsor: String,
        public animal: String,
        public startDate: Date,
        public endDate: Date,
        public contributionAmount: Number,
        public status: String,
    ){}
}