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
- **Department**: Représente un département ou service au sein de l'organisation.
- **Position**: Représente une instance concrète d'un poste au sein de l'organisation.
- **Employee**: Centralise les informations relatives à un employé, y compris son statut et sa position.
- **EmployeeSkill**: Associe un employé à une compétence qu'il possède avec un niveau de maîtrise.
- **PositionSkill**: Définit les compétences requises pour une position spécifique et leur niveau d'importance.

## API REST (api/)

L'API REST expose les ressources suivantes via les endpoints sous `/api/` :

- `/api/job-families/` - Gestion des familles de métiers.
- `/api/skills/` - Gestion des compétences avec filtrage par catégorie.
- `/api/jobs/` - Gestion des profils de postes avec leurs compétences requises.
- `/api/departments/` - Gestion des départements de l'organisation.
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
- `--departments` : Nombre de départements (défaut: 4)
- `--positions` : Nombre de positions (défaut: 25)
- `--employees` : Nombre d'employés (défaut: 20)

## Démarrage du Serveur

```bash
python manage.py runserver 8001
```

Le serveur sera accessible à l'adresse http://127.0.0.1:8001/ 