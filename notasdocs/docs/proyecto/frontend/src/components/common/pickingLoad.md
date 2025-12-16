### ¿Qué es?

`PickingLoad` es un componente contenedor encargado de **gestionar la carga de archivos Excel** hacia el backend. Actúa como capa intermedia entre la interfaz de usuario (`DropZone`) y la API, centralizando la lógica de envío, manejo de errores y feedback visual.

No renderiza UI propia compleja, sino que **orquesta estados y efectos secundarios** asociados a la subida del archivo.

---

### Responsabilidades principales

1. Controlar el estado de carga (`loading`).
2. Recibir archivos desde el componente `DropZone`.
3. Preparar y enviar los archivos al backend usando `FormData`.
4. Manejar respuestas exitosas y errores.
5. Informar el resultado al usuario mediante notificaciones.

---

### Dependencias clave

1. `useState`

   * Maneja el estado de carga del proceso.

2. `api`

   * Cliente HTTP centralizado (Axios) configurado previamente.

3. `notistack`

   * Proporciona feedback no intrusivo al usuario.

4. `DropZone`

   * Componente visual responsable de la interacción con archivos.

---

### Lógica interna

#### Estado local

```js
const [loading, setLoading] = useState(false);
```

* Controla si hay una subida en curso.
* Se utiliza para bloquear interacciones y mostrar indicadores visuales.

---

#### Manejo de archivos

```js
const handleFilesDrop = async (files) => {
```

Este método es el **punto de entrada principal** del componente.

Flujo:

1. Validación defensiva

   * Si no hay archivos, se aborta la ejecución.

2. Selección del primer archivo

   * Se asume una carga de un solo archivo.

3. Construcción de `FormData`

```js
const formData = new FormData();
formData.append("file", file);
```

* Permite enviar archivos binarios correctamente al backend.

---

#### Envío a la API

```js
const res = await api.post(
  'notas_productos/upload_excel/',
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

Aspectos importantes:

1. Uso explícito de `multipart/form-data`.
2. Endpoint desacoplado del componente visual.
3. Uso de `await` para control secuencial del flujo.

---

#### Manejo de estados y errores

* `try`

  * Activa el estado de carga.
  * Envía el archivo.
  * Muestra notificación de éxito.

* `catch`

  * Extrae mensajes de error del backend si existen.
  * Fallback a errores genéricos.

* `finally`

  * Garantiza la desactivación del estado de carga.

---

### Renderizado

```jsx
<DropZone
  onFilesDrop={handleFilesDrop}
  accept=".xls,.xlsx"
  loading={loading}
/>
```

* Se delega completamente la UI al componente `DropZone`.
* `PickingLoad` se mantiene como componente lógico.

---

