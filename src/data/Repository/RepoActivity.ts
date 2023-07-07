import { IRepoActivity } from "@app/domain/IRepository/IRepoActivity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ActivityDB } from "../dataModel/activity.entity";
import { Repository } from "typeorm";
import { Activity } from "@app/domain/model/Activity";
import { RepoCollab } from "./RepoCollab";
import { RepoCra } from "./RepoCra";

@Injectable()
export class RepoActivity implements IRepoActivity {
  constructor(
    @InjectRepository(ActivityDB)
    private activityRepository: Repository<ActivityDB>,private readonly repoCollab:RepoCollab,private readonly repoCra:RepoCra
  ) {}
    findAll(): Promise<Activity[]> {
        throw new Error("Method not implemented.");
    }
    save(activity: Activity): Promise<Activity> {
        throw new Error("Method not implemented.");
    }

}