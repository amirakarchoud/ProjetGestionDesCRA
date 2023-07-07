import { Absence } from "../model/Absence";

export interface IRepoAbsence {
    findAll(): Promise<Absence[]>;
    save(absence: Absence): Promise<Absence>;
  }