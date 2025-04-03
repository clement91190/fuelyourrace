import { Group, ActionIcon, Text, Stack } from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import { FoodItemAvatar } from '../ui/FoodItemAvatar';
import { useStore } from '@nanostores/react';
import { foodLibraryStore } from '@/store/foodLibrary';
import { AidStation } from '@/types';
import { SelectFoodItemModal } from './SelectFoodItemModal';
import { useState } from 'react';

interface AidStationFoodItemsProps {
  station: AidStation;
  onUpdate: (_stationId: string, _foodItems: { itemId: string; count: number }[]) => void;
}

export function AidStationFoodItems({ station, onUpdate }: AidStationFoodItemsProps) {
  const { library, customItems } = useStore(foodLibraryStore);
  const [modalOpened, setModalOpened] = useState(false);

  const handleAddItem = (itemId: string) => {
    const currentItems = [...(station.foodItems || [])];
    const existingItem = currentItems.find(item => item.itemId === itemId);
    
    if (existingItem) {
      existingItem.count += 1;
    } else {
      currentItems.push({ itemId, count: 1 });
    }
    
    onUpdate(station.id, currentItems);
  };

  const handleRemoveItem = (itemId: string) => {
    const currentItems = [...(station.foodItems || [])];
    const existingItem = currentItems.find(item => item.itemId === itemId);
    
    if (existingItem) {
      if (existingItem.count > 1) {
        existingItem.count -= 1;
      } else {
        const index = currentItems.findIndex(item => item.itemId === itemId);
        currentItems.splice(index, 1);
      }
      onUpdate(station.id, currentItems);
    }
  };

  const getAllItems = () => [...library.items, ...customItems];

  return (
    <Stack gap="xs">
      <Group gap="md">
        {(station.foodItems || []).map(({ itemId, count }) => {
          const item = getAllItems().find(i => i.id === itemId);
          if (!item) return null;

          return (
            <Group key={itemId} gap="xs">
              <FoodItemAvatar item={item} size={24} />
              <Text size="sm">{count}</Text>
              <ActionIcon
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => handleRemoveItem(itemId)}
              >
                <IconMinus size={14} />
              </ActionIcon>
            </Group>
          );
        })}
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          onClick={() => setModalOpened(true)}
        >
          <IconPlus size={14} />
        </ActionIcon>
      </Group>

      <SelectFoodItemModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSelect={handleAddItem}
        items={getAllItems()}
      />
    </Stack>
  );
} 