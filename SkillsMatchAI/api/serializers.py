from rest_framework import serializers
from jobs.models import (
    JobFamily, Skill, Job, Department, Position, 
    Employee, EmployeeSkill, PositionSkill
)
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle User."""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


class JobFamilySerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle JobFamily."""
    
    class Meta:
        model = JobFamily
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Skill."""
    
    class Meta:
        model = Skill
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Job."""
    job_family_name = serializers.ReadOnlyField(source='job_family.name')
    required_skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'


class JobDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détaillé pour le modèle Job."""
    job_family = JobFamilySerializer(read_only=True)
    required_skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Department."""
    
    class Meta:
        model = Department
        fields = '__all__'


class EmployeeListSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la liste des employés."""
    department_name = serializers.ReadOnlyField(source='department.name')
    
    class Meta:
        model = Employee
        fields = ('id', 'first_name', 'last_name', 'email', 'department', 'department_name', 'employment_status')


class EmployeeSkillSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle EmployeeSkill."""
    skill_name = serializers.ReadOnlyField(source='skill.name')
    skill_category = serializers.ReadOnlyField(source='skill.category')
    
    class Meta:
        model = EmployeeSkill
        fields = '__all__'


class EmployeeDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détaillé pour le modèle Employee."""
    department = DepartmentSerializer(read_only=True)
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


class PositionListSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la liste des positions."""
    job_title = serializers.ReadOnlyField(source='job.title')
    job_level = serializers.ReadOnlyField(source='job.level')
    employee_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Position
        fields = ('id', 'job', 'job_title', 'job_level', 'location', 'status', 'employee_name')
    
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


class PositionDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détaillé pour le modèle Position."""
    job = JobSerializer(read_only=True)
    employee = EmployeeListSerializer(read_only=True)
    required_skills = PositionSkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Position
        fields = '__all__' 