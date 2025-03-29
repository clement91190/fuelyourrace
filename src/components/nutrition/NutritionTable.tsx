import { Table, Card } from '@mantine/core';
import { NutritionData } from './types';
import { Settings, VolumeUnit } from '@/types/settings';

interface NutritionTableProps {
  data: NutritionData[];
  settings: Settings;
}

export function NutritionTable({ data, settings }: NutritionTableProps) {
  const volumeConversion = settings.volumeUnit === VolumeUnit.OUNCES ? 0.033814 : 1;

  return (
    <Card withBorder>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Section</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Calories</Table.Th>
            <Table.Th>Calories/hr</Table.Th>
            <Table.Th>Carbs (g)</Table.Th>
            <Table.Th>Carbs/hr</Table.Th>
            <Table.Th>Protein (g)</Table.Th>
            <Table.Th>Protein/hr</Table.Th>
            <Table.Th>Sodium (mg)</Table.Th>
            <Table.Th>Sodium/hr</Table.Th>
            <Table.Th>Volume ({settings.volumeUnit})</Table.Th>
            <Table.Th>Volume/hr</Table.Th>
            <Table.Th>Caffeine (mg)</Table.Th>
            <Table.Th>Caffeine/hr</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row) => (
            <Table.Tr key={row.station}>
              <Table.Td>{row.displayName}</Table.Td>
              <Table.Td>{row.timeFromStart}</Table.Td>
              <Table.Td>{row.calories}</Table.Td>
              <Table.Td>{row.caloriesPerHour.toFixed(1)}</Table.Td>
              <Table.Td>{row.carbs}</Table.Td>
              <Table.Td>{row.carbsPerHour.toFixed(1)}</Table.Td>
              <Table.Td>{row.protein}</Table.Td>
              <Table.Td>{row.proteinPerHour.toFixed(1)}</Table.Td>
              <Table.Td>{row.sodium}</Table.Td>
              <Table.Td>{row.sodiumPerHour.toFixed(1)}</Table.Td>
              <Table.Td>{(row.volume * volumeConversion).toFixed(1)}</Table.Td>
              <Table.Td>{(row.volumePerHour * volumeConversion).toFixed(1)}</Table.Td>
              <Table.Td>{row.caffeine}</Table.Td>
              <Table.Td>{row.caffeinePerHour.toFixed(1)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
} 