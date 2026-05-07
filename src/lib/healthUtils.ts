/**
 * Utilidades para interpretación médica básica de presión arterial
 * Basado en las guías generales para pacientes.
 */

export interface BPStatus {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export const getBPStatus = (sys: number, dia: number): BPStatus => {
  // Crisis hipertensiva
  if (sys >= 180 || dia >= 120) {
    return {
      label: 'URGENCIA MÉDICA',
      color: 'red',
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      description: 'Valores peligrosos. Busca ayuda médica de inmediato.'
    };
  }
  
  // Hipertensión Grado 2
  if (sys >= 160 || dia >= 100) {
    return {
      label: 'Hipertensión Grado 2',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      description: 'Presión arterial muy alta. Requiere seguimiento médico constante.'
    };
  }

  // Hipertensión Grado 1
  if (sys >= 140 || dia >= 90) {
    return {
      label: 'Hipertensión Grado 1',
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Presión arterial alta. Se recomienda consultar con su médico.'
    };
  }

  // Elevada
  if (sys >= 130 || dia >= 80) {
    return {
      label: 'Elevada (Vigilar)',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Valores por encima de lo ideal. Vigila tu dieta y estilo de vida.'
    };
  }

  // Hipotensión
  if (sys <= 90 || dia <= 60) {
    return {
      label: 'Presión Baja (Hipotensión)',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Valores bajos. Si tienes mareos, consulta a tu médico.'
    };
  }

  // Normal
  return {
    label: 'Saludable',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    description: 'Tus valores están en un rango óptimo y saludable.'
  };
};
