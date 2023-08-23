Feature: gestion des activites

    Example: ajout d'une activite pour une date
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
    @ToDo
    Example: plage de date commencant l'apres-midi
    @ToDo
    Example: plage de date se terminant le matin