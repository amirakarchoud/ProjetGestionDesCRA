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
        Given un collaborateur a rempli partiellement son CRA
        Then je vois le pourcentage de complétion du CRA

    Example: un collab a rempli tout son cra
        Given un collaborateur a rempli tout son CRA
        Then l'état du CRA est 'complet' et l'entrée dans le tableau est en vert

    Example: le tableu est filtre en cra soumis/pas soumis/pas cree
        Given le tableau du recap des CRA
        When le gerant choisit de filtrer par état (soumis, pas soumis, pas créé)
        Then le tableau affiche uniquement les CRA correspondant à l'état choisi

    Example: recherche par nom du collab
        Given le tableau du recap des CRA
        When le gerant effectue une recherche par nom de collaborateur
        Then le tableau affiche uniquement les CRA du collaborateur recherché

    Example: acceder au detail du cra d'un collab
        Given le tableau du recap des CRA
        And le gerant souhaite accéder au détail d'un CRA spécifique d'un collab
        When il sélectionne le CRA correspondant
        Then le détail du CRA du collaborateur est affiché

