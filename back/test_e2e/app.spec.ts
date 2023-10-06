import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CraApplication } from '@app/domain/application/craApplication';
import { IRepoCra } from '@app/domain/IRepository/IRepoCra';
import { AppModule } from '@app/app.module';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { createUser, prepareAbsence, prepareActivity } from './test.utils';
import { CollabRepository } from '@app/repositories/collab.repository';
import { CraRepository } from '@app/repositories/cra.repository';
import { Collab } from '@app/domain/model/Collab';
import { Role } from '@app/domain/model/Role';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Raison } from '@app/domain/model/Raison';

describe('APP', () => {
  const clientId = new CollabEmail('test1@proxym.fr');
  let app: INestApplication;
  let moduleRef: TestingModule = null;

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
  });

  it(`create user from token`, async () => {
    const repo: CollabRepository = await createUser(app, clientId);
    const createdUser = await repo.findById(clientId);
    expect(createdUser).toBeDefined();
  });

  it(`create absence`, async () => {
    const date = new Date();
    const repo = app.get('IRepoCra');
    await prepareAbsence(app, date, clientId);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    expect(cra.absences).toHaveLength(1);
  });

  it(`delete absence`, async () => {
    const date = new Date();
    const repo: CraRepository = app.get('IRepoCra');
    await prepareAbsence(app, date, clientId);
    const application = app.get(CraApplication);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    await application.deleteAbsence(cra.id, date, Raison.Maladie);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    expect(craAfter.absences).toHaveLength(0);
  });

  it(`create activity`, async () => {
    const date = new Date();
    const repo: CraRepository = app.get('IRepoCra');
    await prepareActivity(app, date, clientId);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    expect(craAfter.activities).toHaveLength(1);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it(`delete activity`, async () => {
    const date = new Date();
    const repo: CraRepository = app.get('IRepoCra');
    await prepareActivity(app, date, clientId);
    const application = app.get(CraApplication);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    await application.deleteActivity(cra.id, date, new ProjectCode('code'));
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    expect(craAfter.activities).toHaveLength(0);
  });

  it(`create regul for absence creation`, async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const repo: CraRepository = app.get('IRepoCra');
    await prepareActivity(app, date, clientId);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    const historyAvant = cra.history.length;
    cra.closeCra();
    await repo.save(cra);
    await prepareAbsence(app, date, clientId, false);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    expect(craAfter.history).toHaveLength(historyAvant + 1);
  });

  it(`create regul pour creation activite`, async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const repo: CraRepository = app.get('IRepoCra');
    await prepareAbsence(app, date, clientId);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    const historyAvant = cra.history.length;
    cra.closeCra();
    await repo.save(cra);
    await prepareActivity(app, date, clientId, false);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      clientId,
    );
    expect(craAfter.history).toHaveLength(historyAvant + 1);
  });

  it('finds users by list of ids', async () => {
    const repo: CollabRepository = app.get('IRepoCollab');
    await repo.save(
      new Collab(
        new CollabEmail('collab1@proxym.fr'),
        'aleks',
        'kirilov',
        Role.user,
      ),
    );
    await repo.save(
      new Collab(
        new CollabEmail('collab2@proxym.fr'),
        'clément',
        'sensen',
        Role.user,
      ),
    );

    const craApp: CraApplication = app.get(CraApplication);

    const collabs = await craApp.getAllCollabsByIds([
      new CollabEmail('collab1@proxym.fr'),
      new CollabEmail('collab2@proxym.fr'),
    ]);

    expect(collabs).toHaveLength(2);
  });
});
