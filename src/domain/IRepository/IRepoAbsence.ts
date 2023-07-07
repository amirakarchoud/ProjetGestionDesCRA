import { Absence } from "../model/Absence";

export interface IRepoAbsence {
    findAll(): Promise<Absence[]>;
    save(absence: Absence): Promise<Absence>;
    findById(id:number):Promise<Absence>;
    delete(id:number);
  }