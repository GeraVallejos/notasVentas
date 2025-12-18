## Propósito general

Este archivo es el **punto de entrada HTML** de la aplicación frontend.

Su función principal es:

* Definir la estructura base del documento HTML
* Proveer el contenedor donde React monta la aplicación
* Cargar el archivo principal de JavaScript (`main.jsx`)
* Configurar metadatos básicos y recursos globales (favicon, fuentes, viewport)

En aplicaciones React con Vite, este archivo no contiene lógica de negocio, sino que actúa como un *shell* mínimo para la app.

---

### Declaración del tipo de documento

```html
<!doctype html>
```

Indica que el documento utiliza **HTML5**, asegurando compatibilidad con navegadores modernos y estándares actuales.

---

### Etiqueta `<html>`

```html
<html lang="en">
```

* Define el idioma principal del documento como inglés
* Es relevante para accesibilidad, lectores de pantalla y SEO

> Si la aplicación es completamente en español, se puede cambiar a `lang="es"`.

---

### Sección `<head>`

Contiene metadatos y recursos globales del sitio.

#### Codificación de caracteres

```html
<meta charset="UTF-8" />
```

Permite el uso correcto de caracteres especiales como acentos y símbolos.

---

#### Favicon

```html
<link rel="icon" type="image" href="Logo_JJ.png" />
```

* Ícono mostrado en la pestaña del navegador
* Mejora la identidad visual de la aplicación

---

#### Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Habilita el comportamiento responsivo y el correcto escalado en dispositivos móviles.

---

#### Título del documento

```html
<title>Pedidos de Notas</title>
```

Texto visible en la pestaña del navegador y en marcadores.

---

### Sección `<body>`

#### Contenedor raíz de React

```html
<div id="root"></div>
```

* Punto de montaje de toda la aplicación React
* Debe coincidir con el `getElementById` usado en `main.jsx`

---

#### Carga del entry point

```html
<script type="module" src="/src/main.jsx"></script>
```

* Carga el archivo principal de la aplicación
* Usa ES Modules
* Desde aquí se inicializa React, Redux, Router y providers globales

---

### Fuentes externas

#### Inter

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Fuente utilizada para textos generales y UI.

---

#### Optimización de carga

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

Reduce latencia al cargar fuentes externas.

---

#### Saira

```html
<link href="https://fonts.googleapis.com/css2?family=Saira:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

Fuente personalizada usada en el theme global (`themeJJ`).

---

### Rol del archivo en la arquitectura

Este archivo:

* No contiene lógica de negocio
* No depende directamente de React
* Permanece estático
* Sirve como base para el montaje de la aplicación

Es fundamental para el arranque, la identidad visual y la compatibilidad del frontend.

---