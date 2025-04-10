# Documentation Frontend - Évaluation des compétences

## Composants

### SkillLevelIndicator

Composant permettant d'afficher visuellement le niveau d'une compétence, représenté par des étoiles.

**Fonctionnalités**:
- Affichage visuel du niveau de compétence (1 à 5 étoiles)
- Affichage optionnel du texte décrivant le niveau
- Infobulle sur le niveau de la compétence

**Propriétés**:
- `level`: Niveau numérique de la compétence (1-5)
- `qualitativeLevel`: Description textuelle optionnelle du niveau
- `showText`: Booléen pour afficher ou non le texte du niveau

### EmployeeSkillEvaluation

Composant formulaire permettant d'évaluer ou de modifier l'évaluation d'une compétence pour un employé.

**Fonctionnalités**:
- Évaluation du niveau quantitatif (1-5)
- Saisie d'une description qualitative de la compétence
- Gestion des états de chargement et des erreurs
- Sauvegarde ou mise à jour d'une évaluation existante

**Propriétés**:
- `employee`: Objet employé à évaluer
- `skill`: Objet compétence à évaluer
- `existingEvaluation`: Évaluation existante (optionnel)
- `onSave`: Fonction appelée après la sauvegarde
- `onCancel`: Fonction appelée pour annuler l'évaluation

### EmployeeSkillSelector

Composant de dialogue permettant de sélectionner une compétence à évaluer.

**Fonctionnalités**:
- Affichage de la liste des compétences disponibles
- Recherche de compétences par nom ou description
- Exclusion des compétences déjà évaluées
- Gestion des états de chargement et des erreurs

**Propriétés**:
- `open`: État d'ouverture de la boîte de dialogue
- `onClose`: Fonction pour fermer la boîte de dialogue
- `onSelect`: Fonction appelée lorsqu'une compétence est sélectionnée
- `excludeSkills`: IDs des compétences à exclure de la liste (optionnel)

## Pages

### EvaluationList

Page permettant de gérer l'ensemble des évaluations de compétences dans l'application.

**Fonctionnalités**:
- Affichage de toutes les évaluations dans un tableau paginé
- Filtrage des évaluations par employé, compétence ou recherche textuelle
- Ajout d'une nouvelle évaluation via un dialogue dédié
- Modification d'une évaluation existante
- Suppression d'une évaluation avec confirmation

**Sections**:
- Barre de filtres avec recherche textuelle et sélection par employé ou compétence
- Tableau des évaluations avec niveau visuel (composant SkillLevelIndicator)
- Dialogue d'ajout/modification utilisant le composant EmployeeSkillEvaluation
- Dialogue de confirmation de suppression

## Services

### evaluationService

Service permettant d'interagir avec l'API d'évaluation des compétences.

**Méthodes**:
- `getEvaluations(params)`: Récupère toutes les évaluations avec filtres optionnels
- `getEvaluationById(id)`: Récupère une évaluation spécifique par ID
- `getEvaluationsByEmployee(employeeId)`: Récupère les évaluations pour un employé spécifique
- `getEvaluationsBySkill(skillId)`: Récupère les évaluations pour une compétence spécifique
- `createEvaluation(data)`: Crée une nouvelle évaluation
- `updateEvaluation(id, data)`: Met à jour une évaluation existante
- `deleteEvaluation(id)`: Supprime une évaluation

## Intégration dans la page EmployeeDetail

La page de détail d'un employé a été enrichie avec une section dédiée à l'affichage et à la gestion des compétences de l'employé:

1. Affichage d'un tableau de toutes les compétences évaluées pour l'employé
2. Visualisation du niveau de chaque compétence avec le composant `SkillLevelIndicator`
3. Possibilité d'ajouter une nouvelle évaluation via le composant `EmployeeSkillSelector`
4. Possibilité de modifier une évaluation existante

**Fonctionnalités implémentées**:
- Chargement des évaluations existantes lors du chargement de la page
- Ajout d'une nouvelle compétence à évaluer
- Modification d'une évaluation existante
- Affichage des niveaux de compétence avec visualisation par étoiles
- Exclusion des compétences déjà évaluées lors de l'ajout d'une nouvelle compétence

## Intégration dans la navigation

Les évaluations ont été ajoutées à la barre de navigation principale avec une icône dédiée, permettant d'accéder facilement à la page de gestion des évaluations. Cette intégration se trouve dans les composants suivants:

1. `Navbar.js`: Ajout d'une entrée "Évaluations" dans le menu principal avec une icône `AssessmentIcon`
2. `App.js`: Configuration de la route `/evaluations` pour accéder à la page `EvaluationList`

## Intégration dans les paramètres

La section de paramètres a été étendue pour inclure les configurations spécifiques aux évaluations:

1. Ajout d'une option "Évaluations" dans le sélecteur de type d'entité
2. Configuration de champs personnalisés dédiés aux évaluations (contexte, objectifs, etc.)

## Tests

Des tests unitaires ont été créés pour les composants suivants:
- `EmployeeSkillEvaluation`: Tests du rendu et des interactions utilisateur
- `EmployeeSkillSelector`: Tests du filtrage, de la recherche et des interactions utilisateur 