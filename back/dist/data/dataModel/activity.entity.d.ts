import { UserDB } from "./user.entity";
import { CRADB } from "./cra.entity";
import { ProjectDB } from "./project.entity";
export declare class ActivityDB {
    id: number;
    date: Date;
    matin: boolean;
    collab: UserDB;
    project: ProjectDB;
    cra: CRADB;
}
