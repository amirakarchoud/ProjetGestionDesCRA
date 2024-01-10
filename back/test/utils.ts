import { Collab } from '@app/domain/model/Collab';
import { Status } from '@app/domain/model/Status';
import { CRA } from '@app/domain/model/CRA';
import { State } from '@app/domain/model/State.enum';
import { DateProvider } from '@app/domain/model/date-provider';
import { LocalDate } from '@js-joda/core';
import { mockedHolidays } from '../test_e2e/holiday.mock-data';
import { Holiday } from '@app/domain/model/Holiday';

export function createCra(collab: Collab, date: LocalDate, status?: Status) {
  DateProvider.setTodayDate(date);

  const cra = new CRA(
    date.month(),
    date.year(),
    collab.email,
    [],
    [],
    State.Draft,
    status ? status : Status.Open,
  );

  const holidays: Holiday[] = [];

  for (const entry of Object.entries(mockedHolidays)) {
    const entryDate = LocalDate.parse(entry[0]);
    if (
      date.year() === entryDate.year() &&
      date.month().equals(entryDate.month())
    ) {
      holidays.push(new Holiday(entryDate, entry[1]));
    }
  }

  cra.holidays = holidays;

  return cra;
}
