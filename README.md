# Blog - Projet Full Stack

## Table of Contents
- [Introduction](#introduction)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project Locally](#running-the-project-locally)
- [Database Configuration](#database-configuration)
- [Production Deployment](#production-deployment)
- [Additional Notes](#additional-notes)
- [Contributing](#contributing)
- [Common Issues](#common-issues)
- [License](#license)

## Introduction
Ce projet est une plateforme de blog développée avec Django pour le backend et Next.js pour le frontend. Il est conteneurisé avec Docker et Docker Compose pour simplifier le déploiement et garantir une configuration homogène.

## Architecture
- **Backend**: Django (API REST avec DRF, gestion des utilisateurs avec Djoser)
- **Frontend**: Next.js avec Tailwind CSS
- **Base de données**: PostgreSQL (conteneurisé dans Docker)
- **Reverse Proxy & Distribution des images**: Nginx
- **Authentification**: Basée sur les cookies pour éviter les attaques XSS
- **Stockage des fichiers**: Géré via Django et distribué par Nginx
- **Sécurité**: HTTPS en production avec Let's Encrypt

## Prerequisites
Docker et Docker Compose doivent être installés sur votre machine.

## Installation
1. Cloner le dépôt
    ```sh
    git clone https://github.com/KGMA74/blog.git
    cd blog
    ```
2. Configurer les variables d'environnement
    Un fichier `.env` est déjà fourni à la racine du projet. Important : L'adresse IP de votre machine doit être renseignée dans `.env` (voir l'exemple présent dans le fichier).

3. Lancer les conteneurs
    ```sh
    docker-compose up --build -d
    ```

## Running the Project Locally
L'application sera automatiquement disponible sur le réseau local à l'adresse suivante : [http://192.168.X.X](https://192.168.X.X) (Remplacez 192.168.X.X par l'adresse IP de votre machine.)

## Database Configuration
- Si `DEBUG=False` dans le fichier `.env`, Django utilisera PostgreSQL.
- PostgreSQL est automatiquement configuré dans Docker.
- Attention : Si vous modifiez `DEBUG=False`, vous devez rebuild l’image Docker avec :
    ```sh
    docker-compose up --build -d
    ```

## Production Deployment
En production, vous pouvez utiliser l’adresse publique du VPS ou un domaine. Pour le SSL, utilisez Let's Encrypt au lieu du certificat auto-signé.

## Additional Notes
- L’authentification repose sur les cookies pour éviter les attaques XSS.
- PostgreSQL et Python n'ont pas besoin d'être installés localement, tout est géré par les conteneurs.
- L’application est accessible depuis le réseau local sans configuration supplémentaire.
- Dernière remarque : J’ai volontairement inclus le fichier `.env` dans le dépôt pour simplifier les tests en local, en étant conscient des risques de sécurité.
- les utilisateurs deja creer sont: (user@gmail.com , 7488) un user lambda et (admin@admin@gmail.com, 7488) un admin user

## Contributing
Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour toute suggestion d'amélioration.

## Common Issues
Listez ici les problèmes courants rencontrés par les utilisateurs et comment les résoudre.
