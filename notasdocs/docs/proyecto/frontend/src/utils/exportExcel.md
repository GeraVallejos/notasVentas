Este archivo define una **utilidad reutilizable** para exportar datos a **Excel (.xlsx)** usando **ExcelJS** y **file-saver**. Está pensada para integrarse fácilmente con **MUI DataGrid**, aprovechando su definición de columnas.

---

## Dependencias

```js
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
```

* **ExcelJS**: permite crear y manipular archivos Excel desde el navegador.
* **file-saver**: fuerza la descarga del archivo generado.

---

## Firma de la función

```js
export const exportExcel = async (columns, rows, fileName = 'datos.xlsx') => {
```

### Parámetros

| Parámetro  | Tipo     | Descripción                                                         |
| ---------- | -------- | ------------------------------------------------------------------- |
| `columns`  | `Array`  | Columnas del DataGrid (con `field`, `headerName`, `valueFormatter`) |
| `rows`     | `Array`  | Filas de datos a exportar                                           |
| `fileName` | `string` | Nombre del archivo Excel (opcional)                                 |

---

## Creación del workbook y worksheet

```js
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Datos');
```

* Se crea un **libro Excel**
* Se agrega una **hoja llamada "Datos"**

---

## 🏷️ Encabezados

```js
const headers = columns.map(col => col.headerName);
worksheet.addRow(headers);
```

* Usa `headerName` de las columnas del DataGrid
* Garantiza que el Excel tenga los mismos títulos visibles en la tabla

---

## Carga de filas

```js
rows.forEach((row) => {
  const dataRow = columns.map((col) => {
    const value = row[col.field];
    if (col.valueFormatter) {
      try {
        return col.valueFormatter(value);
      } catch {
        return value;
      }
    }
    return value;
  });
  worksheet.addRow(dataRow);
});
```

### Qué hace aquí

* Recorre cada fila
* Para cada columna:

  * Extrae el valor usando `field`
  * Aplica `valueFormatter` si existe (igual que en el DataGrid)
  * Maneja errores para evitar romper la exportación

**Resultado:** el Excel respeta exactamente el formato que ve el usuario.

---

## Autoajuste de columnas

```js
worksheet.columns.forEach(column => {
  let maxLength = 10;
  column.eachCell({ includeEmpty: true }, cell => {
    const length = cell.value ? cell.value.toString().length : 10;
    if (length > maxLength) {
      maxLength = length;
    }
  });
  column.width = maxLength + 2;
});
```

* Calcula el ancho máximo según el contenido
* Evita columnas cortadas o demasiado estrechas
* Mejora la **legibilidad del Excel final**

---

## Generación y descarga

```js
const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer], {
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});
saveAs(blob, fileName);
```

* Convierte el workbook a binario
* Crea un `Blob`
* Dispara la descarga automática del archivo

---

## Casos de uso típicos

* Exportar DataGrid con filtros aplicados
* Reportes administrativos
* Descarga de ventas, notas, usuarios, inventario

---

## Ejemplo de uso

```js
exportExcel(columns, rows, 'Notas_de_Ventas.xlsx');
```

---

## Ventajas de esta implementación

* Totalmente desacoplada del DataGrid
* Respeta `valueFormatter`
* Reutilizable en cualquier módulo
* No depende del backend

---

