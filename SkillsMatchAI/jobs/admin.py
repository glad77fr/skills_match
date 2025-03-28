from django.contrib import admin
from .models import (
    JobFamily, 
    Skill, 
    Job, 
    Position, 
    Employee, 
    EmployeeSkill,
    PositionSkill,
    Evaluation
)

@admin.register(JobFamily)
class JobFamilyAdmin(admin.ModelAdmin):
    """Interface d'administration pour le modèle JobFamily."""
    list_display = ('name', 'description')
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """Interface d'administration pour le modèle Skill."""
    list_display = ('name', 'category', 'description')
    list_filter = ('category',)
    search_fields = ('name', 'description', 'category')
    ordering = ('name',)
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'category')
        }),
        ('Champs personnalisés', {
            'fields': (
                ('custom_field1', 'custom_field1_label', 'custom_field1_visible'),
                ('custom_field2', 'custom_field2_label', 'custom_field2_visible'),
                ('custom_field3', 'custom_field3_label', 'custom_field3_visible'),
                ('custom_field4', 'custom_field4_label', 'custom_field4_visible'),
            ),
            'classes': ('collapse',)
        }),
    )

class JobSkillInline(admin.TabularInline):
    """Affichage en ligne des compétences requises pour un Job."""
    model = Job.required_skills.through
    extra = 1
    verbose_name = "Compétence requise"
    verbose_name_plural = "Compétences requises"

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    """Interface d'administration pour le modèle Job."""
    list_display = ('title', 'level', 'job_family')
    search_fields = ('title', 'description')
    list_filter = ('level', 'job_family')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'level', 'job_family', 'required_skills')
        }),
        ('Champs personnalisés', {
            'fields': (
                ('custom_field1', 'custom_field1_label', 'custom_field1_visible'),
                ('custom_field2', 'custom_field2_label', 'custom_field2_visible'),
                ('custom_field3', 'custom_field3_label', 'custom_field3_visible'),
                ('custom_field4', 'custom_field4_label', 'custom_field4_visible'),
            ),
            'classes': ('collapse',)
        }),
    )

class PositionSkillInline(admin.TabularInline):
    """Affichage en ligne des compétences requises pour une Position."""
    model = PositionSkill
    extra = 1
    verbose_name = "Compétence requise"
    verbose_name_plural = "Compétences requises"

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    """Interface d'administration pour le modèle Position."""
    list_display = ('job', 'location', 'status', 'start_date', 'get_employee')
    list_filter = ('status', 'location', 'job__job_family')
    search_fields = ('job__title', 'location')
    inlines = [PositionSkillInline]
    date_hierarchy = 'start_date'
    ordering = ('-start_date',)
    
    fieldsets = (
        (None, {
            'fields': ('job', 'location', 'status', 'start_date', 'employee')
        }),
        ('Champs personnalisés', {
            'fields': (
                ('custom_field1', 'custom_field1_label', 'custom_field1_visible'),
                ('custom_field2', 'custom_field2_label', 'custom_field2_visible'),
                ('custom_field3', 'custom_field3_label', 'custom_field3_visible'),
                ('custom_field4', 'custom_field4_label', 'custom_field4_visible'),
            ),
            'classes': ('collapse',)
        }),
    )
    
    def get_employee(self, obj):
        """Retourne le nom de l'employé ou 'Non assigné' si aucun employé n'est assigné."""
        return obj.employee if obj.employee else "Non assigné"
    get_employee.short_description = "Employé"

class EmployeeSkillInline(admin.TabularInline):
    """Affichage en ligne des compétences d'un employé."""
    model = EmployeeSkill
    extra = 1
    verbose_name = "Compétence"
    verbose_name_plural = "Compétences"

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    """Interface d'administration pour le modèle Employee."""
    list_display = ('last_name', 'first_name', 'email', 'employment_status', 'hire_date')
    list_filter = ('employment_status', 'hire_date')
    search_fields = ('last_name', 'first_name', 'email')
    inlines = [EmployeeSkillInline]
    date_hierarchy = 'hire_date'
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'date_of_birth', 'email', 'phone_number')
        }),
        ('Informations professionnelles', {
            'fields': ('hire_date', 'current_position', 'employment_status')
        }),
        ('Documents et médias', {
            'fields': ('profile_picture', 'resume'),
            'classes': ('collapse',)
        }),
        ('Champs personnalisés', {
            'fields': (
                ('custom_field1', 'custom_field1_label', 'custom_field1_visible'),
                ('custom_field2', 'custom_field2_label', 'custom_field2_visible'),
                ('custom_field3', 'custom_field3_label', 'custom_field3_visible'),
                ('custom_field4', 'custom_field4_label', 'custom_field4_visible'),
            ),
            'classes': ('collapse',)
        }),
    )
    ordering = ('last_name', 'first_name')

@admin.register(EmployeeSkill)
class EmployeeSkillAdmin(admin.ModelAdmin):
    """Interface d'administration pour le modèle EmployeeSkill."""
    list_display = ('employee', 'skill', 'proficiency_level', 'date_acquired', 'last_updated')
    list_filter = ('proficiency_level', 'skill', 'date_acquired')
    search_fields = ('employee__first_name', 'employee__last_name', 'skill__name')
    date_hierarchy = 'date_acquired'
    ordering = ('employee__last_name', 'skill__name')

@admin.register(PositionSkill)
class PositionSkillAdmin(admin.ModelAdmin):
    """Interface d'administration pour le modèle PositionSkill."""
    list_display = ('position', 'skill', 'importance_level', 'is_required')
    list_filter = ('importance_level', 'is_required', 'skill')
    search_fields = ('position__job__title', 'skill__name', 'description')
    ordering = ('position__job__title', 'skill__name')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('employee', 'skill', 'quantitative_level', 'qualitative_level', 'evaluation_date')
    list_filter = ('quantitative_level', 'evaluation_date')
    search_fields = ('employee__first_name', 'employee__last_name', 'skill__name')
    autocomplete_fields = ('employee', 'skill', 'evaluated_by')
