Feature: Recap cra collab
    en tant que collab
    je veux savoir si mon cra est complet
    pour pouvoir le soumettre

    Background: 
        Given je suis un user du cra app

    Example: nouveau mois
        Given C'est le debut du mois
        And je n'ai pas rien rempli dans le cra du mois
        When je vois le recap
        Then le recap du cra a l'etat 'pas cree' et il est en rouge
    Example: cra non complet qui se met à jour
        Given  a 3 jours vides dans son cra du juillet
        When  a rempli un autre jour
        Then le recap du cra montre qu'il a 2 jours vides dans son cra du juillet et il est en bleu
    
    Example: cra complet 
        Given user1 a 1 jour vide dans son cra du juillet 
              le recap est en bleu
        When user1 a rempli le dernier jour
        Then le recap du cra montre qu'il a 0 jours vides dans son cra du juillet et il peut le soumettre