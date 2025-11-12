from django import forms
from .models import Usuarios
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

# No se hashea la contraseña al crear un usuario por admin, asi que es necesario crear un form

class UsuarioAdminForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={
            'autocomplete': 'new-password',  
            'placeholder': 'Introduce la contraseña'  
        }), required=False, label='Contraseña')

    class Meta:
        model = Usuarios
        fields = '__all__'

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password')

        if password:
            try:
                validate_password(password, user)
            except ValidationError as e:
                self.add_error('password', e)
                return user  

            user.set_password(password)

        if commit:
            user.save()
        return user
