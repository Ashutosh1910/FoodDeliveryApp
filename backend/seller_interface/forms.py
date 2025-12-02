from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Seller_Profile
class Seller_Register_Form(UserCreationForm):
    phone_no=forms.IntegerField(max_value=9999999999999999999)
    class Meta:
        model=User
        fields=['username','phone_no','first_name','last_name', 'password1','password2']
        