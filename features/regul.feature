Feature: Gestion des regularisation
    Background: le mois est cloturé

    Example: ajout d'une regul en cas d'ajout d'une nouvelle activite/absence
        When un utilisateur ajoute une nouvelle activite
        Then une regul est creee avec l'intitule ajout

    Example: ajout d'une regul en cas de suppression d'une activite/absence
        When un utilisateur supprime une activite
        Then une regul est creee avec l'intitule suppression
