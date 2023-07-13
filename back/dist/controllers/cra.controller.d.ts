import { CraApplication } from "../domain/application/craApplication";
import { CreateAbsenceDto } from "../Dto/CreateAbsenceDto";
import { Absence } from "../domain/model/Absence";
import { CreateActivityDto } from "../Dto/CreateActivityDto";
import { Activity } from "../domain/model/Activity";
export declare class CraController {
    private readonly craApp;
    constructor(craApp: CraApplication);
    addAbsence(createAbsenceDto: CreateAbsenceDto): Promise<Absence>;
    deleteAbsence(idCra: number, dateAbsence: Date, matin: boolean): Promise<import("../domain/model/CRA").CRA>;
    addActivity(createActivityDto: CreateActivityDto): Promise<Activity>;
    deleteActivity(idCra: number, dateActivity: Date, matin: boolean): Promise<import("../domain/model/CRA").CRA>;
    getUserCra(idUser: string, month: number, year: number): Promise<any>;
    submitCra(idCra: number): Promise<import("../domain/model/CRA").CRA>;
    availableDates(idCra: number): Promise<Date[]>;
}
