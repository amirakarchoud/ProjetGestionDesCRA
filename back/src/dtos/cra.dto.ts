import { ActivityDto } from './activity.dto';
import { AvailableDateDto } from './available.date.dto';
import { Etat } from '../domain/model/etat.enum';
import { Status } from '../domain/model/Status';

export class CraDto {
  id: string;
  holidays: ActivityDto[];
  absences: ActivityDto[];
  activites: ActivityDto[];
  availableDates: AvailableDateDto[];
  month: number;
  year: number;
  collab: string;
  etat: Etat;
  status: Status;
  history: any[];
}
