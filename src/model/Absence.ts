import { Collab } from "./Collab";
import { Raison } from "./Raison";

export class Absence {
    private id: string;
    private date: Date;
    private matin: boolean;
    private collab: Collab;
    private raison:Raison;
  
    constructor(id: string, date: Date, matin: boolean, collab: Collab,raison:Raison) {
      this.id = id;
      this.date = date;
      this.matin = matin;
      this.collab = collab;
      this.raison=raison;
    }
  
    // Getters
    getId(): string {
      return this.id;
    }
  
    getDate(): Date {
      return this.date;
    }
  
    isMatin(): boolean {
      return this.matin;
    }
  
    getCollab(): Collab {
      return this.collab;
    }

    getRaison(): Raison {
        return this.raison;
      }
  

  
    // Setters
    setId(id: string): void {
      this.id = id;
    }
  
    setDate(date: Date): void {
      this.date = date;
    }
  
    setMatin(matin: boolean): void {
      this.matin = matin;
    }
  
    setCollab(collab: Collab): void {
      this.collab = collab;
    }

    setRaison(raison: Raison): void {
        this.raison = raison;
      }
  

  }
  