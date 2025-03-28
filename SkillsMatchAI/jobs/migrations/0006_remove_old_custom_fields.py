# Generated manually

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0005_add_custom_fields'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CustomFieldValue',
        ),
        migrations.DeleteModel(
            name='CustomField',
        ),
    ] 