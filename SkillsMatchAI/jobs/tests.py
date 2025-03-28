from django.test import TestCase
from django.contrib.contenttypes.models import ContentType
from jobs.models import (
    JobFamily, Skill, Job, Position, Employee, 
    CustomField, CustomFieldValue
)
from datetime import date

class CustomFieldTestCase(TestCase):
    """Tests pour les champs personnalisés"""
    
    def setUp(self):
        # Créer des objets de base pour tester
        self.job_family = JobFamily.objects.create(
            name="Développement",
            description="Famille de métiers de développement informatique"
        )
        
        self.skill = Skill.objects.create(
            name="Python",
            description="Langage de programmation Python",
            category="Programmation"
        )
        
        self.job = Job.objects.create(
            title="Développeur Full Stack",
            description="Développeur complet frontend et backend",
            level="Senior",
            job_family=self.job_family
        )
        
        self.position = Position.objects.create(
            job=self.job,
            location="Paris",
            status="VACANT",
            start_date=date.today()
        )
        
        self.employee = Employee.objects.create(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            hire_date=date.today(),
            date_of_birth=date(1990, 1, 1),
            employment_status="ACTIVE"
        )
        
        # Créer des champs personnalisés pour les tests
        self.job_field = CustomField.objects.create(
            name="Experience requise",
            field_type="number",
            model_type="job",
            description="Années d'expérience requises pour le poste",
            required=True
        )
        
        self.position_field = CustomField.objects.create(
            name="Service",
            field_type="text",
            model_type="position",
            description="Service auquel est rattaché le poste",
            required=False
        )
        
        self.employee_field_text = CustomField.objects.create(
            name="Commentaire",
            field_type="text",
            model_type="employee",
            description="Commentaire sur l'employé",
            required=False
        )
        
        self.employee_field_date = CustomField.objects.create(
            name="Date d'évaluation",
            field_type="date",
            model_type="employee",
            description="Date de la dernière évaluation",
            required=False
        )
        
        self.employee_field_bool = CustomField.objects.create(
            name="Disponible pour mobilité",
            field_type="boolean",
            model_type="employee",
            description="L'employé est-il disponible pour une mobilité",
            required=False
        )
        
        self.employee_field_select = CustomField.objects.create(
            name="Niveau linguistique",
            field_type="select",
            model_type="employee",
            description="Niveau de langue étrangère",
            required=False,
            options="Débutant,Intermédiaire,Avancé,Bilingue"
        )
    
    def test_custom_field_creation(self):
        """Teste la création de champs personnalisés"""
        self.assertEqual(CustomField.objects.count(), 6)
        self.assertEqual(CustomField.objects.filter(model_type="employee").count(), 4)
    
    def test_set_and_get_custom_field_values(self):
        """Teste la définition et la récupération des valeurs de champs personnalisés"""
        # Pour un job
        self.job.set_custom_field_value("Experience requise", 5)
        self.assertEqual(self.job.get_custom_field_value("Experience requise"), 5.0)
        
        # Pour une position
        self.position.set_custom_field_value("Service", "Informatique")
        self.assertEqual(self.position.get_custom_field_value("Service"), "Informatique")
        
        # Pour un employé (tous les types)
        self.employee.set_custom_field_value("Commentaire", "Excellent travail")
        self.assertEqual(self.employee.get_custom_field_value("Commentaire"), "Excellent travail")
        
        self.employee.set_custom_field_value("Date d'évaluation", "2023-05-15")
        self.assertEqual(
            self.employee.get_custom_field_value("Date d'évaluation").strftime('%Y-%m-%d'), 
            "2023-05-15"
        )
        
        self.employee.set_custom_field_value("Disponible pour mobilité", True)
        self.assertTrue(self.employee.get_custom_field_value("Disponible pour mobilité"))
        
        self.employee.set_custom_field_value("Niveau linguistique", "Avancé")
        self.assertEqual(self.employee.get_custom_field_value("Niveau linguistique"), "Avancé")
    
    def test_nonexistent_custom_field(self):
        """Teste la gestion des champs inexistants"""
        self.assertIsNone(self.job.get_custom_field_value("Champ inexistant"))
        self.assertFalse(self.job.set_custom_field_value("Champ inexistant", "Valeur"))
    
    def test_custom_field_values_count(self):
        """Teste que les valeurs sont correctement sauvegardées"""
        self.assertEqual(CustomFieldValue.objects.count(), 0)
        
        self.job.set_custom_field_value("Experience requise", 5)
        self.position.set_custom_field_value("Service", "Informatique")
        self.employee.set_custom_field_value("Commentaire", "Excellent travail")
        
        self.assertEqual(CustomFieldValue.objects.count(), 3)
    
    def test_custom_field_update(self):
        """Teste la mise à jour des valeurs de champs personnalisés"""
        self.job.set_custom_field_value("Experience requise", 3)
        self.assertEqual(self.job.get_custom_field_value("Experience requise"), 3.0)
        
        # Mise à jour de la valeur
        self.job.set_custom_field_value("Experience requise", 5)
        self.assertEqual(self.job.get_custom_field_value("Experience requise"), 5.0)
        
        # Vérifier qu'une seule entrée existe
        cf = CustomField.objects.get(name="Experience requise")
        ct = ContentType.objects.get_for_model(self.job)
        self.assertEqual(
            CustomFieldValue.objects.filter(
                custom_field=cf, 
                content_type=ct, 
                object_id=self.job.id
            ).count(),
            1
        )
