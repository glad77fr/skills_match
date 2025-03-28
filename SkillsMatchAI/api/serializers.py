from rest_framework import serializers
from jobs.models import (
    JobFamily, Skill, Job, Position, 
    Employee, EmployeeSkill, PositionSkill
)
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle User."""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


class CustomFieldMixin:
    """Mixin pour ajouter les champs personnalisés fixes à n'importe quel sérialiseur."""
    
    def get_custom_fields(self, obj):
        """Récupère les champs personnalisés visibles et leurs valeurs."""
        custom_fields = []
        try:
            for i in range(1, 5):
                # Vérifier si les attributs existent
                if hasattr(obj, f'custom_field{i}') and hasattr(obj, f'custom_field{i}_label') and hasattr(obj, f'custom_field{i}_visible'):
                    field_value = getattr(obj, f'custom_field{i}')
                    field_label = getattr(obj, f'custom_field{i}_label')
                    field_visible = getattr(obj, f'custom_field{i}_visible')
                    
                    if field_visible and field_value:
                        custom_fields.append({
                            'label': field_label,
                            'value': field_value
                        })
            return custom_fields
        except Exception as e:
            print(f"Erreur lors de la récupération des champs personnalisés: {e}")
            return []
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            representation['custom_fields'] = self.get_custom_fields(instance)
        except Exception as e:
            print(f"Erreur lors de l'ajout des champs personnalisés à la représentation: {e}")
            representation['custom_fields'] = []
        return representation


class JobFamilySerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle JobFamily."""
    
    class Meta:
        model = JobFamily
        fields = '__all__'


class SkillSerializer(CustomFieldMixin, serializers.ModelSerializer):
    """Sérialiseur pour le modèle Skill."""
    
    class Meta:
        model = Skill
        fields = '__all__'


class JobSerializer(CustomFieldMixin, serializers.ModelSerializer):
    """Sérialiseur pour le modèle Job."""
    job_family_name = serializers.ReadOnlyField(source='job_family.name')
    required_skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'


class JobDetailSerializer(CustomFieldMixin, serializers.ModelSerializer):
    """Sérialiseur détaillé pour le modèle Job."""
    job_family = JobFamilySerializer(read_only=True)
    required_skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'


class EmployeeListSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la liste des employés."""
    
    class Meta:
        model = Employee
        fields = ('id', 'first_name', 'last_name', 'email', 'employment_status')


class EmployeeSkillSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle EmployeeSkill."""
    skill_name = serializers.ReadOnlyField(source='skill.name')
    skill_category = serializers.ReadOnlyField(source='skill.category')
    
    class Meta:
        model = EmployeeSkill
        fields = '__all__'


class EmployeeDetailSerializer(CustomFieldMixin, serializers.ModelSerializer):
    """Sérialiseur détaillé pour le modèle Employee."""
    skills = EmployeeSkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Employee
        fields = '__all__'


class PositionSkillSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle PositionSkill."""
    skill_name = serializers.ReadOnlyField(source='skill.name')
    skill_category = serializers.ReadOnlyField(source='skill.category')
    
    class Meta:
        model = PositionSkill
        fields = '__all__'


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
    
    def get_employee_name(self, obj):
        try:
            if hasattr(obj, 'employee') and obj.employee is not None:
                # Vérifier si employee est un objet complet ou juste un ID
                if hasattr(obj.employee, 'first_name') and hasattr(obj.employee, 'last_name'):
                    return f"{obj.employee.first_name} {obj.employee.last_name}"
                # Si c'est un ID ou un objet incomplet, essayer de récupérer l'objet complet
                from jobs.models import Employee
                try:
                    employee_id = obj.employee.pk if hasattr(obj.employee, 'pk') else obj.employee
                    employee = Employee.objects.get(id=employee_id)
                    return f"{employee.first_name} {employee.last_name}"
                except Exception as e:
                    print(f"Error getting employee object: {e}")
                    return "Unknown Employee"
            return None
        except Exception as e:
            print(f"Error getting employee name: {e}")
            return "Unknown Employee"


class PositionDetailSerializer(CustomFieldMixin, serializers.ModelSerializer):
    """Sérialiseur détaillé pour le modèle Position."""
    job = JobSerializer(read_only=True)
    employee = EmployeeListSerializer(read_only=True)
    required_skills = PositionSkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Position
        fields = '__all__'


class EmployeeSerializer(CustomFieldMixin, serializers.ModelSerializer):
    """Sérialiseur pour le modèle Employee."""
    
    class Meta:
        model = Employee
        fields = '__all__' 