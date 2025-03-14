import random
from datetime import datetime, timedelta
from django.utils import timezone
from faker import Faker
from .models import (
    JobFamily, Skill, Job, Department, Position, 
    Employee, EmployeeSkill, PositionSkill
)

fake = Faker(['fr_FR'])

def create_sample_data(num_job_families=5, num_skills=30, num_jobs=15, 
                      num_departments=4, num_positions=25, num_employees=20):
    """
    Crée un jeu de données fictives pour tous les modèles de l'application jobs.
    
    Args:
        num_job_families (int): Nombre de familles de métiers à créer
        num_skills (int): Nombre de compétences à créer
        num_jobs (int): Nombre de jobs à créer
        num_departments (int): Nombre de départements à créer
        num_positions (int): Nombre de positions à créer
        num_employees (int): Nombre d'employés à créer
        
    Returns:
        dict: Statistiques sur les données créées
    """
    # Nettoyer les données existantes
    EmployeeSkill.objects.all().delete()
    PositionSkill.objects.all().delete()
    Employee.objects.all().delete()
    Position.objects.all().delete()
    Department.objects.all().delete()
    Job.objects.all().delete()
    Skill.objects.all().delete()
    JobFamily.objects.all().delete()
    
    print("Création des données fictives...")
    
    # 1. Création des familles de métiers
    job_families = []
    job_family_names = [
        "Développement informatique", 
        "Marketing digital", 
        "Ressources humaines", 
        "Finance et comptabilité", 
        "Ventes", 
        "Support client", 
        "Design et UX", 
        "Gestion de projet"
    ]
    
    for i in range(min(num_job_families, len(job_family_names))):
        job_family = JobFamily.objects.create(
            name=job_family_names[i],
            description=fake.paragraph(nb_sentences=3)
        )
        job_families.append(job_family)
    
    print(f"✓ {len(job_families)} familles de métiers créées")
    
    # 2. Création des compétences
    skills = []
    skill_categories = ["Technique", "Soft skill", "Langue", "Management"]
    skill_names = [
        # Compétences techniques
        "Python", "JavaScript", "React", "Django", "SQL", "AWS", "Docker", 
        "Machine Learning", "Data Analysis", "UX Design", "UI Design", 
        "SEO", "SEM", "Content Marketing", "Social Media Marketing",
        # Soft skills
        "Communication", "Travail d'équipe", "Résolution de problèmes", 
        "Adaptabilité", "Leadership", "Gestion du temps", "Créativité",
        # Langues
        "Anglais", "Français", "Espagnol", "Allemand", "Chinois",
        # Management
        "Gestion d'équipe", "Gestion de projet", "Recrutement", "Budgétisation"
    ]
    
    for i in range(min(num_skills, len(skill_names))):
        category = random.choice(skill_categories)
        skill = Skill.objects.create(
            name=skill_names[i],
            description=fake.paragraph(nb_sentences=2),
            category=category
        )
        skills.append(skill)
    
    print(f"✓ {len(skills)} compétences créées")
    
    # 3. Création des jobs
    jobs = []
    job_levels = ["Junior", "Intermédiaire", "Senior", "Lead", "Manager"]
    job_titles = [
        "Développeur Full Stack", "Développeur Frontend", "Développeur Backend",
        "Data Scientist", "DevOps Engineer", "UX Designer", "UI Designer",
        "Chef de projet digital", "Responsable marketing", "Spécialiste SEO",
        "Responsable RH", "Comptable", "Analyste financier", "Commercial",
        "Support client", "Responsable produit", "Responsable communication"
    ]
    
    for i in range(min(num_jobs, len(job_titles))):
        job_family = random.choice(job_families)
        level = random.choice(job_levels)
        
        job = Job.objects.create(
            title=job_titles[i],
            description=fake.paragraph(nb_sentences=4),
            level=level,
            job_family=job_family
        )
        
        # Ajouter des compétences requises pour ce job
        num_required_skills = random.randint(3, 8)
        job_skills = random.sample(skills, num_required_skills)
        job.required_skills.set(job_skills)
        
        jobs.append(job)
    
    print(f"✓ {len(jobs)} jobs créés")
    
    # 4. Création des départements
    departments = []
    department_names = [
        "Technologie", "Marketing", "Ressources Humaines", 
        "Finance", "Ventes", "Opérations", "Produit"
    ]
    
    for i in range(min(num_departments, len(department_names))):
        department = Department.objects.create(
            name=department_names[i],
            description=fake.paragraph(nb_sentences=2)
        )
        departments.append(department)
    
    print(f"✓ {len(departments)} départements créés")
    
    # 5. Création des positions
    positions = []
    locations = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nantes", "Strasbourg"]
    
    for i in range(num_positions):
        job = random.choice(jobs)
        location = random.choice(locations)
        status = random.choice([s[0] for s in Position.Status.choices])
        
        start_date = fake.date_between(start_date='-3y', end_date='today')
        
        position = Position.objects.create(
            job=job,
            location=location,
            status=status,
            start_date=start_date
        )
        
        # Ajouter des compétences requises pour cette position
        num_position_skills = random.randint(2, 6)
        position_skills = random.sample(list(job.required_skills.all()), 
                                        min(num_position_skills, job.required_skills.count()))
        
        for skill in position_skills:
            importance_level = random.randint(1, 5)
            is_required = random.choice([True, True, True, False])  # 75% de chance d'être requis
            
            PositionSkill.objects.create(
                position=position,
                skill=skill,
                importance_level=importance_level,
                is_required=is_required,
                description=fake.paragraph(nb_sentences=1) if random.random() > 0.5 else None
            )
        
        positions.append(position)
    
    print(f"✓ {len(positions)} positions créées")
    
    # 6. Création des employés
    employees = []
    
    for i in range(num_employees):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"{first_name.lower()}.{last_name.lower()}@example.com"
        
        hire_date = fake.date_between(start_date='-5y', end_date='today')
        date_of_birth = fake.date_of_birth(minimum_age=22, maximum_age=60)
        
        department = random.choice(departments)
        employment_status = random.choice([s[0] for s in Employee.EmploymentStatus.choices])
        
        # 80% des employés ont une position
        has_position = random.random() < 0.8
        
        employee = Employee.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=fake.phone_number(),
            hire_date=hire_date,
            date_of_birth=date_of_birth,
            department=department,
            employment_status=employment_status,
            profile_picture=f"https://randomuser.me/api/portraits/{'men' if random.random() > 0.5 else 'women'}/{i % 100}.jpg" if random.random() > 0.3 else None,
            resume=f"https://example.com/resumes/{first_name.lower()}_{last_name.lower()}.pdf" if random.random() > 0.7 else None
        )
        
        # Assigner une position à l'employé si nécessaire
        if has_position:
            # Filtrer les positions vacantes
            vacant_positions = [p for p in positions if p.status == Position.Status.VACANT]
            
            if vacant_positions:
                position = random.choice(vacant_positions)
                position.status = Position.Status.OCCUPIED
                position.employee = employee
                position.save()
                
                employee.current_position = position
                employee.save()
        
        employees.append(employee)
    
    print(f"✓ {len(employees)} employés créés")
    
    # 7. Création des compétences des employés
    employee_skills_count = 0
    
    for employee in employees:
        # Déterminer le nombre de compétences pour cet employé
        num_employee_skills = random.randint(3, 10)
        
        # Sélectionner des compétences aléatoires
        employee_skills = random.sample(skills, num_employee_skills)
        
        for skill in employee_skills:
            proficiency_level = random.randint(1, 5)
            
            # Date d'acquisition entre la date d'embauche et aujourd'hui
            date_acquired = fake.date_between(start_date=employee.hire_date, end_date='today')
            
            EmployeeSkill.objects.create(
                employee=employee,
                skill=skill,
                proficiency_level=proficiency_level,
                date_acquired=date_acquired
            )
            
            employee_skills_count += 1
    
    print(f"✓ {employee_skills_count} compétences d'employés créées")
    
    # Retourner des statistiques sur les données créées
    return {
        "job_families": len(job_families),
        "skills": len(skills),
        "jobs": len(jobs),
        "departments": len(departments),
        "positions": len(positions),
        "employees": len(employees),
        "employee_skills": employee_skills_count,
        "position_skills": PositionSkill.objects.count()
    }

def run_fixtures():
    """
    Fonction principale pour exécuter la création des données fictives.
    Cette fonction peut être appelée depuis un script de management Django.
    """
    start_time = datetime.now()
    stats = create_sample_data()
    end_time = datetime.now()
    
    print("\nCréation des données fictives terminée!")
    print(f"Temps d'exécution: {end_time - start_time}")
    print("\nStatistiques:")
    for key, value in stats.items():
        print(f"- {key}: {value}")
    
    return stats

if __name__ == "__main__":
    # Ce bloc s'exécute si le fichier est lancé directement
    print("Génération des données fictives pour l'application jobs...")
    run_fixtures() 