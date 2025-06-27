# <font color=#ff5733>ExcelJS</font>

Es una librería JavaScript que permite crear, leer y manipular archivos de Excel (XLSX) directamente en el navegador o en Node.js. Cuando se combina con React y Material-UI, puedes crear interfaces elegantes para generar reportes en Excel.

### Teoría de la Librería

#### **Fundamentos del formato Excel (XLSX)**

- Office Open XML (OOXML): El formato moderno de Excel (.xlsx) es esencialmente un paquete ZIP que contiene múltiples archivos XML estructurados

- Workbook.xml: Estructura principal del libro

- Worksheets/sheetX.xml: Datos de cada hoja

- Styles.xml: Definiciones de estilos

- SharedStrings.xml: Strings compartidos para optimización

- Theme.xml: Información de temas

- ExcelJS abstrae esta complejidad proporcionando una API de alto nivel.

#### **Arquitectura de ExcelJS**

Modelo de objetos clave:

- Workbook (Libro de trabajo)
    - Contenedor principal que representa un archivo Excel
    - Puede contener múltiples hojas (Worksheets)
    - Maneja estilos compartidos, temas y propiedades globales

- Worksheet (Hoja de cálculo)
    - Representa una pestaña/hoja individual
    - Contiene celdas organizadas en filas y columnas
    - Maneja propiedades como congelamiento de paneles, tablas, etc.

- Row (Fila)

    - Unidad horizontal de celdas
    - Puede contener propiedades de formato a nivel de fila

- Cell (Celda)
    - Unidad básica de datos
    - Contiene valor, estilo, fórmulas, etc.

- Style (Estilo)
    - Define formato visual: fuentes, bordes, rellenos, alineación
    - Se puede aplicar a celdas, filas, columnas o rangos

#### **Flujo de trabajo típico**

**Creación/Manipulación:**

```js
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Mi Hoja');
worksheet.addRow([1, 'Texto', new Date()]);
```

**Serialización:**

```js
// En el navegador:
const buffer = await workbook.xlsx.writeBuffer();

// En Node.js:
await workbook.xlsx.writeFile('ruta/archivo.xlsx');
```

**Parsing (lectura):**

```js
await workbook.xlsx.load(bufferOrFile);
const worksheet = workbook.getWorksheet(1);
```

#### **Teoría de implementación**

a) Gestión de memoria
ExcelJS utiliza un modelo de manipulación diferida (lazy loading) para manejar grandes conjuntos de datos eficientemente. Las celdas no se crean en memoria hasta que se accede a ellas.

b) Sistema de estilos compartidos
Implementa un patrón Flyweight para estilos, donde múltiples celdas pueden referenciar el mismo objeto de estilo, reduciendo el uso de memoria.

c) Serialización XML

- q Internamente usa:
    - SAX parser para lectura (bajo consumo de memoria)
    - DOM builder para escritura (más control sobre la estructura)

d) Soporte para streams
En Node.js, implementa interfaces de stream para manejar archivos muy grandes sin cargarlos completamente en memoria.

#### **Teoría de integración con React**

- **Virtual DOM vs Excel DOM**
React maneja el Virtual DOM para actualizaciones eficientes de la UI, mientras que ExcelJS maneja su propio "DOM de Excel" (la representación en memoria del libro).

- **Patrón de reconciliación**
Cuando usas ExcelJS con React, esencialmente estás haciendo:

    - Extracción de datos del estado/components de React
    - Transformación al modelo de ExcelJS
    - Generación del archivo binario

- **Principio de responsabilidad única**

    - ExcelJS se encarga solo de la generación del Excel, mientras que:
    - React maneja la UI
    - Material-UI proporciona componentes visuales
    - FileSaver (u otras) maneja la descarga

#### **Teoría de formatos condicionales**

- ExcelJS implementa formatos condicionales mediante:

    - Funciones de evaluación: Permite definir lógica para aplicar estilos
    - Jerarquía de estilos: Estilos pueden heredar/sobrescribir propiedades
    - Caching de resultados: Para mejorar performance en evaluaciones repetidas

Ejemplo teórico:

```js
cell.style = {
  font: { color: { argb: condition ? 'FFFF0000' : 'FF00FF00' } }
};
```

#### **Modelo de extensiones**
ExcelJS está diseñado con un sistema de plugins que permite extender funcionalidades como:

- Nuevos tipos de formatos
- Soporte para gráficos avanzados
- Integración con fórmulas personalizadas

#### **Teoría de seguridad**

Consideraciones importantes:

- Sanitización de inputs: Previene inyección en fórmulas
- Validación de tipos: Asegura que los valores sean compatibles con Excel
- Protección contra XXE: En el parsing de XML

### Uso Básico

**`npm install exceljs file-saver`**

- Crear componente

```js
import React from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExcelExportButton = ({ data }) => {
  const exportToExcel = async () => {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');
    
    // Agregar encabezados
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'name', width: 32 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Fecha', key: 'date', width: 15 },
    ];
    
    // Agregar datos
    data.forEach(item => {
      worksheet.addRow(item);
    });
    
    // Estilizar encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
    });
    
    // Generar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'reporte.xlsx');
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      startIcon={<DownloadIcon />}
      onClick={exportToExcel}
    >
      Exportar a Excel
    </Button>
  );
};

export default ExcelExportButton;
```

- Usar componente

```js
import React from 'react';
import { Container, Typography } from '@mui/material';
import ExcelExportButton from './ExcelExportButton';

const App = () => {
  const sampleData = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', date: '2023-05-01' },
    { id: 2, name: 'María García', email: 'maria@example.com', date: '2023-05-02' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', date: '2023-05-03' },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reporte de Usuarios
      </Typography>
      <ExcelExportButton data={sampleData} />
    </Container>
  );
};

export default App;
```

### Características avanzadas

- Formato Condicional

```js
worksheet.eachRow((row, rowNumber) => {
  if (rowNumber > 1) { // Saltar encabezados
    const emailCell = row.getCell('email');
    if (!emailCell.value.includes('@')) {
      emailCell.font = { color: { argb: 'FFFF0000' }, bold: true };
    }
  }
});
```

- Combinar Celdas

```js
worksheet.mergeCells('A1:D1');
const titleCell = worksheet.getCell('A1');
titleCell.value = 'Reporte de Usuarios';
titleCell.font = { size: 16, bold: true };
titleCell.alignment = { horizontal: 'center' };
```

- Agregar imágenes

```js
// Es necesario convertir la imagen a buffer primero
const imageId = workbook.addImage({
  buffer: fs.readFileSync('logo.png'),
  extension: 'png',
});

worksheet.addImage(imageId, 'A1:C3');
```

- Leer archivos Excel

```js
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const arrayBuffer = await file.arrayBuffer();
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  
  const worksheet = workbook.getWorksheet(1);
  const data = [];
  
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Saltar encabezados
      data.push({
        id: row.getCell(1).value,
        name: row.getCell(2).value,
        email: row.getCell(3).value,
        date: row.getCell(4).value,
      });
    }
  });
  
  setImportedData(data);
};
```

### Integración con Data Grid de MUI

```js
import { DataGrid } from '@mui/x-data-grid';

const ExcelExportDataGrid = ({ rows, columns }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');
    
    // Agregar encabezados
    worksheet.columns = columns.map(col => ({
      header: col.headerName || col.field,
      key: col.field,
      width: 20
    }));
    
    // Agregar datos
    rows.forEach(row => {
      worksheet.addRow(row);
    });
    
    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'datos.xlsx');
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        components={{
          Toolbar: () => (
            <div>
              <Button onClick={exportToExcel} startIcon={<DownloadIcon />}>
                Exportar
              </Button>
            </div>
          ),
        }}
      />
    </div>
  );
};
```

### Consideraciones

1. Tamaño del archivo: Para conjuntos de datos muy grandes, es mejor procesar en chunks o usar Web Workers.
2. Estilos avanzados: ExcelJS soporta bordes, colores, fuentes y alineación compleja.
3. Formatos especiales: Se pueden definir formatos para fechas, números, monedas, etc.
4. Rendimiento: Para archivos muy grandes, el proceso puede bloquear la UI. Considerar mostrar un indicador de progreso.

---

