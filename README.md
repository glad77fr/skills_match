# SkillsMatchAI

SkillsMatchAI est une application de gestion des compétences et des emplois qui utilise Django comme backend API et React comme frontend.

## Architecture

- **Backend** : Django REST Framework
- **Frontend** : React
- **Authentification** : JWT (JSON Web Tokens)
- **Base de données** : SQLite (développement) / PostgreSQL (production)

## Installation et configuration du backend (Django)

### Prérequis

- Python 3.10+
- pip
- virtualenv (recommandé)

### Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/skills_match.git
   cd skills_match
   ```

2. Créer et activer un environnement virtuel :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur Windows : venv\Scripts\activate
   ```

3. Installer les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

4. Appliquer les migrations :
   ```bash
   cd SkillsMatchAI
   python manage.py migrate
   ```

5. Créer un superutilisateur :
   ```bash
   python manage.py createsuperuser
   ```

6. Lancer le serveur de développement :
   ```bash
   python manage.py runserver
   ```

7. Accéder à l'interface d'administration :
   - URL : http://localhost:8000/admin/
   - Utiliser les identifiants du superutilisateur créé à l'étape 5

### Points d'accès API

- **Documentation API** : http://localhost:8000/api/swagger/
- **Interface d'administration API** : http://localhost:8000/api-auth/
- **Obtenir un token JWT** : http://localhost:8000/api/token/
- **Rafraîchir un token JWT** : http://localhost:8000/api/token/refresh/

#### Endpoints principaux

- `/api/job-families/` - Familles de métiers
- `/api/skills/` - Compétences
- `/api/jobs/` - Emplois
- `/api/departments/` - Départements
- `/api/positions/` - Positions
- `/api/employees/` - Employés
- `/api/employee-skills/` - Compétences des employés
- `/api/position-skills/` - Compétences requises pour les positions

## Installation et configuration du frontend (React)

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

1. Créer l'application React :
   ```bash
   npx create-react-app frontend
   cd frontend
   ```

2. Installer les dépendances :
   ```bash
   npm install axios react-router-dom @mui/material @emotion/react @emotion/styled jwt-decode
   ```

3. Lancer le serveur de développement :
   ```bash
   npm start
   ```

4. Accéder à l'application :
   - URL : http://localhost:3000/

## Utilisation de l'API avec React

### Configuration d'Axios

Créez un fichier `src/services/api.js` :

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Création d'une instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### Exemple de service pour les employés

Créez un fichier `src/services/employeeService.js` :

```javascript
import api from './api';

export const getEmployees = (page = 1) => {
  return api.get(`employees/?page=${page}`);
};

export const getEmployee = (id) => {
  return api.get(`employees/${id}/`);
};

export const createEmployee = (employeeData) => {
  return api.post('employees/', employeeData);
};

export const updateEmployee = (id, employeeData) => {
  return api.put(`employees/${id}/`, employeeData);
};

export const deleteEmployee = (id) => {
  return api.delete(`employees/${id}/`);
};

export const getEmployeeSkills = (id) => {
  return api.get(`employees/${id}/skills/`);
};
```

### Exemple de composant React

Créez un fichier `src/components/EmployeeList.js` :

```jsx
import React, { useState, useEffect } from 'react';
import { getEmployees } from '../services/employeeService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees(page);
      setEmployees(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Liste des employés</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Département</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.last_name}</TableCell>
                    <TableCell>{employee.first_name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department_name}</TableCell>
                    <TableCell>
                      <Button component={Link} to={`/employees/${employee.id}`} variant="contained" color="primary" size="small">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="pagination">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Précédent
            </Button>
            <span>
              Page {page} sur {totalPages}
            </span>
            <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Suivant
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeList;
```

## Déploiement

### Backend (Django)

1. Configurer les paramètres de production dans `settings.py`
2. Collecter les fichiers statiques : `python manage.py collectstatic`
3. Configurer un serveur WSGI (Gunicorn) et un serveur web (Nginx)

### Frontend (React)

1. Construire l'application : `npm run build`
2. Déployer les fichiers statiques générés sur un serveur web

## Licence

Ce projet est sous licence MIT.