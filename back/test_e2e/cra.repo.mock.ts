import { IRepoCra } from '@app/domain/IRepository/IRepoCra';
import { CRA } from '@app/domain/model/CRA';
import { Absence } from '@app/domain/model/Absence';
import { Raison } from '@app/domain/model/Raison';
import { CollabEmail } from '@app/domain/model/collab.email';

export class MockRepoCra implements IRepoCra {
  save(cra: CRA): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<CRA> {
    throw new Error('Method not implemented.');
  }

  findByMonthYearCollab(
    month: number,
    year: number,
    collab: CollabEmail,
  ): Promise<CRA> {
    throw new Error('Method not implemented.');
  }

  findByYearUser(idUser: CollabEmail, year: number): Promise<CRA[]> {
    throw new Error('Method not implemented.');
  }

  async findByMonthYear(month: number, year: number): Promise<any[]> {
    const activityMap = new Map<string, number>();
    activityMap.set('Project1', 10);
    activityMap.set('Project2', 20);

    const abs1 = new Absence('1', true, new Date(), Raison.Conges);
    const abs2 = new Absence('1', true, new Date(), Raison.Conges);
    return [
      {
        collab: {
          name: 'amira',
          lastname: 'karchoud',
        },
        absences: [abs1, abs2],
        activities: [{}, {}, {}],
        calculateBusinessDays: jest.fn().mockReturnValue(20),
        getActivityCountByProject: jest.fn().mockReturnValue(activityMap),
        holidays: [],
      },
    ];
  }
}
