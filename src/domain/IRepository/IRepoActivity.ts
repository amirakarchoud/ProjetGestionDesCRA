import { Activity } from "../model/Activity";

export interface IRepoActivity {
    findAll(): Promise<Activity[]>;
    save(activity: Activity): Promise<Activity>;
  }