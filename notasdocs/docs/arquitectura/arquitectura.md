# Plantilla base — Arquitectura React + Django

> **Documento interno de referencia personal**

> Objetivo: servir como guía reutilizable para iniciar, estructurar y evaluar proyectos basados en **React (frontend)** y **Django / Django REST Framework (backend)**.

---

## 1️⃣ Identidad del proyecto

### Nombre del proyecto

> *Completar*

### Tipo de sistema

Marcar lo que aplique:

* [ ] CRUD simple
* [ ] CRUD con reglas de negocio
* [ ] Sistema transaccional
* [ ] Dashboard / Backoffice
* [ ] API pura
* [ ] Otro:

### Objetivo principal

> ¿Qué problema resuelve este sistema?

### Nivel de complejidad esperado

* Bajo / Medio / Alto

> Nota: este punto define cuánta arquitectura vale la pena aplicar.

---

## 2️⃣ Arquitectura general

### Backend

* Framework: Django + Django REST Framework
* Tipo:

  * [ ] Monolito
  * [ ] API REST

**Motivo de elección**:

* DRF permite separación clara entre frontend y backend
* Serialización explícita de datos
* Facilidad para validaciones y permisos

### Frontend

* Framework: React
* Librería de UI: (ej: MUI)
* Manejo de estado:

  * Local por componente
  * Context / Store solo si es necesario

**Motivo de elección**:

* Componentización
* Separación clara de responsabilidades

---

## 3️⃣ Reglas del proyecto (estándar personal)

Estas reglas buscan mantener el código predecible y mantenible.

### Frontend

* Las **pages** no contienen lógica de negocio
* Los **formularios encapsulan**:

  * Estado
  * Validaciones
  * Envío de datos
* El acceso a la API se realiza **solo vía servicios**
* Los componentes UI no conocen detalles del backend

### Backend

* Las vistas no contienen lógica compleja
* La lógica de negocio vive en servicios
* Los serializers validan y transforman datos

---

## 4️⃣ Estructura de carpetas base

### Frontend

```text
src/
  pages/
  components/
    forms/
    ui/
  services/
  hooks/
  utils/
```

**Notas**:

* `pages/`: composición, no lógica
* `forms/`: formularios con responsabilidad completa
* `services/`: axios / fetch centralizado

---

### Backend

```text
app/
  models/
  serializers/
  views/
  services/
  urls/
```

**Notas**:

* `services/`: reglas de negocio
* `views/`: orquestación HTTP

---

## 5️⃣ Patrones reutilizables

### Página contenedora (React)

**Responsabilidad**:

* Renderizar componentes
* Actuar como punto de entrada de la ruta

**No debe**:

* Validar datos
* Consumir API directamente

---

### Formulario encapsulado

**Responsabilidad**:

* Manejar estado del formulario
* Validaciones
* Submit y manejo de errores

**Beneficios**:

* Reutilización
* Pruebas más simples
* Menor acoplamiento

---

## 6️⃣ Decisiones tecnológicas

### Axios

**Usar cuando**:

* Se requieren interceptores
* Manejo global de errores
* Headers automáticos

**Evitar cuando**:

* Requests muy puntuales y simples

---

### Django REST Framework

**Usar cuando**:

* Frontend desacoplado
* Posibles múltiples clientes
* Necesidad de validaciones robustas

---

## 7️⃣ Flujos principales

### Flujo genérico de creación

1. Page renderiza formulario
2. Formulario maneja estado
3. Servicio envía request
4. Backend valida (serializer)
5. Servicio aplica reglas
6. Respuesta vuelve al frontend

---

## 8️⃣ Checklist inicial de proyecto

* [ ] Objetivo definido
* [ ] Arquitectura decidida
* [ ] Reglas del proyecto escritas
* [ ] Estructura base creada
* [ ] Servicios API centralizados
* [ ] Documentación inicial creada

---

## 9️⃣ Notas personales

> Espacio para aprendizajes, decisiones que funcionaron o no, y ajustes futuros.

---

## 1️⃣0️⃣ Uso de esta plantilla

* Copiar este archivo al iniciar un proyecto nuevo
* Ajustar decisiones según complejidad real
* Mantenerla actualizada junto al código

> Esta documentación es una herramienta de pensamiento, no un entregable público.

---