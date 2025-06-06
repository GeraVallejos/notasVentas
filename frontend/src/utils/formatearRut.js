export function formatearRut(value) {
    if (!value) return '';
    
    // Eliminar puntos y guión existentes
    const clean = value.replace(/[^\dkK]/g, '').toUpperCase();
    
    if (clean.length < 2) return clean;
    
    const cuerpo = clean.slice(0, -1);
    const dv = clean.slice(-1);
    
    const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${cuerpoConPuntos}-${dv}`;
}
