import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('holiday')
export class HolidayDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  name: string;
  
}