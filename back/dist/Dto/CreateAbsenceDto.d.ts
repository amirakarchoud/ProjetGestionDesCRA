import { Raison } from "../domain/model/Raison";
export declare class CreateAbsenceDto {
    date: Date;
    matin: boolean;
    collabId: string;
    raison: Raison;
    craId: number;
}
