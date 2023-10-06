import { INestApplication } from '@nestjs/common';
import { CraApplication } from '@app/domain/application/craApplication';
import { CreateActivityDto } from '@app/dtos/CreateActivityDto';
import { Project } from '@app/domain/model/Project';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { CreateAbsenceDto } from '@app/dtos/CreateAbsenceDto';
import { Raison } from '@app/domain/model/Raison';
import { CollabRepository } from '@app/repositories/collab.repository';
import { ProjectRepository } from '@app/repositories/project.repository';
import { Collab } from '@app/domain/model/Collab';
import { Role } from '@app/domain/model/Role';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';

export async function prepareActivity(
  app: INestApplication,
  date: Date,
  clientId: CollabEmail,
  insertUser = true,
) {
  if (insertUser) {
    await createUser(app, clientId);
  }
  const application = app.get(CraApplication);
  const activity = new CreateActivityDto();
  const project = await createProject(app, new ProjectCode('code'), clientId);
  activity.date = date;
  activity.projectId = project.code.value;
  activity.collabId = clientId.value;
  activity.percentage = 100;
  await application.addActivity(activity);
  return activity;
}

export async function createProject(
  app: INestApplication,
  code: ProjectCode,
  clientId?: CollabEmail,
) {
  const repo: ProjectRepository = app.get('IRepoProject');
  const repoCollab: CollabRepository = app.get('IRepoCollab');
  let project: Project;

  if (clientId) {
    const createdUser = await repoCollab.findById(clientId);
    project = new Project(
      code,
      [createdUser.email],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
  } else {
    project = new Project(code, [], '', '', new Date(), ProjetStatus.Active);
  }
  await repo.save(project);
  return project;
}

export async function createUser(app: INestApplication, userId: CollabEmail) {
  const repo: CollabRepository = app.get('IRepoCollab');
  await repo.save(new Collab(userId, 'some name', 'last name', Role.user));

  return repo;
}

export async function prepareAbsence(
  app: INestApplication,
  date: Date,
  clientId: CollabEmail,
  insertUser = true,
) {
  if (insertUser) {
    await createUser(app, clientId);
  }
  const application = app.get(CraApplication);
  const absence = new CreateAbsenceDto();
  absence.date = date;
  absence.percentage = 0;
  absence.raison = Raison.Maladie;

  absence.collabId = clientId.value;
  await application.addAbsence(absence);
  return absence;
}
