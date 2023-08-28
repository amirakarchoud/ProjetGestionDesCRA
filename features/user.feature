Feature: les utilisateurs

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

