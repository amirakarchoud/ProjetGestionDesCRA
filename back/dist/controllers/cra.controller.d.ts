import { CraApplication } from "../domain/application/craApplication";
import { CreateAbsenceDto } from "../Dto/CreateAbsenceDto";
import { Absence } from "../domain/model/Absence";
import { CreateActivityDto } from "../Dto/CreateActivityDto";
import { Activity } from "../domain/model/Activity";
import { deleteActivityAbsenceDto } from "@app/Dto/deleteActivityAbsenceDto";
export declare class CraController {
    private readonly craApp;
    constructor(craApp: CraApplication);
    addAbsence(createAbsenceDto: CreateAbsenceDto): Promise<Absence>;
    deleteAbsence(delAbsenceDto: deleteActivityAbsenceDto): Promise<import("../domain/model/CRA").CRA>;
    addActivity(createActivityDto: CreateActivityDto): Promise<Activity>;
    deleteActivity(delActivityDto: deleteActivityAbsenceDto): Promise<import("../domain/model/CRA").CRA>;
    getUserCra(idUser: string, month: number, year: number): Promise<any>;
    submitCra(idCra: number): Promise<import("../domain/model/CRA").CRA>;
    availableDates(idCra: number): Promise<Date[]>;
    userYearCra(idUser: string, year: number): Promise<import("../domain/model/CRA").CRA[]>;
}
