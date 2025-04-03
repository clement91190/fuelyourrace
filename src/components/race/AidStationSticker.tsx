import { Card, Text, Stack, Group, Box } from '@mantine/core';
import { AidStation } from '@/types';
import { useStore } from '@nanostores/react';
import { foodLibraryStore } from '@/store/foodLibrary';
import { settingsStore } from '@/store/settings';
import { DistanceUnit, ElevationUnit } from '@/types/settings';
import { convertDistance, convertElevation, formatDistance, formatElevation } from '@/utils/unitConversions';
import { IconMapPin, IconClock, IconArrowUpRight, IconMountain, IconRoad } from '@tabler/icons-react';

interface AidStationStickerProps {
  station: AidStation;
  estimatedTimeOfDay: string;
}

const DEFAULT_INSTRUCTIONS = `
_______________
_______________
_______________`

export function AidStationSticker({ station, estimatedTimeOfDay }: AidStationStickerProps) {
  const { library, customItems } = useStore(foodLibraryStore);
  const { distanceUnit, elevationUnit } = useStore(settingsStore);

  const getAllItems = () => [...library.items, ...customItems];

  const distance = convertDistance(station.distanceFromStart, DistanceUnit.KILOMETERS, distanceUnit);
  const elevation = convertElevation(station.elevationFromStart, ElevationUnit.METERS, elevationUnit);
  const currentElevation = convertElevation(station.currentElevation || 0, ElevationUnit.METERS, elevationUnit);

  return (
    <Card 
      withBorder 
      radius="sm" 
      style={{ 
        height: '100%',
        border: '2px solid #2E7D32',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        fontSize: '14px'
      }}
    >
      <Stack gap="xs" style={{ flex: 1 }}>
        {/* Station Name */}
        <Group wrap="nowrap" gap="xs">
          <IconMapPin size={20} style={{ color: '#2E7D32', flexShrink: 0 }} />
          <Text size="lg" fw={600} style={{ color: '#2E7D32', lineHeight: 1.2 }}>
            {station.name}
          </Text>
        </Group>

        {/* Race Info */}
        <Group gap="lg" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <IconClock size={16} style={{ flexShrink: 0 }} />
            <Text size="sm" style={{ whiteSpace: 'nowrap' }}>{station.estimatedTimeFromStart}</Text>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <IconRoad size={16} style={{ flexShrink: 0 }} />
            <Text size="sm" style={{ whiteSpace: 'nowrap' }}>{formatDistance(distance, distanceUnit)}</Text>
          </Group>
        </Group>

        <Group gap="lg" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <IconArrowUpRight size={16} style={{ flexShrink: 0 }} />
            <Text size="sm" style={{ whiteSpace: 'nowrap' }}>{formatElevation(elevation, elevationUnit)}</Text>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <IconMountain size={16} style={{ flexShrink: 0 }} />
            <Text size="sm" style={{ whiteSpace: 'nowrap' }}>{formatElevation(currentElevation, elevationUnit)}</Text>
          </Group>
        </Group>

        {/* Time of Day */}
        <Box mt={4}>
          <Text size="sm" fw={500}>Estimated Time of Day:</Text>
          <Box style={{ 
            border: '1px dashed #2E7D32',
            padding: '4px 8px',
            borderRadius: '4px',
            minHeight: '28px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Text size="sm">{estimatedTimeOfDay}</Text>
          </Box>
        </Box>


        {/* Food Items */}
        {station.foodItems && station.foodItems.length > 0 && (
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500}>Food Items:</Text>
            <Box style={{
              backgroundColor: '#f8f9fa',
              padding: '4px 8px',
              borderRadius: '4px',
              minHeight: '28px'
            }}>
              <Stack gap={4}>
                {station.foodItems.map(({ itemId, count }) => {
                  const item = getAllItems().find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <Text key={itemId} size="sm" style={{ lineHeight: 1.2 }}>
                      {count}x {item.name}
                    </Text>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        )}

        {/* Notes */}
        <Box mt={4}>
        <Text size="sm" fw={500}>Notes:</Text>
        <Box style={{ 
          border: '1px dashed #2E7D32',
          padding: '4px 8px',
          borderRadius: '4px',
          minHeight: '28px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Text size="sm">{station.notes || DEFAULT_INSTRUCTIONS}</Text>
        </Box>
      </Box>
     
      </Stack>
    </Card>
  );
} 