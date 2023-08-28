Feature: Gestion des cra

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
