"""
Script to create a test user with known credentials
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SkillsMatchAI.settings')
django.setup()

from django.contrib.auth.models import User

# Delete any existing users with these usernames
User.objects.filter(username__in=['testuser', 'admin']).delete()
print("Deleted existing users with names 'testuser' and 'admin'")

# Create superuser
admin = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123',
    first_name='Admin',
    last_name='User'
)
print(f"Created superuser 'admin' with ID {admin.id}")

# Create regular user
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='test123',
    first_name='Test',
    last_name='User'
)
user.is_staff = True
user.save()
print(f"Created regular user 'testuser' with ID {user.id}")

print("Test users created successfully.") 