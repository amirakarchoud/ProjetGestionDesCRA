import { Absence } from './Absence';
import { Activite } from './Activite';
import { Collab } from './Collab';

export class CRA {
  private id: string;
  private activities: Activite[];
  private absences: Absence[];
  private collab: Collab;
  private date: Date;

  constructor(id: string, activities: Activite[],absences: Absence[], collab: Collab, date: Date) {
    this.id = id;
    this.activities = activities;
    this.collab = collab;
    this.date = date;
    this.absences=absences;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getActivities(): Activite[] {
    return this.activities;
  }

  getCollab(): Collab {
    return this.collab;
  }

  getDate(): Date {
    return this.date;
  }

  getAbsences(): Absence[] {
    return this.absences;
  }

  // Setters
  setId(id: string): void {
    this.id = id;
  }

  setActivities(activities: Activite[]): void {
    this.activities = activities;
  }

  setCollab(collab: Collab): void {
    this.collab = collab;
  }

  setDate(date: Date): void {
    this.date = date;
  }

  setAbsences(absences: Absence[]): void {
    this.absences = absences;
  }
}
