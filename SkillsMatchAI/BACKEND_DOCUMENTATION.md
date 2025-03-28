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

### Version 2.1 - Ajout des champs personnalisés (Custom Fields)

Cette version introduit un système flexible de champs personnalisés pour les entités principales de l'application. 
Cette fonctionnalité permet aux administrateurs de définir des attributs supplémentaires pour les Jobs, Positions, Employés et Compétences, afin de s'adapter aux besoins spécifiques de différentes organisations ou projets.

#### Nouveaux modèles

1. **CustomField**
   - Représente la définition d'un champ personnalisé
   - Attributs:
     - `name`: Nom du champ (ex: "Niveau de responsabilité")
     - `field_type`: Type de champ (text, number, date, boolean, select)
     - `model_type`: Type de modèle associé (job, position, employee, skill)
     - `description`: Description du champ
     - `required`: Indique si le champ est obligatoire
     - `options`: Options pour les champs de type select (séparées par des virgules)

2. **CustomFieldValue**
   - Stocke la valeur d'un champ personnalisé pour un objet spécifique
   - Utilise le système de ContentType de Django pour une association générique
   - Attributs:
     - `custom_field`: Référence au champ personnalisé
     - `content_type` et `object_id`: Association avec l'objet concerné
     - `value`: Valeur stockée (sous forme de texte)

#### Extensions des modèles existants

Tous les modèles principaux (Job, Position, Employee, Skill, JobFamily) ont été enrichis avec les méthodes:
- `get_custom_fields()`: Récupère toutes les valeurs des champs personnalisés
- `get_custom_field_value(field_name)`: Récupère la valeur d'un champ spécifique
- `set_custom_field_value(field_name, value)`: Définit la valeur d'un champ

#### API REST pour les champs personnalisés

Nouvelles routes API:
- `/api/custom-fields/` - CRUD pour les définitions de champs personnalisés
- `/api/custom-field-values/` - CRUD pour les valeurs des champs
- `/api/custom-field/set-value/` - Endpoint spécial pour définir une valeur

Les sérialiseurs des modèles existants ont été mis à jour pour inclure automatiquement les champs personnalisés dans les réponses API.

#### Utilisation

**Création d'un champ personnalisé (par un administrateur)**

1. Accéder à l'interface d'administration Django
2. Créer un nouveau CustomField, en spécifiant:
   - Le nom du champ
   - Le type de champ (texte, nombre, date, booléen, sélection)
   - Le modèle auquel il s'applique
   - Une description et si le champ est obligatoire
   - Pour les champs de type "select", définir les options

**Définition d'une valeur via l'API**

```
POST /api/custom-field/set-value/
{
  "model_name": "job",
  "object_id": 1,
  "field_name": "Niveau de responsabilité",
  "value": "Niveau 3"
}
```

**Récupération des valeurs via l'API**

Les champs personnalisés sont automatiquement inclus dans les réponses API sous la clé `custom_fields`:

```json
{
  "id": 1,
  "title": "Développeur Full Stack",
  "level": "Senior",
  // autres champs...
  "custom_fields": [
    {
      "id": 5,
      "custom_field": 3,
      "custom_field_name": "Niveau de responsabilité",
      "field_type": "text",
      "value": "Niveau 3"
    }
  ]
}
```

**Filtrage des champs personnalisés**

Pour récupérer uniquement les valeurs des champs personnalisés d'un objet:

```
GET /api/custom-field-values/?content_type_id=8&object_id=1
```

## Correctif des champs personnalisés pour les positions

Un problème a été résolu concernant l'affichage des champs personnalisés pour les positions dans l'API REST. 

### Problème
Les champs personnalisés (`custom_field1`, `custom_field1_label`, etc.) n'étaient pas retournés correctement dans la réponse de l'API pour les positions, alors qu'ils fonctionnaient normalement pour les autres modèles.

### Solution
Le problème a été résolu en modifiant le sérialiseur `PositionListSerializer` dans `api/serializers.py` pour inclure explicitement tous les champs personnalisés dans la liste `fields` de la classe `Meta`.

```python
class PositionListSerializer(CustomFieldMixin, serializers.ModelSerializer):
    """Sérialiseur pour la liste des positions."""
    job_title = serializers.ReadOnlyField(source='job.title')
    job_level = serializers.ReadOnlyField(source='job.level')
    employee_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Position
        fields = ('id', 'job', 'job_title', 'job_level', 'location', 'status', 'employee_name',
                 'custom_field1', 'custom_field1_label', 'custom_field1_visible',
                 'custom_field2', 'custom_field2_label', 'custom_field2_visible',
                 'custom_field3', 'custom_field3_label', 'custom_field3_visible',
                 'custom_field4', 'custom_field4_label', 'custom_field4_visible')
```

### Test de validation
Après la modification, les champs personnalisés sont maintenant correctement renvoyés dans les résultats de l'API. 
De plus, la propriété `custom_fields` contient désormais les champs personnalisés visibles avec leurs valeurs grâce au mixin `CustomFieldMixin`.

### Utilisation des champs personnalisés
Pour rendre un champ personnalisé visible dans l'API, vous devez :
1. Définir une valeur pour le champ (exemple : `custom_field1 = "Valeur test"`)
2. Définir le libellé du champ (exemple : `custom_field1_label = "Mon libellé"`)
3. Rendre le champ visible (exemple : `custom_field1_visible = True`)

Une fois ces trois conditions remplies, le champ apparaîtra dans le tableau `custom_fields` de la réponse JSON. 