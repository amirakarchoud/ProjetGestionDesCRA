import { Raison } from "../domain/model/Raison";

export class CreateAbsenceDto{
    date: Date;
    matin: boolean;
    collabId: string;
    raison: Raison;
    craId: number;
}