from django.db import models

class Inquiry(models.Model):
    INQUIRY_TYPES = [
        ('contact', 'Contact Form'),
        ('product', 'Product Inquiry'),
        ('b2b', 'Dealer/B2B Channel'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('closed', 'Closed'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    company = models.CharField(max_length=255, blank=True, default='')
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES, default='contact')
    subject = models.CharField(max_length=255, blank=True, default='')
    product_name = models.CharField(max_length=255, blank=True, default='')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Inquiry"
        verbose_name_plural = "Inquiries"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_inquiry_type_display()} from {self.name} ({self.status})"
