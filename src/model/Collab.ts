export class Collab {
    private collabs: Collab[]=[];
    private id: string;
    private nom: string;
    private prenom: string;
    private dateEmbauche: Date;


    constructor(id: string, nom: string, prenom: string, dateEmbauche: Date) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.dateEmbauche = dateEmbauche;


    }


    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getNom(): string {
        return this.nom;
    }

    setNom(nom: string): void {
        this.nom = nom;
    }

    getPrenom(): string {
        return this.prenom;
    }

    setPrenom(prenom: string): void {
        this.prenom = prenom;
    }

    getDateEmbauche(): Date {
        return this.dateEmbauche;
    }

    setDateEmbauche(dateEmbauche: Date): void {
        this.dateEmbauche = dateEmbauche;
    }



    getAll(): Collab[] {
        return this.collabs;
    }

    getById(id: string): Collab | undefined {
        return this.collabs.find((collab) => collab.id === id);
      }
      

    add(collab: Collab): void {
        this.collabs.push(collab);
    }

    delete(id: string): void {
        this.collabs = this.collabs.filter((collab) => collab.id !== id);
    }

    update(id: string, updatedCollab: Collab): void {
        this.collabs = this.collabs.map((collab) =>
            collab.id === id ? updatedCollab : collab
        );
    }
}

