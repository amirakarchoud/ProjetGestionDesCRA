import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { HttpHolidayFetchService } from '@app/services/http-holiday-fetch.service';
import { MockHolidayFetchService } from './mock-holiday-fetch.service';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { CraApplication } from '@app/domain/application/craApplication';
import { HolidaysSyncService } from '@app/services/holidays-sync.service';
import { IRepoHoliday } from '@app/domain/IRepository/IRepoHoliday';

describe('Holidays', () => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpHolidayFetchService)
      .useClass(MockHolidayFetchService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const wrapper: MongoClientWrapper = app.get(MongoClientWrapper);
    await wrapper.db.dropDatabase();
  });

  it('Are inserted from the http calendar', async () => {
    const holidaysSyncService = app.get(HolidaysSyncService);
    const holidayRepo = app.get<IRepoHoliday>('IRepoHoliday');

    await holidaysSyncService.fetchAndStoreHolidays();

    const allHolidays = await holidayRepo.findAll();
    expect(allHolidays).toHaveLength(11);
  });
});
