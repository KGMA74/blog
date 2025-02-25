Blog - Projet Full Stack

📌 Introduction

Ce projet est une plateforme de blog développée avec Django pour le backend et Next.js pour le frontend. Il est conteneurisé avec Docker et Docker Compose pour simplifier le déploiement et garantir une compatibilité entre les environnements.

🏗️ Architecture

Backend : Django (API REST avec DRF, gestion des utilisateurs avec Djoser)

Frontend : Next.js avec Tailwind CSS

Base de données : PostgreSQL (conteneurisé dans Docker)

Reverse Proxy & Distribution des images : Nginx

Authentification : Basée sur les cookies pour éviter les attaques XSS

Stockage des fichiers : Géré via Django et distribué par Nginx

Sécurité : HTTPS en production avec Let's Encrypt

🚀 Lancer le projet en local

🔧 Prérequis

Docker et Docker Compose doivent être installés sur votre machine.

📥 Installation et démarrage

Cloner le dépôt

git clone https://github.com/KGMA74/blog.git
cd blog

Configurer les variables d'environnement

Un fichier .env est déjà fourni à la racine du projet.

Important : L'adresse IP de votre machine doit être renseignée dans .env (voir l'exemple présent dans le fichier).

Lancer les conteneurs

docker-compose up --build -d

🌍 Accéder à l'application

L'application sera automatiquement disponible sur le réseau local à l'adresse suivante :🔗 https://192.168.X.X (Remplacez 192.168.X.X par l'adresse IP de votre machine.)

📌 Remarque : Le certificat SSL est auto-signé, donc votre navigateur peut afficher un avertissement. Il suffit d'accepter l'exception pour continuer.

🛠️ Configuration de la base de données

Si DEBUG=False dans le fichier .env, Django utilisera PostgreSQL.

PostgreSQL est automatiquement configuré dans Docker.

Attention : Si vous modifiez DEBUG=False, vous devez rebuild l’image Docker avec :

docker-compose up --build -d

🌍 Déploiement en production

En production, vous pouvez utiliser l’adresse publique du VPS ou un domaine.

Pour le SSL, utilisez Let's Encrypt au lieu du certificat auto-signé.

📝 Notes supplémentaires

L’authentification repose sur les cookies pour éviter les attaques XSS.

PostgreSQL et Python n'ont pas besoin d'être installés localement, tout est géré par les conteneurs.

L’application est accessible depuis le réseau local sans configuration supplémentaire.

📌 Dernière remarque : J’ai volontairement inclus le fichier .env dans le dépôt pour simplifier les tests en local, en étant conscient des risques de sécurité.
