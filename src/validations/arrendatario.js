import { z } from 'zod';

export const arrendatarioSchema = z.object({
  razonSocial: z.string().min(1, 'La razón social es obligatoria'),
  rif: z.string().regex(/^J-\d{8}-\d{1}$/, 'El RIF debe seguir el formato J-12345678-1'), 
  telefono: z.string().regex(/^04\d{9}$/, 'El teléfono debe tener un formato válido de 11 dígitos, por ejemplo 04121234567'), 
  email: z.string().email('El email debe tener un formato válido'),
  contribuyenteEspecial: z.boolean('El campo contribuyenteEspecial debe ser true o false'),
  tipoContribuyente: z.string().nullable(),
});
