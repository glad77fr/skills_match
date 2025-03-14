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

Le frontend est actuellement à l'état initial d'une application React créée avec Create React App. Les principales fonctionnalités à développer sont :

1. **Configuration des routes** : Mise en place de React Router pour la navigation.
2. **Création des services API** : Implémentation des appels vers le backend Django.
3. **Développement des composants UI** : Création des composants pour afficher et manipuler les données.
4. **Intégration avec le backend** : Connexion avec l'API REST pour récupérer et modifier les données.
5. **Authentification** : Mise en place du système d'authentification utilisateur.

## Prochaines Étapes

1. Créer la structure de base des dossiers (components, pages, etc.)
2. Configurer React Router pour la navigation
3. Implémenter les services API pour communiquer avec le backend
4. Développer les composants UI pour les principales entités (employés, compétences, postes)
5. Mettre en place l'authentification utilisateur 