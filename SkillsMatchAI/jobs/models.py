from django.db import models
from django.utils import timezone

class JobFamily(models.Model):
    """
    Représente une famille de métiers regroupant des emplois aux caractéristiques communes.
    
    Cette classe permet de catégoriser les emplois (Jobs) en groupes cohérents
    partageant des compétences, responsabilités ou domaines d'expertise similaires.
    
    Attributes:
        name (str): Le nom de la famille de métiers
        description (text): Description détaillée de la famille de métiers et de ses caractéristiques
    """
    name = models.CharField(max_length=100)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "Job families"

    def __str__(self):
        return self.name

class Skill(models.Model):
    """
    Représente une compétence pouvant être requise pour un emploi ou détenue par un employé.
    
    Cette classe sert de référentiel central pour toutes les compétences du système,
    permettant de standardiser leur définition et leur catégorisation.
    
    Attributes:
        name (str): Le nom de la compétence
        description (text): Description détaillée de la compétence
        category (str, optional): Catégorie de la compétence (technique, soft skill, etc.)
    """
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class Job(models.Model):
    """
    Définit le profil type d'un emploi avec ses exigences et compétences requises.
    
    Cette classe sert de template pour la création de positions concrètes dans l'organisation.
    Elle définit les caractéristiques standards d'un poste, indépendamment de son instance
    spécifique ou de son titulaire.
    
    Attributes:
        title (str): L'intitulé du poste
        description (text): Description détaillée du poste et de ses responsabilités
        level (str): Niveau du poste dans la hiérarchie
        job_family (JobFamily): La famille de métiers à laquelle appartient ce poste
        required_skills (ManyToManyField): Les compétences requises pour ce poste
    """
    title = models.CharField(max_length=100)
    description = models.TextField()
    level = models.CharField(max_length=50)
    job_family = models.ForeignKey(JobFamily, on_delete=models.PROTECT, related_name='jobs')
    required_skills = models.ManyToManyField(Skill, related_name='jobs')

    def __str__(self):
        return f"{self.title} - Level {self.level}"

class Position(models.Model):
    """
    Représente une instance concrète d'un poste au sein de l'organisation, dérivée d'un Job.
    
    Cette classe permet de gérer l'assignation d'un Employee à une position spécifique
    ainsi que le suivi de l'évolution du poste dans le temps.
    
    Attributes:
        job (Job): Le profil type dont cette position est une instance
        location (str): L'emplacement géographique du poste
        status (str): État actuel du poste (vacant, occupé, en transition)
        start_date (date): Date de prise de poste ou date de début de la vacance
        employee (Employee, optional): L'employé occupant actuellement le poste, si la position est occupée
    """
    class Status(models.TextChoices):
        VACANT = 'VACANT', 'Vacant' 
        OCCUPIED = 'OCCUPIED', 'Occupied'
        IN_TRANSITION = 'IN_TRANSITION', 'In Transition'

    job = models.ForeignKey(Job, on_delete=models.PROTECT, related_name='positions')
    location = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20, 
        choices=Status.choices,
        default=Status.VACANT
    )
    start_date = models.DateField(default=timezone.now)
    
    # La référence à Employee sera ajoutée après la définition de la classe Employee
    # pour éviter les références circulaires

    def __str__(self):
        status_display = f"({self.get_status_display()})"
        return f"{self.job.title} at {self.location} {status_display}"

class Employee(models.Model):
    """
    Représente un employé de l'organisation avec ses informations personnelles et professionnelles.
    
    Cette classe centralise toutes les informations relatives à un employé, y compris son statut,
    sa position actuelle, et ses informations de contact.
    
    Attributes:
        first_name (str): Prénom de l'employé
        last_name (str): Nom de famille de l'employé
        email (str): Adresse email professionnelle
        phone_number (str, optional): Numéro de téléphone (facultatif ou pour contact d'urgence)
        hire_date (date): Date d'embauche, permettant de suivre l'ancienneté
        date_of_birth (date): Date de naissance
        current_position (Position, optional): Référence à la position actuelle occupée
        employment_status (str): Statut de l'employé (actif, en congé, suspendu, etc.)
        profile_picture (str, optional): URL ou chemin d'accès à l'image de profil
        resume (str, optional): Lien vers le document du CV ou un résumé des compétences
        last_updated (datetime): Date de la dernière mise à jour des informations du profil
    """
    class EmploymentStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Actif'
        ON_LEAVE = 'ON_LEAVE', 'En congé'
        SUSPENDED = 'SUSPENDED', 'Suspendu'
        TERMINATED = 'TERMINATED', 'Terminé'
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    hire_date = models.DateField()
    date_of_birth = models.DateField()
    current_position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True, related_name='current_employees')
    employment_status = models.CharField(
        max_length=20,
        choices=EmploymentStatus.choices,
        default=EmploymentStatus.ACTIVE
    )
    profile_picture = models.URLField(blank=True, null=True)
    resume = models.URLField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

# Maintenant que Employee est défini, nous pouvons ajouter la référence à Employee dans Position
Position.employee = models.ForeignKey(
    Employee,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='positions'
)

class EmployeeSkill(models.Model):
    """
    Représente l'association entre un employé et une compétence qu'il possède.
    
    Cette classe permet de suivre le niveau de maîtrise d'une compétence par un employé,
    ainsi que la date d'acquisition et les mises à jour.
    
    Attributes:
        employee (Employee): L'employé possédant la compétence
        skill (Skill): La compétence possédée
        proficiency_level (int): Niveau de maîtrise (1-5)
        date_acquired (date): Date d'acquisition de la compétence
        last_updated (datetime): Date de dernière mise à jour du niveau de compétence
    """
    PROFICIENCY_CHOICES = [
        (1, 'Débutant'),
        (2, 'Intermédiaire débutant'),
        (3, 'Intermédiaire'),
        (4, 'Intermédiaire avancé'),
        (5, 'Expert')
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='employees')
    proficiency_level = models.IntegerField(choices=PROFICIENCY_CHOICES)
    date_acquired = models.DateField()
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('employee', 'skill')
        verbose_name = "Employee Skill"
        verbose_name_plural = "Employee Skills"
    
    def __str__(self):
        return f"{self.employee} - {self.skill} (Niveau: {self.get_proficiency_level_display()})"

class PositionSkill(models.Model):
    """
    Représente les compétences requises pour une position spécifique et leur niveau d'importance.
    
    Contrairement aux compétences génériques associées à un Job, cette classe permet de définir
    les exigences spécifiques pour une Position particulière, qui peuvent varier selon le contexte.
    
    Attributes:
        position (Position): La position concernée
        skill (Skill): La compétence requise
        importance_level (int): Niveau d'importance de la compétence pour cette position (1-5)
        is_required (bool): Indique si la compétence est obligatoire ou optionnelle
        description (text): Description spécifique de l'application de cette compétence pour cette position
    """
    IMPORTANCE_CHOICES = [
        (1, 'Faible'),
        (2, 'Modérée'),
        (3, 'Importante'),
        (4, 'Très importante'),
        (5, 'Critique')
    ]
    
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='required_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='positions')
    importance_level = models.IntegerField(choices=IMPORTANCE_CHOICES)
    is_required = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ('position', 'skill')
        verbose_name = "Position Skill"
        verbose_name_plural = "Position Skills"
    
    def __str__(self):
        importance = self.get_importance_level_display()
        required = "Obligatoire" if self.is_required else "Optionnelle"
        return f"{self.position} - {self.skill} (Importance: {importance}, {required})"
