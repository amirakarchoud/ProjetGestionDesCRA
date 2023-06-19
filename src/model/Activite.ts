import { Collab } from "./Collab";
import { Projet } from "./Projet";

export class Activite {
    private id: string;
    private date: Date;
    private matin: boolean;
    private collab: Collab;
    private projet: Projet;
  
    constructor(id: string, date: Date, matin: boolean, collab: Collab, projet: Projet) {
      this.id = id;
      this.date = date;
      this.matin = matin;
      this.collab = collab;
      this.projet = projet;
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
  
    getProjet(): Projet {
      return this.projet;
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
  
    setProjet(projet: Projet): void {
      this.projet = projet;
    }
  }
  