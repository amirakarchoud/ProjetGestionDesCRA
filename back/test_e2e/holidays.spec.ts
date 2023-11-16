import { HolidaysSyncService } from '@app/services/holidays-sync.service';
import { IRepoHoliday } from '@app/domain/IRepository/IRepoHoliday';
import { LocalDate } from '@js-joda/core';
import { prepareApp } from './test.utils';

describe('Holidays', () => {
  const app = prepareApp('holidays');

  it('Are inserted from the http calendar', async () => {
    const holidaysSyncService = app().get(HolidaysSyncService);
    const holidayRepo = app().get<IRepoHoliday>('IRepoHoliday');

    await holidaysSyncService.fetchAndStoreHolidays();

    const allHolidays = await holidayRepo.findAll();
    expect(allHolidays).toHaveLength(11);
  });

  it('Can be queries by date', async () => {
    const holidaysSyncService = app().get(HolidaysSyncService);
    const holidayRepo = app().get<IRepoHoliday>('IRepoHoliday');

    await holidaysSyncService.fetchAndStoreHolidays(2023);

    const holiday = await holidayRepo.findByDate(LocalDate.parse('2023-01-01'));

    expect(holiday.name).toBe('1er janvier');
  });
});
