# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0004_alter_customfield_model_type'),
    ]

    operations = [
        # Ajouter les champs personnalisés fixes à Job
        migrations.AddField(
            model_name='job',
            name='custom_field1',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field1_label',
            field=models.CharField(default='Champ personnalisé 1', max_length=100),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field1_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field2',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field2_label',
            field=models.CharField(default='Champ personnalisé 2', max_length=100),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field2_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field3',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field3_label',
            field=models.CharField(default='Champ personnalisé 3', max_length=100),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field3_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field4',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field4_label',
            field=models.CharField(default='Champ personnalisé 4', max_length=100),
        ),
        migrations.AddField(
            model_name='job',
            name='custom_field4_visible',
            field=models.BooleanField(default=False),
        ),
        
        # Ajouter les champs personnalisés fixes à Skill
        migrations.AddField(
            model_name='skill',
            name='custom_field1',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field1_label',
            field=models.CharField(default='Champ personnalisé 1', max_length=100),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field1_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field2',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field2_label',
            field=models.CharField(default='Champ personnalisé 2', max_length=100),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field2_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field3',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field3_label',
            field=models.CharField(default='Champ personnalisé 3', max_length=100),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field3_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field4',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field4_label',
            field=models.CharField(default='Champ personnalisé 4', max_length=100),
        ),
        migrations.AddField(
            model_name='skill',
            name='custom_field4_visible',
            field=models.BooleanField(default=False),
        ),
        
        # Ajouter les champs personnalisés fixes à Position
        migrations.AddField(
            model_name='position',
            name='custom_field1',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field1_label',
            field=models.CharField(default='Champ personnalisé 1', max_length=100),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field1_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field2',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field2_label',
            field=models.CharField(default='Champ personnalisé 2', max_length=100),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field2_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field3',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field3_label',
            field=models.CharField(default='Champ personnalisé 3', max_length=100),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field3_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field4',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field4_label',
            field=models.CharField(default='Champ personnalisé 4', max_length=100),
        ),
        migrations.AddField(
            model_name='position',
            name='custom_field4_visible',
            field=models.BooleanField(default=False),
        ),
        
        # Ajouter les champs personnalisés fixes à Employee
        migrations.AddField(
            model_name='employee',
            name='custom_field1',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field1_label',
            field=models.CharField(default='Champ personnalisé 1', max_length=100),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field1_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field2',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field2_label',
            field=models.CharField(default='Champ personnalisé 2', max_length=100),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field2_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field3',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field3_label',
            field=models.CharField(default='Champ personnalisé 3', max_length=100),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field3_visible',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field4',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field4_label',
            field=models.CharField(default='Champ personnalisé 4', max_length=100),
        ),
        migrations.AddField(
            model_name='employee',
            name='custom_field4_visible',
            field=models.BooleanField(default=False),
        ),
    ] 