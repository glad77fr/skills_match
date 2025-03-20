# Documentation du Frontend SkillsMatchAI

## Structure du Projet

```
frontend/
├── node_modules/            # Dépendances installées
├── public/                  # Fichiers statiques publics
│   ├── favicon.ico          # Icône du site
│   ├── index.html           # Page HTML principale
│   ├── manifest.json        # Manifeste pour les PWA
│   └── robots.txt           # Configuration pour les robots d'indexation
│
├── src/                     # Code source de l'application
│   ├── components/          # Composants React réutilisables
│   ├── context/             # Contextes React pour la gestion d'état global
│   ├── pages/               # Composants de pages complètes
│   ├── services/            # Services pour les appels API
│   ├── utils/               # Fonctions utilitaires
│   ├── App.css              # Styles pour le composant App
│   ├── App.js               # Composant principal de l'application
│   ├── App.test.js          # Tests pour le composant App
│   ├── index.css            # Styles globaux
│   ├── index.js             # Point d'entrée de l'application
│   ├── logo.svg             # Logo React
│   ├── reportWebVitals.js   # Mesure des performances
│   └── setupTests.js        # Configuration des tests
│
├── .gitignore               # Fichiers ignorés par Git
├── package-lock.json        # Verrouillage des versions des dépendances
├── package.json             # Configuration du projet et dépendances
└── README.md                # Documentation du projet
```

## Technologies Utilisées

- **React** : Bibliothèque JavaScript pour construire l'interface utilisateur.
- **React Router** : Gestion du routage côté client pour la navigation entre les pages.
- **Material-UI** : Bibliothèque de composants UI pour un design moderne et responsive.
- **Axios** : Client HTTP pour effectuer des requêtes vers l'API backend.
- **JWT Decode** : Utilitaire pour décoder les tokens JWT d'authentification.

## Structure de l'Application

L'application frontend est organisée selon une architecture modulaire :

- **Components** : Composants React réutilisables pour l'interface utilisateur.
- **Pages** : Composants de niveau supérieur représentant des pages complètes.
- **Context** : Gestion de l'état global de l'application avec l'API Context de React.
- **Services** : Fonctions pour communiquer avec l'API backend.
- **Utils** : Fonctions utilitaires et helpers pour diverses tâches.

## Fonctionnalités Principales

- **Interface utilisateur moderne** : UI responsive basée sur Material-UI pour une expérience utilisateur optimale.
- **Gestion d'état** : Utilisation de l'API Context de React pour gérer l'état global de l'application.
- **Routage client** : Navigation fluide entre les différentes pages sans rechargement complet.
- **Communication avec l'API** : Services pour interagir avec le backend Django REST.
- **Authentification** : Gestion des tokens JWT pour l'authentification des utilisateurs.
- **Formulaires interactifs** : Saisie et validation des données utilisateur.
- **Visualisation des données** : Affichage des données RH sous forme de tableaux et graphiques.

## Pages Principales (à implémenter)

- **Dashboard** : Vue d'ensemble des statistiques et indicateurs clés.
- **Employés** : Liste et détails des employés avec leurs compétences.
- **Compétences** : Gestion du référentiel de compétences.
- **Postes** : Visualisation et gestion des postes et positions.
- **Matching** : Fonctionnalité de correspondance entre employés et postes basée sur les compétences.
- **Rapports** : Génération de rapports et analyses.

## Détails des Pages Principales

### Page des Positions (PositionsPage)

La page des positions permet de gérer les postes disponibles dans l'organisation. Elle offre les fonctionnalités suivantes :

#### Fonctionnalités
- **Affichage des postes** : Liste paginée des postes avec leurs informations principales
- **Filtrage** : Recherche textuelle et filtrage par métier
- **Ajout de poste** : Création d'un nouveau poste avec les informations requises
- **Modification** : Mise à jour des informations d'un poste existant
- **Suppression** : Suppression d'un poste après confirmation
- **Gestion des compétences requises** : Accès à la gestion des compétences requises pour chaque poste
- **Assignation d'employés** : Possibilité d'assigner un employé à un poste

#### Structure des données
Un poste est défini par les propriétés suivantes :
- **Métier (job)** : Le métier associé au poste, qui détermine son titre et son niveau
- **Localisation** : L'emplacement géographique du poste
- **Description** : Description détaillée du poste (optionnelle)
- **Statut** : État du poste (Actif/Inactif)

#### Modifications récentes
- **Suppression du champ salaire** : Le champ "salary_range" a été retiré de l'interface utilisateur pour simplifier la gestion des postes et respecter les politiques de confidentialité.
- **Correction de l'affichage du titre** : Le titre du poste est maintenant correctement affiché en utilisant la propriété `job_title` qui est dérivée du métier associé.
- **Amélioration de l'interface** : Les colonnes du tableau ont été réorganisées pour afficher "Poste" et "Niveau" au lieu de "Titre" et "Métier".
- **Simplification du formulaire** : Le formulaire d'ajout/modification a été simplifié en supprimant le champ titre, puisque celui-ci est dérivé du métier sélectionné.

#### Implémentation technique
La page utilise les services suivants :
- `positionService` : Pour les opérations CRUD sur les postes
- `jobService` : Pour récupérer la liste des métiers disponibles

Le composant gère l'état local pour :
- La liste des postes et des métiers
- La pagination et le filtrage
- Les formulaires d'ajout/modification
- Les dialogues de confirmation
- Les notifications

#### Intégration avec le backend
La page communique avec les endpoints API suivants :
- `GET /api/positions/` : Récupération de la liste des postes avec pagination et filtrage
- `GET /api/jobs/` : Récupération de la liste des métiers
- `POST /api/positions/` : Création d'un nouveau poste
- `PUT /api/positions/{id}/` : Mise à jour d'un poste existant
- `DELETE /api/positions/{id}/` : Suppression d'un poste

### Modifications récentes

#### Suppression de la page des départements (Version 2.0)

Dans la version 2.0, la fonctionnalité de gestion des départements a été complètement supprimée. Les changements suivants ont été effectués :

1. Suppression du composant `DepartmentsPage`
2. Suppression du service `departmentService`
3. Suppression des routes liées aux départements dans `App.js`
4. Suppression de l'entrée de menu des départements dans la sidebar
5. Suppression des statistiques liées aux départements dans le dashboard
6. Suppression des filtres par département dans la page des employés

Cette modification simplifie l'interface utilisateur et la structure de l'application.

#### Ajout de pages manquantes (Version 2.1)

Dans la version 2.1, les pages suivantes ont été ajoutées pour compléter l'interface utilisateur :

1. **LoginPage** : Page dédiée à l'authentification des utilisateurs
   - Interface simple avec formulaire de connexion
   - Intégration avec le composant `LoginForm` existant
   - Style cohérent avec le reste de l'application

2. **UserSettingsPage** : Page de paramètres utilisateur
   - Informations personnelles (prénom, nom, email)
   - Préférences d'interface (mode sombre, notifications)
   - Fonctionnalité de sauvegarde des préférences

Ces ajouts complètent l'expérience utilisateur et permettent une navigation fluide dans l'application.

## Démarrage de l'Application

Pour lancer l'application en mode développement :

```bash
cd frontend
npm start
```

L'application sera accessible à l'adresse http://localhost:3000.

## Construction pour la Production

Pour créer une version optimisée pour la production :

```bash
cd frontend
npm run build
```

Les fichiers de production seront générés dans le dossier `build/`.

## État Actuel du Développement

Le frontend est en cours de développement actif avec plusieurs fonctionnalités déjà implémentées :

1. **Configuration des routes** : React Router est configuré pour la navigation entre les différentes pages.
2. **Services API** : Les services pour communiquer avec le backend Django sont implémentés pour les principales entités (compétences, métiers, postes, départements, employés).
3. **Composants UI** : Les composants pour afficher et manipuler les données sont développés avec Material-UI.
4. **Intégration avec le backend** : La connexion avec l'API REST est fonctionnelle pour récupérer et modifier les données.
5. **Authentification** : Le système d'authentification utilisateur basé sur JWT est en place.

Les fonctionnalités suivantes ont été implémentées :
- Gestion des compétences (ajout, modification, suppression)
- Gestion des métiers et familles de métiers
- Gestion des postes (avec les modifications récentes sur la suppression du champ salaire)
- Gestion des départements
- Gestion des employés et de leurs compétences

## Prochaines Étapes

1. Améliorer la gestion des erreurs et la validation des formulaires
2. Développer des visualisations graphiques pour les données (tableaux de bord)
3. Implémenter la fonctionnalité de matching entre employés et postes
4. Ajouter des fonctionnalités de reporting et d'export de données
5. Optimiser les performances et l'expérience utilisateur 

## Problèmes Connus et Solutions

### Erreur dans l'affichage du nom de l'employé pour les positions

**Problème** : Le backend générait des erreurs lors de la récupération des positions avec le message : `Error getting employee name: 'ForeignKey' object has no attribute 'id'`. Cette erreur se produisait dans la méthode `get_employee_name` du sérialiseur `PositionListSerializer`.

**Cause** : La méthode tentait d'accéder à `obj.employee_id`, mais le champ `employee` est une ForeignKey et n'a pas directement un attribut `id`. De plus, la méthode tentait d'accéder à `obj.employee.first_name` et `obj.employee.last_name` directement, ce qui causait une erreur lorsque l'objet ForeignKey n'était pas correctement résolu.

**Solution** : La méthode `get_employee_name` a été modifiée pour vérifier si l'attribut `employee` existe et n'est pas `None` avant d'essayer d'accéder à son ID. Ensuite, elle récupère l'instance de l'employé à partir de la base de données en utilisant cet ID.

```python
def get_employee_name(self, obj):
    try:
        if hasattr(obj, 'employee') and obj.employee is not None:
            from jobs.models import Employee
            employee = Employee.objects.get(id=obj.employee.id)
            return f"{employee.first_name} {employee.last_name}"
        return None
    except Exception as e:
        print(f"Error getting employee name: {e}")
        return "Unknown Employee"
```

### Erreur dans la récupération des catégories de compétences

**Problème** : Le frontend générait des erreurs lors de la récupération des catégories de compétences avec le message : `TypeError: response.data.map is not a function`.

**Cause** : La méthode `getSkillCategories` dans le service `skillService` supposait que la réponse de l'API était un tableau d'objets de compétences, mais en réalité, il s'agissait d'un objet paginé avec une propriété `results` contenant les compétences.

**Solution** : La méthode a été modifiée pour vérifier si la réponse est un objet paginé ou un tableau direct, et pour filtrer les catégories null ou undefined avant d'extraire les catégories uniques.

```javascript
getSkillCategories: async () => {
  try {
    const response = await api.get('/skills/');
    
    // Vérifier si la réponse est un objet paginé ou un tableau direct
    const skills = Array.isArray(response.data) 
      ? response.data 
      : (response.data.results || []);
    
    // Filtrer les catégories null ou undefined et extraire les catégories uniques
    const categories = [...new Set(skills
      .filter(skill => skill && skill.category)
      .map(skill => skill.category))];
    
    return categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories de compétences:', error);
    throw error;
  }
}
```

### Suppression du champ salaire dans la gestion des postes

**Problème** : Le champ salaire (`salary_range`) était présent dans l'interface utilisateur pour les postes, mais il a été décidé de le supprimer pour des raisons de confidentialité et de simplification.

**Solution** : Le champ a été supprimé du tableau d'affichage des postes et du formulaire d'ajout/modification. Les propriétés correspondantes ont également été supprimées de l'état du formulaire. 

## Services API

L'application utilise plusieurs services pour communiquer avec le backend. Ces services sont situés dans le dossier `src/services/` et suivent une structure similaire pour chaque entité.

### Structure générale d'un service

Chaque service est un objet JavaScript qui expose des méthodes pour effectuer des opérations CRUD sur une entité spécifique. Voici la structure générale :

```javascript
import api from './axiosConfig';

const entityService = {
  // Récupérer tous les éléments (avec pagination et filtrage)
  getEntities: async (params = {}) => {
    try {
      const response = await api.get('/endpoint/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des entités:', error);
      throw error;
    }
  },
  
  // Récupérer un élément par son ID
  getEntityById: async (id) => { /* ... */ },
  
  // Créer un nouvel élément
  createEntity: async (entityData) => { /* ... */ },
  
  // Mettre à jour un élément existant
  updateEntity: async (id, entityData) => { /* ... */ },
  
  // Supprimer un élément
  deleteEntity: async (id) => { /* ... */ },
  
  // Méthodes spécifiques à l'entité...
};

export default entityService;
```

### Services implémentés

Les services suivants ont été implémentés :

#### authService
Gère l'authentification des utilisateurs avec JWT.
- `login(username, password)` : Authentifie un utilisateur et stocke les tokens
- `logout()` : Déconnecte l'utilisateur en supprimant les tokens
- `refreshToken()` : Rafraîchit le token d'accès
- `getCurrentUser()` : Récupère les informations de l'utilisateur connecté

#### skillService
Gère les opérations sur les compétences.
- Méthodes CRUD standard
- `getSkillCategories()` : Récupère les catégories de compétences distinctes

#### jobService
Gère les opérations sur les métiers.
- Méthodes CRUD standard
- `getJobPositions(id)` : Récupère les positions associées à un métier
- `getJobRequiredSkills(id)` : Récupère les compétences requises pour un métier
- `getJobFamilies()` : Récupère toutes les familles de métiers

#### positionService
Gère les opérations sur les postes.
- Méthodes CRUD standard
- `getPositionRequiredSkills(id)` : Récupère les compétences requises pour un poste
- `assignEmployee(positionId, employeeId)` : Assigne un employé à un poste
- Méthodes pour gérer les compétences requises pour les positions

#### departmentService
Gère les opérations sur les départements.
- Méthodes CRUD standard
- `getDepartmentEmployees(id)` : Récupère les employés d'un département

#### employeeService
Gère les opérations sur les employés.
- Méthodes CRUD standard
- `getEmployeeSkills(id)` : Récupère les compétences d'un employé
- Méthodes pour gérer les compétences des employés

### Configuration Axios

Le fichier `axiosConfig.js` configure l'instance Axios utilisée par tous les services. Il gère :
- L'URL de base de l'API
- Les en-têtes d'authentification
- Les intercepteurs pour le rafraîchissement automatique des tokens
- La gestion des erreurs 

## Structure de la mise en page

L'application utilise une structure de mise en page cohérente pour toutes les pages protégées (nécessitant une authentification).

### MainLayout

Le composant `MainLayout` est responsable de la structure globale de l'interface utilisateur. Il comprend :

- **Navbar** : Barre de navigation supérieure toujours visible
- **Sidebar** : Menu latéral pour la navigation entre les différentes sections
- **Contenu principal** : Zone où le contenu spécifique à chaque page est affiché

Le `MainLayout` est appliqué au niveau de l'application via un composant `ProtectedLayout` qui combine :
- La vérification d'authentification (`ProtectedRoute`)
- La mise en page commune (`MainLayout`)

```jsx
const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
};
```

Cette approche garantit que :
1. Toutes les pages protégées nécessitent une authentification
2. La navbar et le sidebar sont toujours présents sur toutes les pages protégées
3. La navigation est cohérente dans toute l'application

### Navbar

La barre de navigation supérieure (`Navbar`) contient :
- Un bouton pour basculer l'affichage du menu latéral
- Le logo et le nom de l'application
- Une barre de recherche centrale
- Un menu utilisateur avec accès au profil, aux paramètres et à la déconnexion

### Sidebar

Le menu latéral (`Sidebar`) fournit une navigation entre les différentes sections de l'application :
- Tableau de bord
- Gestion des compétences
- Gestion des métiers
- Gestion des départements
- Gestion des postes
- Gestion des employés
- Matching de compétences
- Analyses et rapports

Le menu peut être réduit ou développé pour s'adapter aux préférences de l'utilisateur et optimiser l'espace d'affichage. L'utilisateur peut :
- Fermer complètement la sidebar en cliquant sur l'icône de menu dans la navbar
- Rouvrir la sidebar en cliquant à nouveau sur l'icône de menu
- Réduire/développer les sections individuelles (Référentiels, Gestion, Analytique) en cliquant sur leurs en-têtes

Lorsque la sidebar est fermée, elle se déplace hors de l'écran (transformation CSS) sans occuper d'espace, permettant au contenu principal d'occuper toute la largeur disponible. La sidebar utilise un positionnement fixe qui lui permet de rester accessible sans affecter la mise en page du contenu principal. Sur les appareils mobiles, la sidebar est automatiquement fermée au chargement pour optimiser l'espace d'affichage.

### Modifications récentes

La structure de mise en page a été améliorée pour garantir que la navbar est toujours présente sur toutes les pages protégées. Les modifications incluent :

1. Création d'un composant `ProtectedLayout` qui combine `ProtectedRoute` et `MainLayout`
2. Application de ce composant à toutes les routes protégées dans `App.js`
3. Suppression de l'enveloppement individuel avec `MainLayout` dans chaque composant de page
4. Amélioration de la sidebar pour permettre de la fermer complètement, libérant ainsi plus d'espace pour le contenu principal
5. Ajout de transitions fluides lors de l'ouverture et de la fermeture de la sidebar
6. Optimisation de l'espace entre la sidebar et le contenu principal pour une meilleure utilisation de l'espace écran
7. Réduction des marges et paddings excessifs dans l'interface pour une présentation plus compacte et efficace
8. Amélioration du comportement responsive pour que le contenu principal occupe l'intégralité de la page lorsque la sidebar est fermée
9. Détection automatique des appareils mobiles pour fermer la sidebar par défaut sur les petits écrans
10. Utilisation de transformations CSS pour déplacer la sidebar hors de l'écran lorsqu'elle est fermée
11. Implémentation d'un positionnement fixe pour la sidebar, permettant au contenu principal d'occuper toute la largeur disponible sans espace latéral inutile
12. Optimisation des transitions pour garantir une expérience utilisateur fluide lors de l'ouverture et de la fermeture de la sidebar

Ces modifications assurent une expérience utilisateur cohérente avec une navigation toujours accessible, tout en simplifiant la structure du code et en évitant la duplication. La possibilité de fermer la sidebar et l'optimisation de l'espace offrent également une meilleure utilisation de l'espace écran, particulièrement utile pour visualiser des tableaux de données volumineux. 