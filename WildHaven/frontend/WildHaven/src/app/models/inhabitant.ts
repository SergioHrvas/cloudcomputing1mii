import { Specie } from "./specie"
import { Zone } from "./zone"

export class Inhabitant{
    constructor(
        public _id: String,
        public name: String,
        public description: String,
        public image: String,
        public personality: String,
        public healthStatus: String,
        public birth: Date | undefined,
        public vetVisits: [{
            date: Date | undefined,
            reason: String,
            treatments: String,
            vetName: String
        }],
        public alive: boolean,
        public specie: Specie | undefined,
        public zone: Zone | undefined
    ){}
}