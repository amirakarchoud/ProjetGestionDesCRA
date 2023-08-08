import { Injectable } from '@nestjs/common';
import { Collab } from '../../domain/model/Collab';
import { IRepoCollab } from '../../domain/IRepository/IRepoCollab';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDB } from '../dataModel/user.entity';

@Injectable()
export class CollabRepository implements IRepoCollab {
  constructor(
    @InjectRepository(UserDB)
    private userRepository: Repository<UserDB>,
  ) {}

  async findById(id: string): Promise<Collab> {
    const user = await this.userRepository.findOne({ where: { email: id } });
    const collab = new Collab(user.email, user.name, user.lastname, user.role);
    collab.password = user.password;
    return collab;
  }

  async findAll(): Promise<Collab[]> {
    const collabs: Collab[] = [];
    (await this.userRepository.find()).map((user) => {
      collabs.push(new Collab(user.email, user.name, user.lastname, user.role));
    });
    return collabs;
  }

  async save(user: Collab): Promise<Collab> {
    const collab = new UserDB();
    collab.email = user.email;
    collab.name = user.name;
    collab.role = user.role;
    collab.lastname = user.lastname;
    collab.password = user.password;
    await this.userRepository.save(collab);

    return user;
  }

  async findByIds(ids: string[]): Promise<Collab[]> {
    const collabs: Collab[] = [];
    const users = (await this.userRepository.findBy({ email: In(ids) })).map(
      (user) => {
        collabs.push(
          new Collab(user.email, user.name, user.lastname, user.role),
        );
      },
    );
    if (users) {
      return collabs;
    }

    return null;
  }
}
