import { prepareAbsence } from './test.utils';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { INestApplication } from '@nestjs/common';
import { CraController } from '@app/controllers/cra.controller';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';

describe('CRA Controller', () => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;
  const clientId = new CollabEmail('test1@proxym.fr');
  let craController: CraController;

  afterAll(async () => {
    if (app) {
      try {
        await moduleRef.close();
        await app.close();
      } catch (e) {
        console.error('Problem closing app', e);
      }
    }
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const wrapper: MongoClientWrapper = app.get(MongoClientWrapper);
    await wrapper.db.dropDatabase();

    craController = app.get(CraController);
  });

  it('can be found by month and year', async () => {
    const date = new Date();
    await prepareAbsence(app, clientId);
    const cra = await craController.getMonthCra(
      date.getMonth() + 1,
      date.getFullYear(),
    );
    expect(cra).toHaveLength(1);
  });

  it('can be found by year for a user', async () => {
    const date = new Date();
    await prepareAbsence(app, clientId);
    await prepareAbsence(app, new CollabEmail('seconduser@proxym.fr'));

    const cra = await craController.userYearCra(
      clientId.value,
      date.getFullYear(),
    );
    expect(cra).toHaveLength(1);
  });
});
