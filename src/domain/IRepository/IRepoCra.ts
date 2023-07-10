import { CRA } from "../model/CRA";

export interface IRepoCra {
    //findAll(): Promise<CRA[]>;
    save(cra: CRA): Promise<CRA>;
     findById(id: number): Promise<CRA>
     findByMonthYearCollab(month:number,year:number,collab:string);
     
  }