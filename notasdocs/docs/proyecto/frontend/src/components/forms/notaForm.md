## Propósito

`NotaForm` es un formulario encargado de la creación de Notas de Venta, incorporando validaciones de negocio, gestión automática de clientes y confirmación de actualización de datos cuando corresponde.

---

## Responsabilidades principales

* Crear una Nota de Venta
* Validar unicidad del número de nota
* Buscar clientes por RUT
* Crear clientes automáticamente si no existen
* Detectar modificaciones en datos de cliente existentes
* Solicitar confirmación antes de actualizar un cliente
* Manejar fechas y horarios de despacho
* Mostrar notificaciones de éxito y error

---

## Dependencias

* React Hook Form
* Material UI
* notistack
* Axios (api)
* date-fns
* Hooks y componentes internos del proyecto

---

## Estado interno

* `openEditDialog`: controla el diálogo de confirmación de actualización de cliente
* `clienteOriginal`: almacena los datos originales del cliente para comparación

---

## Normalización de datos

### `transformMayus`

Convierte a mayúsculas todos los strings de un objeto, excepto los campos excluidos.

Se utiliza para garantizar consistencia en los datos enviados al backend, respetando campos sensibles como el correo.

---

## Inicialización del formulario

El formulario se inicializa mediante el hook `useNotaForm`, el cual recibe una función `onSubmit` personalizada con toda la lógica de validación y persistencia.

Flujo general:

1. Validar que el número de nota no exista
2. Buscar cliente por RUT
3. Crear cliente si no existe
4. Crear la nota

---

## Validación de número de nota

Antes de crear una nota, se consulta al backend para verificar si el número ya existe.

Si existe:

* Se inyecta un error manual en el formulario
* Se cancela el proceso de creación

---

## Gestión automática del cliente

### Búsqueda por RUT

Cuando se pierde el foco del campo RUT:

* Se consulta el cliente
* Si existe, se autocompletan los campos
* Se almacenan los valores originales para comparación

Si el cliente no existe:

* Se construye un payload con los datos ingresados
* Se crea automáticamente en la base de datos

---

## Creación de la nota

Una vez validados los datos:

* Se construye un payload reducido
* Se normalizan los valores
* Se envía la solicitud al endpoint de creación

Tras éxito:

* Se notifica al usuario
* Se reinician campos clave del formulario

---

## Manejo del RUT

* El RUT se formatea en tiempo real mientras se escribe
* Al perder el foco se valida contra el backend
* Se reutiliza el mismo campo para creación o edición

---

## Detección de cambios en cliente

Mediante `useMemo` se comparan los valores actuales del formulario con los datos originales del cliente.

Esto permite:

* Detectar qué campos fueron modificados
* Decidir si se debe mostrar el diálogo de confirmación

---

## Submit condicionado

Al enviar el formulario:

* Si hay campos de cliente modificados, se muestra un diálogo
* Si no hay cambios, se ejecuta el submit directamente

---

## Actualización del cliente

Si el usuario confirma:

* Se envía una solicitud PATCH al backend
* Se actualiza el cliente
* Se continúa automáticamente con la creación de la nota

---

## Renderizado del formulario

El formulario utiliza:

* `FormProvider` para compartir contexto
* `Controller` para inputs controlados
* Componentes MUI para layout y UX
* DatePicker y TimePicker con validación

Todos los campos:

* Están validados
* Manejan errores visuales
* Están integrados al estado global del formulario

---

## Diálogo de confirmación

El diálogo:

* Enumera los campos modificados
* Permite continuar sin actualizar
* O confirmar la actualización del cliente

---

## Conclusión

`NotaForm` centraliza lógica crítica del negocio, priorizando:

* Integridad de datos
* Automatización de procesos
* Experiencia de usuario clara
* Código mantenible y escalable

Es un componente clave dentro del flujo de ventas del proyecto.
