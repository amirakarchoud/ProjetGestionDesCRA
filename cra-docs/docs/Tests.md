---
id: Tests
---

Pour garantir la qualité du code et la fonctionnalité , on a mis en place plusieurs tests

1. **Développement Piloté par les Tests (TDD) :**  
![painPoints](../static/img/tdd.png)  
Nous avons adopté une approche de Développement Piloté par les Tests (TDD), où les tests ont été au cœur du processus de développement.Ces tests ont joué un rôle majeur dans la définition du comportement attendu de chaque fonctionnalité, de la logique métier et dans la garantie de la qualité du code.

2. **Framework de Test Jest :**  
Le framework Jest a été utilisé pour écrire et exécuter les tests. Jest est largement utilisé pour tester les applications JavaScript et TypeScript en raison de sa simplicité et de ses capacités étendues.

3. **TSArch pour les Tests d'Architecture :**  
La bibliothèque TSArch a été utilisée pour effectuer des tests d'architecture sur les projets TypeScript. Cette bibliothèque a été essentielle pour maintenir la cohérence architecturale à travers le code. Elle a permis de vérifier que les dépendances étaient correctement gérées et que chaque élément était positionné conformément à l'architecture globale.
Dans le fichier de test : architecture.spec.ts , on trouve:
- Tests de cycles/boucles
- Tests que le domaine ne doit pas dépendre de la couche de données
- Tests que le domaine ne doit pas dépendre des contrôleurs
- Tests que les contrôleurs ne doivent pas dépendre de la couche de données
- Tests que la couche de données ne doit pas dépendre des contrôleurs
- Tests des noms des fichiers selon la couche dont il fait partie.

4. **Deux Types de Tests :**  
On a mis en place différents types de tests :  
   - **Tests Unitaires :** Ces tests visent vérifier le comportement et la logique métier du code et valider les fonctionnalités en isolation.
Pour ce faire , on a créé un fichier de test pour chaque entité du domaine.
   - **Tests de Bout en Bout (e2e) :** Ces tests évaluent le comportement de l'application dans son ensemble, en simulant les interactions réelles des utilisateurs pour assurer l'intégration des différents composants et parties du système.

5. **Base de Données de Test Isolée :**  
Pour éviter toute interférence avec la base de données principale, une base de données distincte a été créée exclusivement à des fins de test. Cette approche garantit que les tests n'affectent pas les données réelles.

6. **Scripts de Test :**  
Le fichier `package.json` du projet comprend des scripts permettant l'exécution des tests. Ces scripts ont été utilisés pour exécuter les tests unitaires, les tests de bout en bout et les tests d'architecture. Par exemple, l'exécution des tests unitaires pouvait être réalisée avec la commande `npm test`, tandis que l'exécution des tests de bout en bout pouvait être effectuée à l'aide de `npm run test:e2e`.
