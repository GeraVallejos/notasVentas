# Archivo `forms.py`

### Formulario: `UsuarioAdminForm`

Define un formulario personalizado para la administración del modelo `Usuarios` en Django. Este formulario soluciona el problema de que las contraseñas no se hashean automáticamente cuando se crea un usuario desde el panel de administración.


### Propósito

Permite que la contraseña ingresada para un nuevo usuario en el admin de Django sea correctamente hasheada antes de ser guardada en la base de datos.

---

### Detalle del código

```python
class UsuarioAdminForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, required=False, label='Contraseña')

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
```

---

### Componentes

- **Herencia**: Extiende `forms.ModelForm`, lo que permite vincularlo directamente al modelo `Usuarios`.
- **Campo personalizado**:
  - `password`: Se define explícitamente como un campo `CharField` con `PasswordInput` para ocultar el texto ingresado. Es opcional (`required=False`) para permitir la edición sin requerir cambio de contraseña.
- **Clase Meta**:
  - Modelo asociado: `Usuarios`.
  - Campos: todos los campos del modelo (`'__all__'`).
- **Método `save()`**:
  - Se sobreescribe para interceptar el guardado del modelo.
  - Si se provee una contraseña, se hashea utilizando el método `set_password()`.
  - El objeto se guarda manualmente solo si `commit=True`.

  ---