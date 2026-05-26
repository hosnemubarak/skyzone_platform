from django.contrib import admin
from .models import Inquiry

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'inquiry_type', 'status', 'created_at')
    list_filter = ('inquiry_type', 'status', 'created_at')
    search_fields = ('name', 'email', 'company', 'product_name')
    actions = ['mark_as_contacted', 'mark_as_closed']
    
    def mark_as_contacted(self, request, queryset):
        queryset.update(status='contacted')
    mark_as_contacted.short_description = "Mark selected inquiries as Contacted"
    
    def mark_as_closed(self, request, queryset):
        queryset.update(status='closed')
    mark_as_closed.short_description = "Mark selected inquiries as Closed"
