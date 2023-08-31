---
id: Manuel d'installation
---
# Guide d'Installation

Ce guide d’installation aborde comment mettre en place et exécuter l'application "Gestion des Comptes-Rendus d'Activités (CRA)" localement .

## Étape 1 : Clonage du Projet

1. Clonez ce dépôt sur votre machine locale.

```bash
git clone https://github.com/proxym-france/proxym-compte-rendu-activite.git
```

## Étape 2 : Utilisation de Docker

Pour exécuter l'application en utilisant Docker.

1. S’assurer d'avoir Docker et Docker Compose installés sur votre machine.

2. Naviguer vers le dossier `docker` dans le projet.
```bash
cd docker
```


3. Démarrer tous les services (base de données, backend, frontend) :

```bash
docker-compose up -d
```

Cela lancera les conteneurs pour la base de données, le backend et le frontend. Une fois les conteneurs en cours d'exécution, vous pourrez accéder à l'application web à l'adresse http://localhost:3000. Cela crée également la base de données ‘proxym_cra’ en utilisant le script init.sql.
4. Pour arrêter tous les conteneurs, exécutez :

```bash
docker-compose down
```

### Exécution de Services Individuels

Vous pouvez également exécuter des services individuels séparément à l'aide de Docker Compose.

##### Exécution du Service de la Base de Données

Pour exécuter uniquement le service de la base de données :

```bash
docker-compose up -d database
```

##### Exécution du Service Backend

Pour exécuter uniquement le service backend :

```bash
docker-compose up -d backend
```

##### Exécution du Service Frontend

Pour exécuter uniquement le service frontend :

```bash
docker-compose up -d frontend
```

## Étape 3 : Sans l’utilisation de Docker
Si vous voulez installer et exécuter l'application dans un environnement classique sans utiliser Docker, suivez les étapes suivantes :
1. Installer Node.JS
2. Mettre en place un serveur web (Apache ou autre)
3. Installer et configurer mysql
4. Créer la base de donnees ‘proxym_cra’
5. Démarrer  le backend : 
```bash
Cd back
```
```bash
npm install
```
```bash
npm run start
```
6. Démarrer  le frontend : 
```bash
cd front
```
```bash
npm install
```
```bash
npm run
```
