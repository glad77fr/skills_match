from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

from .views import (
    UserViewSet, JobFamilyViewSet, SkillViewSet, JobViewSet,
    DepartmentViewSet, PositionViewSet, EmployeeViewSet,
    EmployeeSkillViewSet, PositionSkillViewSet
)

# Configuration de Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="SkillsMatchAI API",
        default_version='v1',
        description="API pour la gestion des compétences et des emplois",
        terms_of_service="https://www.skillsmatchai.com/terms/",
        contact=openapi.Contact(email="contact@skillsmatchai.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# Configuration du routeur
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'job-families', JobFamilyViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'positions', PositionViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'employee-skills', EmployeeSkillViewSet)
router.register(r'position-skills', PositionSkillViewSet)

urlpatterns = [
    # API routes
    path('', include(router.urls)),
    
    # Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] 