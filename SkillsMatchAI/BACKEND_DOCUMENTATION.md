# Documentation du Backend SkillsMatchAI

## Structure du Projet

```
SkillsMatchAI/
├── SkillsMatchAI/              # Configuration principale du projet Django
│   ├── __init__.py
│   ├── asgi.py                 # Configuration ASGI pour déploiement asynchrone
│   ├── settings.py             # Paramètres et configuration du projet
│   ├── urls.py                 # Configuration des URLs principales
│   └── wsgi.py                 # Configuration WSGI pour déploiement
│
├── api/                        # Application pour l'API REST
│   ├── __init__.py
│   ├── admin.py                # Configuration de l'interface d'administration
│   ├── apps.py                 # Configuration de l'application
│   ├── migrations/             # Migrations de base de données
│   ├── models.py               # Modèles de données (vide, utilise ceux de jobs)
│   ├── serializers.py          # Sérialiseurs pour transformer les modèles en JSON
│   ├── tests.py                # Tests unitaires
│   ├── urls.py                 # Configuration des routes API
│   └── views.py                # Vues et logique de l'API
│
├── jobs/                       # Application principale pour les modèles métier
│   ├── __init__.py
│   ├── admin.py                # Configuration de l'interface d'administration
│   ├── apps.py                 # Configuration de l'application
│   ├── fixtures.py             # Génération de données fictives
│   ├── management/             # Commandes personnalisées Django
│   │   ├── __init__.py
│   │   └── commands/
│   │       ├── __init__.py
│   │       └── generate_sample_data.py  # Commande pour générer des données
│   ├── migrations/             # Migrations de base de données
│   ├── models.py               # Définition des modèles de données
│   ├── tests.py                # Tests unitaires
│   └── views.py                # Vues Django (non utilisées, API via api/)
│
├── public/                     # Fichiers statiques publics
│   ├── css/                    # Feuilles de style
│   └── js/                     # Scripts JavaScript
│
└── manage.py                   # Script de gestion Django
```

## Modèles de Données (jobs/models.py)

- **JobFamily**: Représente une famille de métiers regroupant des emplois aux caractéristiques communes.
- **Skill**: Définit une compétence pouvant être requise pour un emploi ou détenue par un employé.
- **Job**: Décrit le profil type d'un emploi avec ses exigences et compétences requises.
- **Position**: Représente une instance concrète d'un poste au sein de l'organisation.
- **Employee**: Centralise les informations relatives à un employé, y compris son statut et sa position.
- **EmployeeSkill**: Associe un employé à une compétence qu'il possède avec un niveau de maîtrise.
- **PositionSkill**: Définit les compétences requises pour une position spécifique et leur niveau d'importance.

## API REST (api/)

L'API REST expose les ressources suivantes via les endpoints sous `/api/` :

- `/api/job-families/` - Gestion des familles de métiers.
- `/api/skills/` - Gestion des compétences avec filtrage par catégorie.
- `/api/jobs/` - Gestion des profils de postes avec leurs compétences requises.
- `/api/positions/` - Gestion des positions concrètes avec filtrage par statut et localisation.
- `/api/employees/` - Gestion des employés avec leurs informations personnelles et professionnelles.
- `/api/employee-skills/` - Gestion des compétences des employés et de leur niveau de maîtrise.
- `/api/position-skills/` - Gestion des compétences requises pour les positions et leur importance.

## Fonctionnalités Principales

- **Gestion complète des données RH**: Le système permet de gérer l'ensemble des données liées aux employés, postes et compétences.
- **API REST complète**: Tous les modèles sont exposés via une API REST avec filtrage, recherche et tri.
- **Documentation Swagger**: Une documentation interactive de l'API est disponible à `/swagger/`.
- **Génération de données fictives**: Une commande personnalisée permet de générer un jeu de données de test.
- **Filtrage avancé**: Chaque endpoint prend en charge le filtrage sur des champs spécifiques.
- **Recherche textuelle**: Recherche dans les champs pertinents pour chaque ressource.
- **Tri personnalisable**: Les résultats peuvent être triés selon différents critères.
- **Authentification**: Support pour l'authentification via Django REST Framework.

## Utilisation des Commandes Personnalisées

Pour générer des données fictives :

```bash
python manage.py generate_sample_data
```

Options disponibles :
- `--job-families` : Nombre de familles de métiers (défaut: 5)
- `--skills` : Nombre de compétences (défaut: 30)
- `--jobs` : Nombre de jobs (défaut: 15)
- `--positions` : Nombre de positions (défaut: 25)
- `--employees` : Nombre d'employés (défaut: 20)

## Démarrage du Serveur

```bash
python manage.py runserver 8001
```

Le serveur sera accessible à l'adresse http://127.0.0.1:8001/ 

## Backend Documentation

### Modèles

Le système utilise les modèles suivants pour représenter les données métier :

- **JobFamily** : Représente une famille de métiers regroupant des emplois aux caractéristiques communes
  - Attributs : nom, description

- **Skill** : Représente une compétence pouvant être requise pour un emploi ou détenue par un employé
  - Attributs : nom, description, catégorie

- **Job** : Définit le profil type d'un emploi avec ses exigences et compétences requises
  - Attributs : titre, description, niveau, famille de métiers, compétences requises

- **Position** : Représente une instance concrète d'un poste au sein de l'organisation
  - Attributs : job, localisation, statut, date de début, employé

- **Employee** : Représente un employé de l'organisation avec ses informations personnelles et professionnelles
  - Attributs : prénom, nom, email, téléphone, date d'embauche, date de naissance, position actuelle, statut d'emploi, photo de profil, CV

- **EmployeeSkill** : Association entre un employé et une compétence qu'il possède
  - Attributs : employé, compétence, niveau de maîtrise, date d'acquisition

- **PositionSkill** : Représente les compétences requises pour une position spécifique
  - Attributs : position, compétence, niveau d'importance, obligatoire/optionnelle, description

### API RESTful

L'application expose les endpoints API suivants pour interagir avec les données :

#### Authentification
- `/api/token/` (POST) : Obtenir un token JWT
- `/api/token/refresh/` (POST) : Rafraîchir un token JWT

#### Utilisateurs
- `/api/users/` : CRUD pour les utilisateurs (admin uniquement)
- `/api/users/me/` : Récupérer les informations de l'utilisateur connecté

#### Familles de métiers
- `/api/job-families/` : CRUD pour les familles de métiers

#### Compétences
- `/api/skills/` : CRUD pour les compétences

#### Emplois
- `/api/jobs/` : CRUD pour les emplois
- `/api/jobs/{id}/positions/` : Récupérer les positions pour un emploi spécifique
- `/api/jobs/{id}/required_skills/` : Récupérer les compétences requises pour un emploi

#### Positions
- `/api/positions/` : CRUD pour les positions
- `/api/positions/{id}/required_skills/` : Récupérer les compétences requises pour une position
- `/api/positions/{id}/assign_employee/` : Assigner un employé à une position

#### Employés
- `/api/employees/` : CRUD pour les employés
- `/api/employees/{id}/skills/` : Récupérer les compétences d'un employé
- `/api/employees/by_skill/` : Filtrer les employés par compétence

#### Compétences des employés
- `/api/employee-skills/` : CRUD pour les compétences des employés

#### Compétences des positions
- `/api/position-skills/` : CRUD pour les compétences requises pour les positions

### Modifications récentes

#### Suppression du modèle Department (Version 2.0)

Dans la version 2.0, le modèle `Department` a été complètement supprimé de l'application pour simplifier la structure de données. Les changements suivants ont été effectués :

1. Suppression du modèle `Department` de `jobs/models.py`
2. Suppression de la référence au département dans le modèle `Employee`
3. Suppression de la classe `DepartmentAdmin` dans `jobs/admin.py`
4. Suppression de `DepartmentSerializer` dans `api/serializers.py`
5. Suppression de `DepartmentViewSet` dans `api/views.py`
6. Suppression de l'enregistrement du viewset dans `api/urls.py`
7. Création et application d'une migration pour supprimer les tables correspondantes

Cette modification simplifie la structure de la base de données et réduit la complexité de l'application. 