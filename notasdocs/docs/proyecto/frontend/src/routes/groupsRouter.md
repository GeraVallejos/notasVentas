# <font color=#ff5733>Arquitectura de Rutas – GroupRouter</font>

## Protección por Grupos – `GroupsRouter`

### Propósito

`GroupsRouter` implementa **autorización por roles**.

A diferencia de los loaders:

* No valida sesión
* Valida permisos funcionales

---

### Código

```js
const GroupsRouter = ({ children, group }) => {
  const grupo = useSelector(
    (state) => state.auth.user?.groups || []
  );

  const acceso = grupo.some((g) => g.includes(group));

  return acceso ? children : <HomePage />;
};
```

---

### Lógica interna

1. Se obtiene el usuario desde Redux.
2. Se extrae el arreglo de grupos.
3. Se valida si alguno contiene el grupo requerido.
4. Si tiene acceso → renderiza el contenido.
5. Si no → redirige silenciosamente a Home.

---

### Justificación de diseño

* Evita duplicar lógica de permisos.
* Permite reutilización por ruta.
* Mantiene componentes desacoplados.

---