Feature: gestion des absences

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

    @ToDo
    Example: plage de date commencant l'apres-midi
    @ToDo
    Example: plage de date se terminant le matin