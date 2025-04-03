import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Table, ActionIcon, Group, Switch, TextInput, NumberInput, Text } from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { AidStation } from '@/types';
import { useStore } from '@nanostores/react';
import { settingsStore } from '@/store/settings';
import { DistanceUnit, ElevationUnit, PaceUnit } from '@/types/settings';
import { useState } from 'react';
import { 
  calculateSegmentDetails, 
  calculateEstimatedTime,
  formatTime,
  parseTime
} from '@/utils/raceCalculations';
import {
  convertDistance,
  convertElevation,
  convertPace,
  formatDistance,
  formatElevation,
  formatPace
} from '@/utils/unitConversions';
import { ValueEditor } from '@/components/ui/ValueEditor';
import { AidStationFoodItems } from './AidStationFoodItems';

interface AidStationsTableProps {
  data: AidStation[];
  onUpdate: (_id: string, _updates: Partial<AidStation>) => void;
  onAdd: (_station: AidStation) => void;
  onRemove: (_id: string) => void;
}

export function AidStationsTable({ data, onUpdate, onAdd, onRemove }: AidStationsTableProps) {
  const [editingCell, setEditingCell] = useState<{ id: string; key: keyof AidStation; mode: 'absolute' | 'delta' } | null>(null);
  const { distanceUnit, elevationUnit, paceUnit } = useStore(settingsStore);

  const columnHelper = createColumnHelper<AidStation>();

  const handleDistanceUpdate = (row: any, value: number, mode: 'absolute' | 'delta') => {
    const currentStation = row.original;
    const previousStation = row.index > 0 ? data[row.index - 1] : null;
    
    let newDistance: number;
    if (mode === 'absolute') {
      newDistance = value;
    } else {
      newDistance = previousStation ? previousStation.distanceFromStart + value : value;
    }

    onUpdate(currentStation.id, { distanceFromStart: newDistance });
  };

  const handleElevationUpdate = (row: any, value: number, mode: 'absolute' | 'delta') => {
    const currentStation = row.original;
    const previousStation = row.index > 0 ? data[row.index - 1] : null;
    
    let newElevation: number;
    if (mode === 'absolute') {
      newElevation = value;
    } else {
      newElevation = previousStation ? previousStation.elevationFromStart + value : value;
    }

    onUpdate(currentStation.id, { elevationFromStart: newElevation });
  };

  const handleTimeUpdate = (row: any, value: string, mode: 'absolute' | 'delta') => {
    const currentStation = row.original;
    const previousStation = row.index > 0 ? data[row.index - 1] : null;
    
    let newTime: string;
    if (mode === 'absolute') {
      newTime = value;
    } else {
      const previousTime = previousStation ? parseTime(previousStation.estimatedTimeFromStart) : 0;
      const deltaMinutes = parseTime(value);
      newTime = formatTime(previousTime + deltaMinutes);
    }

    onUpdate(currentStation.id, { estimatedTimeFromStart: newTime });
  };

  const handleFoodItemsUpdate = (stationId: string, foodItems: { itemId: string; count: number }[]) => {
    onUpdate(stationId, { foodItems });
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Aid Station',
      cell: ({ row, getValue }) => {
        const isEditing = editingCell?.id === row.original.id && editingCell?.key === 'name';
        return isEditing ? (
          <TextInput
            defaultValue={getValue()}
            onBlur={(e) => {
              onUpdate(row.original.id, { name: e.target.value });
              setEditingCell(null);
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell({ id: row.original.id, key: 'name', mode: 'absolute' })}>
            {getValue()}
          </span>
        );
      },
    }),
    columnHelper.accessor('distanceFromStart', {
      header: 'Distance',
      cell: ({ row, getValue }) => {
        const isEditing = editingCell?.id === row.original.id && editingCell?.key === 'distanceFromStart';
        const distance = convertDistance(getValue(), DistanceUnit.KILOMETERS, distanceUnit);
        const deltaDistance = row.index > 0 
          ? distance - convertDistance(data[row.index - 1].distanceFromStart, DistanceUnit.KILOMETERS, distanceUnit)
          : distance;
        
        return isEditing ? (
          <ValueEditor
            absoluteValue={distance}
            deltaValue={deltaDistance}
            mode={editingCell.mode}
            onModeChange={(mode) => {
              setEditingCell({ ...editingCell, mode });
            }}
            onValueChange={(value) => {
              handleDistanceUpdate(row, value as number, editingCell.mode);
              setEditingCell(null);
            }}
            type="number"
            placeholder="0"
            autoFocus
          />
        ) : (
          <Group gap={4} onClick={() => setEditingCell({ id: row.original.id, key: 'distanceFromStart', mode: 'absolute' })}>
            <Text>{formatDistance(distance, distanceUnit)}</Text>
            {row.index > 0 && (
              <Text size="xs" c="dimmed">
                (+{formatDistance(deltaDistance, distanceUnit)})
              </Text>
            )}
          </Group>
        );
      },
    }),
    columnHelper.accessor('elevationFromStart', {
      header: 'Elevation Gain',
      cell: ({ row, getValue }) => {
        const isEditing = editingCell?.id === row.original.id && editingCell?.key === 'elevationFromStart';
        const elevation = convertElevation(getValue(), ElevationUnit.METERS, elevationUnit);
        const deltaElevation = row.index > 0 
          ? elevation - convertElevation(data[row.index - 1].elevationFromStart, ElevationUnit.METERS, elevationUnit)
          : elevation;
        
        return isEditing ? (
          <ValueEditor
            absoluteValue={elevation}
            deltaValue={deltaElevation}
            mode={editingCell.mode}
            onModeChange={(mode) => {
              setEditingCell({ ...editingCell, mode });
            }}
            onValueChange={(value) => {
              handleElevationUpdate(row, value as number, editingCell.mode);
              setEditingCell(null);
            }}
            type="number"
            placeholder="0"
            autoFocus
          />
        ) : (
          <Group gap={4} onClick={() => setEditingCell({ id: row.original.id, key: 'elevationFromStart', mode: 'absolute' })}>
            <Text>{formatElevation(elevation, elevationUnit)}</Text>
            {row.index > 0 && (
              <Text size="xs" c="dimmed">
                (+{formatElevation(deltaElevation, elevationUnit)})
              </Text>
            )}
          </Group>
        );
      },
    }),
    columnHelper.accessor('currentElevation', {
      header: 'Current Elevation',
      cell: ({ row, getValue }) => {
        const isEditing = editingCell?.id === row.original.id && editingCell?.key === 'currentElevation';
        const elevation = convertElevation(getValue() || 0, ElevationUnit.METERS, elevationUnit);
        
        return isEditing ? (
          <NumberInput
            defaultValue={elevation}
            onBlur={(e) => {
              onUpdate(row.original.id, { currentElevation: convertElevation(Number(e.target.value), elevationUnit, ElevationUnit.METERS) });
              setEditingCell(null);
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell({ id: row.original.id, key: 'currentElevation', mode: 'absolute' })}>
            {formatElevation(elevation, elevationUnit)}
          </span>
        );
      },
    }),
    columnHelper.accessor('estimatedTimeFromStart', {
      header: 'Estimated Time',
      cell: ({ row, getValue }) => {
        const isEditing = editingCell?.id === row.original.id && editingCell?.key === 'estimatedTimeFromStart';
        const { timeFromPrevious, paceMinPerKm } = calculateSegmentDetails(data, row.index);
        const pace = convertPace(paceMinPerKm, PaceUnit.MIN_PER_KM, paceUnit);
        
        return isEditing ? (
          <ValueEditor
            absoluteValue={getValue()}
            deltaValue={timeFromPrevious}
            mode={editingCell.mode}
            onModeChange={(mode) => {
              setEditingCell({ ...editingCell, mode });
            }}
            onValueChange={(value) => {
              handleTimeUpdate(row, value as string, editingCell.mode);
              setEditingCell(null);
            }}
            type="time"
            placeholder="HH:MM:SS"
            autoFocus
          />
        ) : (
          <Group gap={4} onClick={() => setEditingCell({ id: row.original.id, key: 'estimatedTimeFromStart', mode: 'absolute' })}>
            <Text>{getValue()}</Text>
            <Text size="xs" c="dimmed">({timeFromPrevious} @ {formatPace(pace, paceUnit)} {paceUnit})</Text>
          </Group>
        );
      },
    }),
    columnHelper.accessor('assistanceAllowed', {
      header: 'Assistance',
      cell: ({ row, getValue }) => (
        <Switch
          checked={getValue()}
          onChange={(e) => onUpdate(row.original.id, { assistanceAllowed: e.currentTarget.checked })}
        />
      ),
    }),
    columnHelper.accessor('foodItems', {
      header: 'Food Items',
      cell: ({ row }) => (
        <AidStationFoodItems
          station={row.original}
          onUpdate={handleFoodItemsUpdate}
        />
      ),
    }),
    columnHelper.accessor('notes', {
      header: 'Notes',
      cell: ({ row, getValue }) => {
        const isEditing = editingCell?.id === row.original.id && editingCell?.key === 'notes';
        return isEditing ? (
          <TextInput
            defaultValue={getValue() || ''}
            onBlur={(e) => {
              onUpdate(row.original.id, { notes: e.target.value });
              setEditingCell(null);
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell({ id: row.original.id, key: 'notes', mode: 'absolute' })}>
            {getValue() || 'Click to add notes'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={() => onRemove(row.original.id)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <Table.Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Table.Th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map(row => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      <Group justify="center" mt="md">
        <ActionIcon
          size="lg"
          variant="filled"
          color="blue"
          onClick={() => {
            const lastStation = data[data.length - 1];
            const newStation: AidStation = {
              id: `aid-station-${Date.now()}`,
              name: 'New Aid Station',
              distanceFromStart: lastStation ? lastStation.distanceFromStart + 10 : 10,
              elevationFromStart: lastStation ? lastStation.elevationFromStart + 100 : 100,
              estimatedTimeFromStart: '00:00:00',
              assistanceAllowed: true,
              foodItems: [],
            };
            newStation.estimatedTimeFromStart = calculateEstimatedTime(
              newStation.distanceFromStart,
              6 // Default pace of 6 min/km
            );
            onAdd(newStation);
          }}
        >
          <IconPlus size={20} />
        </ActionIcon>
      </Group>
    </div>
  );
} 