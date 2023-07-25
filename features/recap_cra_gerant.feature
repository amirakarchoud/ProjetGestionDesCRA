Feature: Recap cra admin
    En tant que gerant
    je veux avoir les recap des cra de tous les collabs
    afin de relancer ceux qui sont en retard

    Example: un collab n'a pas soumis son cra
        Given un collab n'a pas soumis son cra
        Then l'etat du cra est 'pas soumis' et l'entree dans le tableau est en bleu

    Example: un collab a soumis son cra
        Given un collab a soumis son cra
        Then l'etat du cra est ' soumis' et l'entree dans le tableau est en vert

    Example: un collab n'a pas cree son cra
        Given un collab n'a pas cree son cra
        Then l'etat du cra est 'pas cree' et l'entree dans le tableau est en rouge

    Example: un collab a rempli partiellement son cra
            then je vois 18/20.. 

    Example: un collab a rempli tout son cra
    Example: le tableu est filtre en cra soumis/pas soumis/pas cree
    Example: recherche par nom du collab
    Example: acceder au detail du cra d'un collab
