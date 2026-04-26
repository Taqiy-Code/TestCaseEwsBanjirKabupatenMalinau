export function getStatus(value: number, sensor: any) {
  if (value >= sensor.awas_threshold) return 'AWAS';
  if (value >= sensor.waspada_threshold) return 'WASPADA';
  if (value >= sensor.siaga_threshold) return 'SIAGA';
  return 'AMAN';
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'AWAS': return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
    case 'WASPADA': return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
    case 'SIAGA': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
    default: return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
  }
}
