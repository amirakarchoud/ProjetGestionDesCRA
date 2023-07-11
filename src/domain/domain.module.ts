import { Module } from "@nestjs/common";
import { CraService } from "./service/cra.service";
import { CraApplication } from "./application/craApplication";
import {IRepoCollab} from "./IRepository/IRepoCollab"
import { RepoCollab } from "../data/Repository/RepoCollab";
import { RepoCra } from "../data/Repository/RepoCra";
import { RepoHoliday } from "../data/Repository/RepoHoliday";

@Module({
    imports: [],
    controllers: [],
    exports:[],
    providers: [],})
export class DoaminModule{} 