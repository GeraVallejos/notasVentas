import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportExcel = async (columns, rows, fileName = 'datos.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  // Encabezados
  const headers = columns.map(col => col.headerName);
  worksheet.addRow(headers);

  // Filas de datos
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

  // Ajustar columnas
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

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};