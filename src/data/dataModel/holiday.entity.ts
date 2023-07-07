import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HolidayDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  name: string;
  
}