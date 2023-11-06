import { createCra } from './utils';
import { Activity } from '@app/domain/model/Activity';
import { ProjectCode } from '@app/domain/model/project.code';
import { Absence } from '@app/domain/model/Absence';
import { Raison } from '@app/domain/model/Raison';
import { Collab } from '@app/domain/model/Collab';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Role } from '@app/domain/model/Role';

describe('CRA can bulk add', () => {
  const collab = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );

  it('Can bulk add activities for same date', () => {
    const date = new Date('2023-09-04');
    const cra = createCra(collab, date);

    const bulkActivities = [
      new Activity(new ProjectCode('proj1'), 50, date),
      new Activity(new ProjectCode('proj2'), 50, date),
    ];

    cra.bulkAdd(bulkActivities);

    expect(cra.activities).toHaveLength(2);
  });

  it('Can bulk add for various dates', () => {
    const cra = createCra(collab, new Date('2023-09-04'));

    const bulkActivities = [
      new Activity(new ProjectCode('proj1'), 50, new Date('2023-09-04')),
      new Activity(new ProjectCode('proj1'), 50, new Date('2023-09-05')),
      new Activity(new ProjectCode('proj1'), 50, new Date('2023-09-06')),
      new Activity(new ProjectCode('proj1'), 50, new Date('2023-09-07')),
    ];

    cra.bulkAdd(bulkActivities);

    expect(cra.activities).toHaveLength(4);
  });

  it('Can bulk add both activities and absences', () => {
    const cra = createCra(collab, new Date('2023-09-04'));

    const bulkActivities = [
      new Activity(new ProjectCode('proj1'), 50, new Date('2023-09-06')),
      new Absence(50, new Date('2023-09-07'), Raison.Maladie),
    ];

    cra.bulkAdd(bulkActivities);

    expect(cra.activities).toHaveLength(1);
    expect(cra.absences).toHaveLength(1);
  });

  describe('Can work in replace mode', () => {
    it('can replace another activity for the day', () => {
      const date = new Date('2023-09-04');
      const cra = createCra(collab, date);

      cra.addActivity(new Activity(new ProjectCode('proj1'), 100, date));

      const bulkActivities = [new Activity(new ProjectCode('proj2'), 50, date)];

      cra.bulkAdd(bulkActivities, { replace: true });

      expect(cra.activities[0].project.value).toBe('proj2');
    });

    it('can replace other activities or absences for the day', () => {
      const date = new Date('2023-09-04');
      const cra = createCra(collab, date);

      cra.addActivity(new Activity(new ProjectCode('proj1'), 50, date));
      cra.addAbsence(new Absence(50, date, Raison.Maladie));

      const bulkActivities = [new Activity(new ProjectCode('proj2'), 50, date)];

      cra.bulkAdd(bulkActivities, { replace: true });

      expect(cra.activities).toHaveLength(1);
      expect(cra.absences).toHaveLength(0);
      expect(cra.activities[0].project.value).toBe('proj2');
    });

    it('can replace other activities for the day by multiple activities', () => {
      const date = new Date('2023-09-04');
      const cra = createCra(collab, date);

      cra.addActivity(new Activity(new ProjectCode('proj1'), 50, date));

      const bulkActivities = [
        new Activity(new ProjectCode('proj2'), 50, date),
        new Activity(new ProjectCode('proj3'), 50, new Date('2023-09-23')),
        new Activity(new ProjectCode('proj4'), 50, date),
        new Activity(new ProjectCode('proj5'), 50, new Date('2023-09-28')),
      ];

      cra.bulkAdd(bulkActivities, { replace: true });

      expect(cra.activities).toHaveLength(4);
      expect(cra.activities[0].project.value).toBe('proj2');
      expect(cra.activities[1].project.value).toBe('proj4');
    });
  });
});
