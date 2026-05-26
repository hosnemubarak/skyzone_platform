from rest_framework import serializers
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            'id', 'name', 'email', 'phone', 'company', 
            'inquiry_type', 'subject', 'product_name', 
            'message', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate(self, data):
        inquiry_type = data.get('inquiry_type', 'contact')
        
        # Product type validation
        if inquiry_type == 'product' and not data.get('product_name'):
            raise serializers.ValidationError({
                "product_name": "Product name is required for product inquiries."
            })
            
        return data
