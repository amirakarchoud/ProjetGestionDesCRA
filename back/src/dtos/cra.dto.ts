import { ActivityDto } from './activity.dto';
import { AvailableDateDto } from './available.date.dto';
import { State } from '../domain/model/State.enum';
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
  state: State;
  status: Status;
  history: any[];
}
