from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes

from jobs.models import (
    JobFamily, Skill, Job, Position, 
    Employee, EmployeeSkill, PositionSkill, Evaluation
)
from .serializers import (
    JobFamilySerializer, SkillSerializer, JobSerializer, JobDetailSerializer,
    PositionListSerializer, PositionDetailSerializer,
    EmployeeListSerializer, EmployeeDetailSerializer, EmployeeSkillSerializer,
    PositionSkillSerializer, UserSerializer,
    EvaluationSerializer, EvaluationCreateUpdateSerializer
)
from django.contrib.auth.models import User


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint pour les utilisateurs."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Récupère les informations de l'utilisateur connecté."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class JobFamilyViewSet(viewsets.ModelViewSet):
    """API endpoint pour les familles de métiers."""
    queryset = JobFamily.objects.all()
    serializer_class = JobFamilySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']


class SkillViewSet(viewsets.ModelViewSet):
    """API endpoint pour les compétences."""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['name', 'category']
    ordering = ['name']


class JobViewSet(viewsets.ModelViewSet):
    """API endpoint pour les emplois."""
    queryset = Job.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['level', 'job_family']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'level']
    ordering = ['title']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobDetailSerializer
        return JobSerializer
    
    @action(detail=True, methods=['get'])
    def positions(self, request, pk=None):
        """Récupère toutes les positions pour un job spécifique."""
        job = self.get_object()
        positions = Position.objects.filter(job=job)
        serializer = PositionListSerializer(positions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def required_skills(self, request, pk=None):
        """Récupère toutes les compétences requises pour un job spécifique."""
        job = self.get_object()
        skills = job.required_skills.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)


class PositionViewSet(viewsets.ModelViewSet):
    """API endpoint pour les positions."""
    queryset = Position.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'location', 'job__job_family']
    search_fields = ['job__title', 'location']
    ordering_fields = ['start_date', 'job__title']
    ordering = ['-start_date']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PositionDetailSerializer
        return PositionListSerializer
    
    @action(detail=True, methods=['get'])
    def required_skills(self, request, pk=None):
        """Récupère toutes les compétences requises pour une position spécifique."""
        position = self.get_object()
        position_skills = PositionSkill.objects.filter(position=position)
        serializer = PositionSkillSerializer(position_skills, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_employee(self, request, pk=None):
        """Assigne un employé à une position."""
        position = self.get_object()
        employee_id = request.data.get('employee_id')
        
        if not employee_id:
            return Response({"error": "employee_id est requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            employee = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            return Response({"error": "Employé non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        position.employee = employee
        position.status = Position.Status.OCCUPIED
        position.save()
        
        # Mettre à jour la position actuelle de l'employé
        employee.current_position = position
        employee.save()
        
        serializer = PositionDetailSerializer(position)
        return Response(serializer.data)


class EmployeeViewSet(viewsets.ModelViewSet):
    """API endpoint pour les employés."""
    queryset = Employee.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['employment_status']
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['last_name', 'first_name', 'hire_date']
    ordering = ['last_name', 'first_name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EmployeeDetailSerializer
        return EmployeeListSerializer
    
    @action(detail=True, methods=['get'])
    def skills(self, request, pk=None):
        """Récupère toutes les compétences d'un employé spécifique."""
        employee = self.get_object()
        employee_skills = EmployeeSkill.objects.filter(employee=employee)
        serializer = EmployeeSkillSerializer(employee_skills, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_skill(self, request):
        """Filtre les employés par compétence."""
        skill_id = request.query_params.get('skill_id')
        if not skill_id:
            return Response({"error": "skill_id est requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        employees = Employee.objects.filter(skills__skill_id=skill_id).distinct()
        serializer = EmployeeListSerializer(employees, many=True)
        return Response(serializer.data)


class EmployeeSkillViewSet(viewsets.ModelViewSet):
    """API endpoint pour les compétences des employés."""
    queryset = EmployeeSkill.objects.all()
    serializer_class = EmployeeSkillSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['employee', 'skill', 'proficiency_level']
    ordering_fields = ['employee__last_name', 'skill__name', 'proficiency_level']
    ordering = ['employee__last_name', 'skill__name']


class PositionSkillViewSet(viewsets.ModelViewSet):
    """API endpoint pour les compétences requises pour les positions."""
    queryset = PositionSkill.objects.all()
    serializer_class = PositionSkillSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['position', 'skill', 'importance_level', 'is_required']
    ordering_fields = ['position__job__title', 'skill__name', 'importance_level']
    ordering = ['position__job__title', 'skill__name']


class EvaluationViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour gérer les évaluations de compétences.
    """
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['employee', 'skill', 'quantitative_level', 'evaluation_date']
    search_fields = ['employee__first_name', 'employee__last_name', 'skill__name', 'qualitative_description']
    ordering_fields = ['evaluation_date', 'quantitative_level']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EvaluationCreateUpdateSerializer
        return EvaluationSerializer
    
    @action(detail=False, methods=['get'])
    def by_employee(self, request):
        """
        Récupère toutes les évaluations pour un employé spécifique.
        """
        employee_id = request.query_params.get('employee_id')
        if not employee_id:
            return Response({"error": "employee_id parameter is required"}, status=400)
        
        evaluations = self.queryset.filter(employee_id=employee_id)
        serializer = self.get_serializer(evaluations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_skill(self, request):
        """
        Récupère toutes les évaluations pour une compétence spécifique.
        """
        skill_id = request.query_params.get('skill_id')
        if not skill_id:
            return Response({"error": "skill_id parameter is required"}, status=400)
        
        evaluations = self.queryset.filter(skill_id=skill_id)
        serializer = self.get_serializer(evaluations, many=True)
        return Response(serializer.data)
