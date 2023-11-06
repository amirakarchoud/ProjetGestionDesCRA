import { Collab } from '@app/domain/model/Collab';
import { Status } from '@app/domain/model/Status';
import { CRA } from '@app/domain/model/CRA';
import { Etat } from '@app/domain/model/etat.enum';
import { DateProvider } from '@app/domain/model/date-provider';

export function createCra(collab: Collab, date: Date, status?: Status) {
  const cra = new CRA(
    date.getMonth() + 1,
    date.getFullYear(),
    collab.email,
    [],
    [],
    Etat.unsubmitted,
    status ? status : Status.Open,
  );

  DateProvider.setTodayDate(date);
  return cra;
}
