import {
  createUser,
  prepareAbsence,
  prepareActivity,
  prepareApp,
} from './test.utils';
import { CollabRepository } from '@app/repositories/collab.repository';
import { CraRepository } from '@app/repositories/cra.repository';
import { Collab } from '@app/domain/model/Collab';
import { Role } from '@app/domain/model/Role';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Raison } from '@app/domain/model/Raison';
import { CraApplication } from '@app/domain/application/cra.application';
import { LocalDate } from '@js-joda/core';
import { DateProvider } from '@app/domain/model/date-provider';

describe('APP', () => {
  const app = prepareApp('app');
  const clientId = new CollabEmail('test1@proxym.fr');

  it(`create user from token`, async () => {
    const createdUser = await createUser(app(), clientId);
    expect(createdUser).toBeDefined();
  });

  it(`create absence`, async () => {
    const date = LocalDate.now();
    const repo = app().get('IRepoCra');
    await prepareAbsence(app(), date, clientId);
    const cra = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    expect(cra.absences).toHaveLength(1);
  });

  it(`delete absence`, async () => {
    const date = LocalDate.now();
    const repo: CraRepository = app().get('IRepoCra');
    await prepareAbsence(app(), date, clientId);
    const application = app().get(CraApplication);
    const cra = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    await application.deleteAbsence(cra.id, date, Raison.Maladie);
    const craAfter = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    expect(craAfter.absences).toHaveLength(0);
  });

  it(`create activity`, async () => {
    const date = LocalDate.now();
    const repo: CraRepository = app().get('IRepoCra');
    await prepareActivity(app(), date, clientId);
    const craAfter = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    expect(craAfter.activities).toHaveLength(1);
  });

  afterAll(async () => {
    if (app()) {
      await app().close();
    }
  });

  it(`delete activity`, async () => {
    const date = LocalDate.now();
    const repo: CraRepository = app().get('IRepoCra');
    await prepareActivity(app(), date, clientId);
    const application = app().get(CraApplication);
    const cra = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    await application.deleteActivity(cra.id, date, new ProjectCode('code'));
    const craAfter = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    expect(craAfter.activities).toHaveLength(0);
  });

  it(`create regul for absence creation`, async () => {
    const date = LocalDate.parse('2024-01-11').plusDays(1);
    DateProvider.setTodayDate(date);
    const repo: CraRepository = app().get('IRepoCra');
    await prepareActivity(app(), date, clientId);
    const cra = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    const historyAvant = cra.history.length;
    cra.closeCra();
    await repo.save(cra);
    await prepareAbsence(app(), date, clientId, false);
    const craAfter = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    expect(craAfter.history).toHaveLength(historyAvant + 1);
  });

  it(`create regul pour creation activite`, async () => {
    const date = LocalDate.parse('2024-01-11').plusDays(1);
    DateProvider.setTodayDate(date);

    const repo: CraRepository = app().get('IRepoCra');
    await prepareAbsence(app(), date, clientId);
    const cra = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    const historyAvant = cra.history.length;
    cra.closeCra();
    await repo.save(cra);
    await prepareActivity(app(), date, clientId, false);
    const craAfter = await repo.findByMonthYearCollab(
      date.month(),
      date.year(),
      clientId,
    );
    expect(craAfter.history).toHaveLength(historyAvant + 1);
  });

  it('finds users by list of ids', async () => {
    const repo: CollabRepository = app().get('IRepoCollab');
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

    const craApp: CraApplication = app().get(CraApplication);

    const collabs = await craApp.getAllCollabsByIds([
      new CollabEmail('collab1@proxym.fr'),
      new CollabEmail('collab2@proxym.fr'),
    ]);

    expect(collabs).toHaveLength(2);
  });
});
