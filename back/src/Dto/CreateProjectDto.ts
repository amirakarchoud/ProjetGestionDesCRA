export class CreateProjectDto {
  code: string;
  collabs: string[];
  constructor() {
    this.collabs = [];
  }
}
