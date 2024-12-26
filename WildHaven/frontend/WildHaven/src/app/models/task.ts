import { Inhabitant } from "./inhabitant";
import { User } from "./user";
import { Zone } from "./zone";

export class Task{
    constructor(
        public _id: String,
        public name: String,
        public description: String,
        public assignedTo: User | undefined,
        public status: String,
        public inhabitant: Inhabitant | undefined,
        public zone: Zone  | undefined,
        public createdBy: User | undefined
    ){}
}