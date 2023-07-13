import { UserDB } from "./user.entity";
import { Raison } from "../../domain/model/Raison";
import { CRADB } from "./cra.entity";
export declare class AbsenceDB {
    id: number;
    date: Date;
    matin: boolean;
    collab: UserDB;
    raison: Raison;
    cra: CRADB;
}
