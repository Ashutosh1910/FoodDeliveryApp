from django import forms
from .models import User_Profile

class ProfileForm(forms.ModelForm):

    class Meta:
        model=User_Profile
        fields=['hostel','room_no','user_branch']