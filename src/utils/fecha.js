export const formatFecha = (fecha) => {
  // Verificamos si la fecha es válida
  const date = new Date(fecha);
  if (isNaN(date)) {
    return null; // Retornamos null si la fecha no es válida
  }

  // Configuración para el formato dd/mm/yyyy
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('es-ES', options);  // 'es-ES' es el código para la localización en español (España)
};
