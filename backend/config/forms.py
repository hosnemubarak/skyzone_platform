from django.contrib.admin.forms import AdminAuthenticationForm
from django.conf import settings
from django_recaptcha.fields import ReCaptchaField
from django_recaptcha.widgets import ReCaptchaV3

class AdminLoginForm(AdminAuthenticationForm):
    """
    Custom admin login form that dynamically adds Google reCAPTCHA v3 protection
    if RECAPTCHA_ENABLED is set to True in the application settings.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if getattr(settings, 'RECAPTCHA_ENABLED', False):
            # Match existing reCAPTCHA v3 keys and secure scoring threshold (0.5)
            self.fields['captcha'] = ReCaptchaField(
                widget=ReCaptchaV3(
                    attrs={
                        'required_score': 0.5,
                    }
                ),
                error_messages={
                    'captcha_invalid': 'reCAPTCHA verification failed. Please try again.'
                }
            )
