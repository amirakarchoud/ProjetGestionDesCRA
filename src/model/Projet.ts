import { Collab } from "./Collab";

export class Projet {
    private id: string;
    private code: string;
    private collabs: Collab[];
  
    constructor(id: string, code: string, collabs: Collab[]) {
      this.id = id;
      this.code = code;
      this.collabs = collabs;
    }
  
    // Getters
    getId(): string {
      return this.id;
    }
  
    getCode(): string {
      return this.code;
    }
  
    getCollabs(): Collab[] {
      return this.collabs;
    }
  
    // Setters
    setId(id: string): void {
      this.id = id;
    }
  
    setCode(code: string): void {
      this.code = code;
    }
  
    setCollabs(collabs: Collab[]): void {
      this.collabs = collabs;
    }
  }
  