import { Inhabitant } from "./inhabitant";
import { User } from "./user";

export class Sponsorship{
    constructor(
        public sponsor: User | null,
        public inhabitant: Inhabitant | null,
        public startDate: Date,
        public endDate: Date,
        public contributionAmount: Number,
        public status: String,
    ){}
}