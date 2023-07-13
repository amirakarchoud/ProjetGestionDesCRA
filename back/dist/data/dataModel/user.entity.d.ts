import { Role } from "../../domain/model/Role";
import { AbsenceDB } from "./absence.entity";
import { CRADB } from "./cra.entity";
import { ActivityDB } from "./activity.entity";
import { ProjectDB } from "./project.entity";
export declare class UserDB {
    email: string;
    name: string;
    role: Role;
    absences: AbsenceDB[];
    activities: ActivityDB[];
    projects: ProjectDB[];
    cras: CRADB[];
}
