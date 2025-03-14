# Génération de données fictives pour SkillsMatchAI

Ce document explique comment utiliser la fonctionnalité de génération de données fictives pour l'application SkillsMatchAI.

## Prérequis

Assurez-vous d'avoir installé les dépendances nécessaires :

```bash
pip install -r requirements.txt
```

## Utilisation

### Via la commande Django

La méthode recommandée pour générer des données fictives est d'utiliser la commande Django dédiée :

```bash
python manage.py generate_sample_data
```

Cette commande va générer un ensemble de données par défaut :
- 5 familles de métiers
- 30 compétences
- 15 jobs
- 4 départements
- 25 positions
- 20 employés

### Options de personnalisation

Vous pouvez personnaliser le nombre d'éléments générés en utilisant les options suivantes :

```bash
python manage.py generate_sample_data --job-families 8 --skills 40 --jobs 20 --departments 6 --positions 30 --employees 25
```

### Via le shell Django

Vous pouvez également générer des données depuis le shell Django :

```bash
python manage.py shell
```

Puis dans le shell :

```python
from jobs.fixtures import create_sample_data
stats = create_sample_data()
print(stats)
```

## Données générées

La fonction génère des données pour tous les modèles de l'application jobs :

1. **JobFamily** - Familles de métiers
2. **Skill** - Compétences
3. **Job** - Profils de postes
4. **Department** - Départements
5. **Position** - Positions concrètes
6. **Employee** - Employés
7. **EmployeeSkill** - Compétences des employés
8. **PositionSkill** - Compétences requises pour les positions

## Remarques importantes

- La fonction supprime toutes les données existantes avant de générer de nouvelles données
- Les données générées sont cohérentes entre elles (relations entre les modèles)
- Les employés sont associés à des positions vacantes de manière aléatoire
- Les compétences sont attribuées aux employés avec des niveaux de maîtrise aléatoires 