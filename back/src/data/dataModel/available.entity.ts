import { IsDate, IsIn, IsInt } from 'class-validator';

export class AvailableEntity {
  @IsDate()
  date: Date;
  @IsInt()
  @IsIn([25, 50, 75, 100])
  percentage: number;

  constructor(date: Date, percentage: number) {
    this.date = date;
    this.percentage = percentage;
  }
}
