import { IRepoCollab } from '@app/domain/IRepository/IRepoCollab';
import { Collab } from '@app/domain/model/Collab';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Role } from '@app/domain/model/Role';

export class CollabRepoMock implements IRepoCollab {
  findAll(): Promise<Collab[]> {
    return Promise.resolve([]);
  }

  findById(id: CollabEmail): Promise<Collab> {
    return Promise.resolve(new Collab(id, 'amira', 'karchoud', Role.user));
  }

  findByIds(ids: CollabEmail[]): Promise<Collab[]> {
    return Promise.resolve([]);
  }

  save(user: Collab): Promise<void> {
    return Promise.resolve(undefined);
  }
}
