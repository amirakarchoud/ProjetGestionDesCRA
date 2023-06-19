import { Collab } from "../src/model/Collab";
import { Project } from "../src/model/Project";

describe('Un projet ',()=>{
    it('peut contenir des collaborateurs',()=>{

        //given
        const projet=new Project();
        const collab=new Collab();
        //when
        projet.addCollab(collab);

        //then 
        expect(projet.collabs).toHaveLength(1);


    });

    it('peut etre cree que par un admin',()=>{

        
        
    });

    it('peut etre affecter des collaborateurs que par un admin',()=>{
        
    });

    it('peut etre modifie que par un admin',()=>{
        
    });
})