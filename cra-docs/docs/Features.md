---
id: Features
---
Cette section répertorie les différentes fonctionnalités clés de l'application. Chaque fonctionnalité a été conçue pour répondre aux besoins spécifiques des utilisateurs et pour assurer le comportement attendu de l'application.

## Feature: Gestion des absences

    Example: ajout d'une absence pour une date
        Given l'utilisateur souhaite ajouter une absence
        When il sélectionne toutes les informations d'une absence
        Then l'absence est ajoutée avec succès

    Example: on associe une raison a une absence
        Given l'utilisateur souhaite ajouter une absence specifique
        When il associe une raison à cette absence
        Then la raison est associée à l'absence

    Example: ajout d'une absence partielle
        Given l'utilisateur souhaite ajouter une absence
        When il sélectionne une période partielle pour l'absence(demie jourée)
        Then l'absence partielle est ajoutée avec succès

    Example: ajout d'une absence pour une plage de dates
        Given l'utilisateur souhaite ajouter plusieurs absences en meme temps
        When il sélectionne une plage de dates et saisit toutes les informations
        Then les absences sont ajoutées pour la période sélectionnée

    Example: pas d'absence pendant les jours fériés
        Given il y a des jours fériés dans le mois
        When l'utilisateur choisit de créer une absence pendant un jour férié
        Then l'absence n'est pas ajoutée et un message d'erreur est affiché

    Example: pas d'absence pendant les weekends
        Given l'utilisateur souhaite créer une absence pendant un weekend
        Then l'absence n'est pas ajoutée et un message d'erreur est affiché

    Example: une seule absence par demie journee
        Given une absence existe déjà pour une demi-journée spécifique
        When l'utilisateur souhaite ajouter une autre absence pour la même demi-journée
        Then l'absence n'est pas ajoutée et un message d'erreur est affiché

    Example: pas plus de deux absences par jour
        Given il exite deux absences déjà pour la même journée pou un utilisateur
        When l'utilisateur choisit de créer une troisième absence pour la même journée
        Then l'absence n'est pas ajoutée et un message d'erreur est affiché

    Example: suppression d'une absence
        Given l'utilisateur a une absence créee
        When il souhaite supprimer cette absence
        And confirme son choix
        Then l'absence est supprimée avec succès

    Example: suppression des absences par plage de dates
        Given l'utilisateur a des absences créees
        When il souhaite supprimer les absences pour une plage de dates spécifique
        And confirme son choix
        Then les absences pour cette période sont supprimées avec succès

    Example: ajout possible apres le 5 du mois suivant
        Given l'utilisateur souhaite creer une absence
        And la date actuelle est après le 5 du mois suivant
        When il selectionne toutes les informations d'une absense dans le futur
        Then l'absence est ajoutée avec succès

## Feature: Gestion des activités

    Example: ajout d'une activité pour une date
        Given l'utilisateur souhaite ajouter une activité
        When il sélectionne toutes les informations d'une activité
        Then l'activité est ajoutée avec succès

    Example: on voit que ses projets
        Given l'utilisateur souhaite ajouter une activité pour un de ses projets
        When il selectionne le projet concerné
        Then l'activité est associée au projet et ajoute avec succes

    Example: ajout d'une activite partielle
        Given l'utilisateur souhaite ajouter une activité
        When il sélectionne une période partielle pour l'activité(demie jourée)
        Then l'activité partielle est ajoutée avec succès

    Example: ajout d'une activite pour une plage de dates
        Given l'utilisateur souhaite ajouter plusieurs activités en meme temps
        When il sélectionne une plage de dates et saisit toutes les informations
        Then les activités sont ajoutées pour la période sélectionnée

    Example: pas d'activités pendant les jours fériés
        Given il y a des jours fériés dans le mois
        When l'utilisateur choisit de créer une activité pendant un jour férié
        Then l'activité n'est pas ajoutée et un message d'erreur est affiché

    Example: pas d'activites pendant les weekends
        Given l'utilisateur souhaite créer une activité pendant un weekend
        Then l'activité n'est pas ajoutée et un message d'erreur est affiché

    Example: une seule activite par demie journee
        Given une activité existe déjà pour une demi-journée spécifique
        When l'utilisateur souhaite ajouter une autre activité pour la même demi-journée
        Then l'activité n'est pas ajoutée et un message d'erreur est affiché

    Example: pas plus de deux activites par jour
        Given il exite deux activités déjà pour la même journée pou un utilisateur
        When l'utilisateur choisit de créer une troisième activité pour la même journée
        Then l'activité n'est pas ajoutée et un message d'erreur est affiché

    Example: suppression d'une activité
        Given l'utilisateur a une activité créee
        When il souhaite supprimer cette activité
        And confirme son choix
        Then l'activité est supprimée avec succès

    Example: pas de modification apres le 5 du mois suivant
        Given l'utilisateur souhaite creer une activité
        And la date actuelle est après le 5 du mois suivant
        When il selectionne toutes les informations d'une activite dans le futur
        Then l'activité n'est pas ajoutée et un message d'erreur est affiché

    Example: suppression des activités par plage de dates
        Given l'utilisateur a des activités créees
        When il souhaite supprimer les activités pour une plage de dates spécifique
        And confirme son choix
        Then les activités pour cette période sont supprimées avec succès

## Feature: Gestion des cra

    Example: soumission d'un compte rendu d'activité (CRA)
        Given l'utilisateur a rempli tous les jours de son CRA du mois
        When il souhaite soumettre son CRA
        Then le CRA est soumis avec succès

    Example: récapitulatif d'un cra pour un collaborateur
        Given l'utilisateur souhaite voir le récapitulatif de son CRA actuel
        Then le récapitulatif est affiché avec les détails de son CRA

    Example: récapitulatif de tous les cras pour le gerant
        Given le gerant souhaite voir le récapitulatif de tous les CRAs de tous les collaborateurs
        When il accède à la vue de récapitulatif
        Then le récapitulatif affiche les détails de tous les CRAs avec leurs etats

    Example: telechargement/exportation d'une synthese des cras du mois
        Given le gerant souhaite télécharger une synthèse des CRAs du mois
        When il choisit de télécharger le fichier
        Then le fichier Excel de synthèse est téléchargé avec succès

    Example: cloturer le mois
        Given tous les cra du moi sont soumis
        When le gerant cloture le mois
        Then tous les cras deviennent fermés

## Feature: Gestion des projets

    Example: ajout d'un projet
        Given le gerant souhaite ajouter un projet
        When il fournit les détails du projet à ajouter
        Then le projet est ajouté avec succès 

    Example: associer un utilisateur a un projet
        Given le gerant souhaite affecter un utilisateur à un projet
        When il choisit un utilisateur à associer au projet
        And confirme son choix
        Then l'utilisateur est associé avec succès au projet

    Example: Desactiver un projet
        Given un projet actif
        And le gerant souhaite désactiver le projet
        When il sélectionne le projet à désactiver
        Then le projet est désactivé avec succès

    Example: suppression d'un projet
        Given un projet existe
        And le gerant souhaite supprimer le projet
        When il choisit de supprimer le projet
        Then le projet est supprimé avec succès

    Example: modification d'un projet
        Given un projet existe
        And le gerant souhaite modifier les détails du projet
        When il apporte les modifications nécessaires
        And confirme son choix
        Then les détails du projet sont mis à jour avec succès

## Feature: Récapitulatif cra collaborateur
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


## Feature: Récapitulatif cra gerant
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

## Feature: Gestion des regularisations
    Background: le mois est cloturé

    Example: ajout d'une regul en cas d'ajout d'une nouvelle activite/absence
        When un utilisateur ajoute une nouvelle activite
        Then une regul est creee avec l'intitule ajout

    Example: ajout d'une regul en cas de suppression d'une activite/absence
        When un utilisateur supprime une activite
        Then une regul est creee avec l'intitule suppression

## Feature: Gestion des utilisateurs

    @ToDo
    Example: connexion a l'application
        Given l'application de gestion des CRA
        When l'utilisateur tente de se connecter
        Then l'utilisateur est connecte avec succes et redirigé vers son tableau de bord

    Example: reception des notifications de rappel de soumission des cras
        Given la date limite de soumission des CRA approche
        Then le collaborateur reçoit une notification de rappel pour soumettre son CRA

    Example: reception dees notification de soumission des cra pour l'administrateur
        Given  un collaborateur soumet son CRA
        Then l'administrateur reçoit une notification de soumission du CRA

