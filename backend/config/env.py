import os
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

def get_env_bool(name: str, default: bool = False) -> bool:
    """Read an environment variable and cast it to a boolean."""
    value = os.getenv(name)
    if value is None:
        return default
    return value.lower() in ('true', '1', 't', 'yes', 'y')

def get_env_int(name: str, default: int = 0) -> int:
    """Read an environment variable and cast it to an integer."""
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default

def get_env_list(name: str, default: list = None) -> list:
    """Read a comma-separated environment variable and parse it into a list of strings."""
    value = os.getenv(name)
    if value is None:
        return default or []
    return [item.strip() for item in value.split(',') if item.strip()]

# Core settings
DEBUG = get_env_bool('DEBUG', default=False)

SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    if not DEBUG:
        raise ImproperlyConfigured("SECRET_KEY environment variable is required in production!")
    # Insecure key used purely for local development fallback
    SECRET_KEY = 'django-insecure-change-this-in-production-abc123xyz'

ALLOWED_HOSTS = get_env_list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])
CORS_ALLOWED_ORIGINS = get_env_list(
    'CORS_ALLOWED_ORIGINS', 
    default=['http://localhost:3000', 'https://skyzoneintl.com', 'https://www.skyzoneintl.com']
)
CSRF_TRUSTED_ORIGINS = get_env_list(
    'CSRF_TRUSTED_ORIGINS', 
    default=['https://api.skyzoneintl.com', 'https://skyzoneintl.com', 'https://www.skyzoneintl.com']
)

# Database Configurations
DATABASE_URL = os.getenv('DATABASE_URL')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST', 'db')
DB_PORT = os.getenv('DB_PORT', '5432')

# Google reCAPTCHA configurations
RECAPTCHA_ENABLED = get_env_bool('RECAPTCHA_ENABLED', default=False)
RECAPTCHA_SITE_KEY = os.getenv('RECAPTCHA_SITE_KEY', '')
RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY', '')

# Django Axes brute force configurations
AXES_ENABLED = get_env_bool('AXES_ENABLED', default=True)
AXES_FAILURE_LIMIT = get_env_int('AXES_FAILURE_LIMIT', 5)
AXES_COOLOFF_TIME_HOURS = get_env_int('AXES_COOLOFF_TIME_HOURS', 1)
AXES_RESET_ON_SUCCESS = get_env_bool('AXES_RESET_ON_SUCCESS', default=True)
