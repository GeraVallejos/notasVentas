Este archivo define la configuración de despliegue para la aplicación en la plataforma **Vercel**. Su función principal es controlar el comportamiento del enrutamiento cuando se accede a distintas rutas de la aplicación desde el navegador.

---

### Contenido del archivo

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

### Descripción técnica

* **rewrites**: Permite redirigir internamente las solicitudes entrantes sin modificar la URL visible para el usuario.

* **source: "/(.*)"**

  * Captura cualquier ruta solicitada en la aplicación.
  * Incluye rutas directas, rutas anidadas y recargas manuales del navegador.

* **destination: "/"**

  * Redirige todas las solicitudes al archivo raíz de la aplicación.
  * Generalmente corresponde al punto de entrada del frontend (por ejemplo, una aplicación React con React Router).

---

### Propósito dentro de la aplicación

Esta configuración es fundamental para aplicaciones **Single Page Application (SPA)** que utilizan enrutamiento del lado del cliente.

Permite que:

* Las rutas manejadas por **React Router** funcionen correctamente al refrescar la página.
* El acceso directo a URLs como `/login`, `/notas`, `/usuarios`, etc., no genere errores 404 en producción.
* Vercel siempre entregue el mismo punto de entrada para que el enrutador del frontend determine qué vista renderizar.

---

### Impacto en producción

* Evita errores de navegación al recargar la página.
* Garantiza compatibilidad total con rutas protegidas y públicas.
* Centraliza el control de rutas exclusivamente en el frontend.

---

### Consideraciones

* Este rewrite no afecta llamadas a APIs externas.
* En proyectos con backend separado, las rutas de API deben manejarse fuera de esta regla o mediante configuraciones adicionales.

---

### Resumen

El archivo `vercel.json` asegura que el enrutamiento de la aplicación funcione correctamente en producción, delegando el control de las rutas al frontend y evitando errores al acceder directamente a URLs internas.

---