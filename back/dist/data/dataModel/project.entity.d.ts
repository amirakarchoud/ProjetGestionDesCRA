import { UserDB } from "./user.entity";
import { ActivityDB } from "./activity.entity";
export declare class ProjectDB {
    code: string;
    collabs: UserDB[];
    activities: ActivityDB[];
}
