---
id: Structure du projet
---
### Structure
Le projet "Gestion des Comptes-Rendus d'Activités (CRA)" est organisé de la manière suivante :

```
proxym-compte-rendu-activite/
│
├── cra-docs/
│   ├── (Documentation du projet)
│
├── docker/
│   ├── docker-compose.yml
│
├── front/
│   ├── (Projet React avec les composants)
│
├── back/
│   ├── test/
│   │   ├── (Tests unitaires et tests d'architecture utilisant TSArch)
│   │
│   ├── test_e2e/
│   │   ├── (Tests de bout en bout(end to end))
│   │
│   ├── src/
│   │   ├── controller/
│   │   │   ├── collab.controller.ts
│   │   │   ├── cra.controller.ts
│   │   │   ├── holiday.controller.ts
│   │   │   ├── project-v2.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │
│   │   ├── decorators/
│   │   │
│   │   ├── data/
│   │   │   ├── dataModel/
│   │   │   │
│   │   │   ├── Repository/
│   │   │
│   │   ├── domain/
│   │   │   ├── model/
│   │   │   │
│   │   │   ├── application/
│   │   │   │
│   │   │   ├── IRepository/
│   │   │   │
│   │   │   ├── service/
│   │   │
│   │   ├── DTO/
│   │   │
│   │   ├── guards/
│   │   │   
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   ├── test.module.ts
│
├── README.md
```

---

### Description

- `cra-docs/` : Ce dossier contient la documentation du projet cree en utilisant Docusaurus, L'objectif de ce site est de rassembler toute la documentation pertinente et toutes les informations liées au projet. Vous y trouverez des descriptions, des guides, des explications et choix techniques et bien plus encore.

- `docker/` : Ce dossier contient le fichier `docker-compose.yml` qui définit la configuration Docker pour le déploiement des conteneurs nécessaires à l'exécution de l'application.

- `front/` : Ce dossier contient le projet React. Vous y trouverez tous les composants, les styles et les ressources nécessaires à l'interface utilisateur de l'application.

- `back/` : Ce dossier contient le code source du backend de l'application. Il est subdivisé en plusieurs sous-dossiers :

  - `test/` : Ce dossier contient les tests unitaires qui visent à vérifier le comportement et la logique métier de l'application. Il comprend également des tests d'architecture utilisant la bibliothèque TSArch. Cette bibliothèque a été essentielle pour maintenir la cohérence architecturale à travers le code. Elle a permis de vérifier que les dépendances étaient correctement gérées et que chaque élément était positionné conformément à l'architecture globale.

  - `test_e2e/` : Ce dossier contient les tests de bout en bout qui simulent les interactions pour valider les fonctionnalités de bout en bout de l'application entre les differents composants.

  - `src/` : Ce dossier contient le code source du backend, organisé en plusieurs sous-dossiers :

    - `controller/` : Ce dossier contient les contrôleurs qui gèrent les interactions utilisateur et les requêtes HTTP. Ils orchestrent les flux de données entre le frontend et le backend.

    - `decorators/` : Ce dossier contient les décorateurs qui ajoutent des fonctionnalités spécifiques aux différentes parties de l'application.

    - `data/` : Ce dossier contient les modèles de données utilise pour la creation de la base de données. Il inclut également les implémentations des Repository pour l'accès aux données.Ici l'ORM utilisé est TypeORM.

    - `domain/` : Ce dossier contient les modèles de domaine encapsulant les règles métier, les interfaces IRepository pour l'accès aux données et les services implémentant la logique métier.

    - `DTO/` : Ce dossier contient les objets de transfert de données utilisés pour échanger des informations entre les différentes parties de l'application.

    - `guards/` : Ce dossier contient les gardiens de sécurité qui protègent les routes et les ressources de l'application.

    - `app.module.ts` : Fichier de configuration du module principal de l'application.

    - `app.service.ts` : Fichier de service principal de l'application.

    - `main.ts` : Point d'entrée pour le démarrage de l'application.

    - `test.module.ts` : Fichier de configuration des tests de l'application.
