---
id: Base de données
---
## Séparation en Couches
La base de données est soigneusement séparée des autres composants de l'application, suivant le principe d'architecture en couches. Cette approche permet de garantir une meilleure modularité et de faciliter la maintenance de l'application.

## Utilisation d'une Base Relationnelle
Pour répondre aux besoins de stockage de données, une base de données relationnelle a été choisie. Cette approche offre une structure bien définie pour organiser les données .

## MySQL
MySQL a été sélectionné comme système de gestion de base de données pour ce projet. Son historique de fiabilité, sa performance et sa compatibilité avec diverses applications en font un choix solide pour stocker et gérer les données de l'application.

## TypeORM
![typeorm](../static/img/typeorm.png)  
L'ORM (Object-Relational Mapping) utilisé dans ce projet est TypeORM. Il simplifie l'interaction entre la base de données et l'application en permettant de manipuler les données sous forme d'objets JavaScript, offrant ainsi une abstraction des requêtes SQL.

## Interrogation de la Base de Données
L'interrogation de la base de données a été gérée via des requêtes SQL générées automatiquement par TypeORM. Cela a permis de récupérer, mettre à jour et supprimer les données de manière efficace, tout en évitant les vulnérabilités liées aux injections SQL.
