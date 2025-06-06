const normalizarNombre = (nombre) =>
  nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
    .trim();

export default normalizarNombre;