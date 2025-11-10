from django import forms
from .models import Usuarios

# No se hashea la contraseña al crear un usuario por admin, asi que es necesario crear un form

class UsuarioAdminForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={
            'autocomplete': 'new-password',  # Esto ayuda a prevenir el autocompletado
            'placeholder': 'Introduce la contraseña'  # Mejora la UX
        }), required=False, label='Contraseña')

    class Meta:
        model = Usuarios
        fields = '__all__'

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password')
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user
