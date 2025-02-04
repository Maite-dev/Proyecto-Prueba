export const dataBoolean = (value) => {
    if (value === 'si') return true;
    if (value === 'no') return false;
    throw new Error('Valor inválido para el campo booleano, debe ser "si" o "no"');
  };
  