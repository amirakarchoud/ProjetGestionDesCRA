import { prepareApp } from '../test.utils';
import * as request from 'supertest';
import { CreateEmployeeDto } from '../../src/dtos/v2/create-employee.dto';
import { HttpStatus } from '@nestjs/common';
import { EMPLOYEE_URI } from '../../src/controllers/v2/employee.controller';
import { Role } from '../../src/domain/model/Role';
import { IRepoCollab } from '../../src/domain/IRepository/IRepoCollab';
import { Collab } from '../../src/domain/model/Collab';
import { CollabEmail } from '../../src/domain/model/collab.email';

describe('Employee Controller', () => {
  const getApp = prepareApp('employee');
  let employeeRepo: IRepoCollab;

  beforeEach(() => {
    employeeRepo = getApp().get('IRepoCollab');
  });

  it('Creates a new employee', async () => {
    const data = new CreateEmployeeDto();
    data.email = 'test.toto@proxym.fr';
    data.name = 'name';
    data.lastname = 'lastname';
    data.role = Role.admin;
    data.projects = [];

    const response = await request(getApp().getHttpServer())
      .post(EMPLOYEE_URI)
      .set('Content-Type', 'application/json')
      .send(data);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('Can list all employees', async () => {
    await twoEmployees();

    const response = await request(getApp().getHttpServer())
      .get(EMPLOYEE_URI)
      .set('Content-Type', 'application/json');

    expect(response.body).toHaveLength(2);
  });

  it('Can filter employees by email', async () => {
    await twoEmployees();

    const response = await request(getApp().getHttpServer())
      .get(EMPLOYEE_URI)
      .query({ emailFilter: 'test2.toto@proxym.fr' })
      .set('Content-Type', 'application/json');

    expect(response.body).toHaveLength(1);
  });

  it('Can filter multiple employees by email', async () => {
    await twoEmployees();

    const response = await request(getApp().getHttpServer())
      .get(EMPLOYEE_URI)
      .query({ emailFilter: 'test1.toto@proxym.fr,test2.toto@proxym.fr' })
      .set('Content-Type', 'application/json');

    expect(response.body).toHaveLength(2);
  });
  async function twoEmployees() {
    await employeeRepo.save(
      new Collab(
        new CollabEmail('test1.toto@proxym.fr'),
        'name',
        'lastname',
        Role.admin,
        [],
      ),
    );

    await employeeRepo.save(
      new Collab(
        new CollabEmail('test2.toto@proxym.fr'),
        'name',
        'lastname',
        Role.admin,
        [],
      ),
    );
  }
});
