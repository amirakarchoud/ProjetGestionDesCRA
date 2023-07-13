import { UserDB } from "./user.entity";
import { Etat } from "../../domain/model/etat.enum";
import { AbsenceDB } from "./absence.entity";
import { ActivityDB } from "./activity.entity";
import { HolidayDB } from "./holiday.entity";
export declare class CRADB {
    id: number;
    date: Date;
    month: number;
    year: number;
    etat: Etat;
    collab: UserDB;
    absences: AbsenceDB[];
    activities: ActivityDB[];
    holidays: HolidayDB[];
}
