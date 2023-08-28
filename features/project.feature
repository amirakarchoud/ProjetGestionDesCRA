Feature: Gestion des projets

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