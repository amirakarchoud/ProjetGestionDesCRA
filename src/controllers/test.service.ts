import { CraApplication } from "../domain/application/craApplication";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class TestService implements OnModuleInit{
    constructor(private craApp:CraApplication){}
    onModuleInit() {
        this.craApp.addUser('test');
    }


}