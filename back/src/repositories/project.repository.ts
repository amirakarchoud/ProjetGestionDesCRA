import { IRepoProject } from '@app/domain/IRepository/IRepoProject';
import { Inject, Injectable } from '@nestjs/common';
import { Project } from '@app/domain/model/Project';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { EnhancedOmit, InferIdType } from 'mongodb';

const PROJECT_COLLECTION = 'projects';

@Injectable()
export class ProjectRepository implements IRepoProject {
  constructor(
    @Inject(MongoClientWrapper)
    private wrapper: MongoClientWrapper,
  ) {}

  async delete(id: string): Promise<void> {
    const collection = this.wrapper.getCollection(PROJECT_COLLECTION);
    await collection.deleteOne({
      _id: id,
    });
  }

  async findAll(): Promise<Project[]> {
    const collection = this.wrapper.getCollection(PROJECT_COLLECTION);

    const docs = [];
    for await (const doc of collection.find({})) {
      docs.push(doc);
    }
    return docs.map(this.mapProject);
  }

  async findById(id: string): Promise<Project> {
    const collection = this.wrapper.getCollection(PROJECT_COLLECTION);
    const projectDoc = await collection.findOne({
      _id: id,
    });

    if (!projectDoc) {
      throw new Error('Project not found');
    }

    return this.mapProject(projectDoc);
  }

  async findByUser(idUser: string): Promise<Project[]> {
    const collection = this.wrapper.getCollection(PROJECT_COLLECTION);
    await collection.find({});

    const docs = [];
    for await (const doc of collection.find({
      _collabs: [idUser],
    })) {
      docs.push(doc);
    }

    return docs.map(this.mapProject);
  }

  findLikeById(id: string): Promise<Project[]> {
    throw new Error('Operation not implemented');
  }

  async save(project: Project): Promise<void> {
    const projectsCollection = this.wrapper.db.collection<{ _id: string }>(
      PROJECT_COLLECTION,
    );

    await projectsCollection.insertOne({
      _id: project.code,
      ...project,
    });
  }

  async update(updatedProject: Project): Promise<void> {
    const projectsCollection = this.wrapper.db.collection<{ _id: string }>(
      PROJECT_COLLECTION,
    );

    await projectsCollection.updateOne(
      {
        _id: updatedProject.code,
      },
      updatedProject,
      {upsert: true}
    );
  }

  private mapProject(
    projectDoc: EnhancedOmit<{ _id: string }, '_id'> & {
      _id: InferIdType<{ _id: string }>;
    },
  ) {
    return new Project(
      projectDoc._id,
      projectDoc['_collabs'],
      projectDoc['_name'],
      projectDoc['_client'],
      projectDoc['_date'],
      ProjetStatus[projectDoc['status']],
    );
  }
}
