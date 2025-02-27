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
    Représente une instance concrète d'un poste au sein de l'organisation.
    
    Contrairement à la classe Job qui définit un template, Position représente un poste
    réel qui peut être vacant ou occupé par un employé. Elle permet de suivre l'état
    et l'historique d'un poste spécifique dans l'organisation.
    
    Attributes:
        job (Job): Le profil type dont cette position est une instance
        location (str): L'emplacement géographique du poste
        status (str): État actuel du poste (vacant, occupé, en transition)
        start_date (date): Date de début du poste ou de sa vacance
        employee (Employee, optional): L'employé occupant actuellement le poste
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
    employee = models.ForeignKey(
        'employees.Employee',  # Utilisation d'une référence en chaîne pour éviter les dépendances circulaires
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='positions'
    )

    def __str__(self):
        status_display = f"({self.get_status_display()})"
        return f"{self.job.title} at {self.location} {status_display}"
