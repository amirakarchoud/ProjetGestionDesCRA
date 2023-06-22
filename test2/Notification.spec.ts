import { Collab } from "../src/model/Collab";
import { Notification } from "../src/model/Notiification";

describe('Une notification',()=>{

it('concerne un collab',()=>{
    const collab=new Collab();
const notif=new Notification(collab,"description",new Date());

expect(notif.collab).toBe(collab);
});

it('a une description/un sujet',()=>{

    const collab=new Collab();
const notif=new Notification(collab,"description",new Date());

expect(notif.description).toBe("description");

});

it('a une date',()=>{

    const collab=new Collab();
    const date=new Date();
const notif=new Notification(collab,"description",date);

expect(notif.date).toBe(date);

});






})