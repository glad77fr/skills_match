from django.core.management.base import BaseCommand
from jobs.fixtures import create_sample_data

class Command(BaseCommand):
    help = 'Génère des données fictives pour l\'application jobs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--job-families',
            type=int,
            default=5,
            help='Nombre de familles de métiers à créer'
        )
        parser.add_argument(
            '--skills',
            type=int,
            default=30,
            help='Nombre de compétences à créer'
        )
        parser.add_argument(
            '--jobs',
            type=int,
            default=15,
            help='Nombre de jobs à créer'
        )
        parser.add_argument(
            '--departments',
            type=int,
            default=4,
            help='Nombre de départements à créer'
        )
        parser.add_argument(
            '--positions',
            type=int,
            default=25,
            help='Nombre de positions à créer'
        )
        parser.add_argument(
            '--employees',
            type=int,
            default=20,
            help='Nombre d\'employés à créer'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Début de la génération des données fictives...'))
        
        stats = create_sample_data(
            num_job_families=options['job_families'],
            num_skills=options['skills'],
            num_jobs=options['jobs'],
            num_departments=options['departments'],
            num_positions=options['positions'],
            num_employees=options['employees']
        )
        
        self.stdout.write(self.style.SUCCESS('\nGénération des données fictives terminée!'))
        self.stdout.write('\nStatistiques:')
        for key, value in stats.items():
            self.stdout.write(f'- {key}: {value}') 