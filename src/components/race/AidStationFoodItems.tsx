import { Group, ActionIcon, Text, Stack } from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import { FoodItemAvatar } from '../ui/FoodItemAvatar';
import { useStore } from '@nanostores/react';
import { pantryStore } from '@/store/pantry';
import { AidStation } from '@/types';
import { SelectFoodItemModal } from './SelectFoodItemModal';
import { useState } from 'react';

interface AidStationFoodItemsProps {
  station: AidStation;
  onUpdate: (_stationId: string, _foodItems: { itemId: string; count: number }[]) => void;
}

export function AidStationFoodItems({ station, onUpdate }: AidStationFoodItemsProps) {
  const { defaultItems, userItems } = useStore(pantryStore);
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

  return (
    <Stack gap="xs">
      <Group gap="md">
        {(station.foodItems || []).map(({ itemId, count }) => {
          // First try to find in user items, then in default items
          const item = userItems.find(i => i.id === itemId) || 
                      defaultItems.find(i => i.id === itemId);
          if (!item) return null;
          
          return (
            <Group key={itemId} gap="xs">
              <FoodItemAvatar item={item} count={count} size={32} />
              <Group gap={4}>
                <ActionIcon
                  size="sm"
                  variant="light"
                  color="red"
                  onClick={() => handleRemoveItem(itemId)}
                >
                  <IconMinus size={14} />
                </ActionIcon>
                <Text size="sm">{count}</Text>
                <ActionIcon
                  size="sm"
                  variant="light"
                  color="green"
                  onClick={() => handleAddItem(itemId)}
                >
                  <IconPlus size={14} />
                </ActionIcon>
              </Group>
            </Group>
          );
        })}
        <ActionIcon
          size="lg"
          variant="light"
          color="blue"
          onClick={() => setModalOpened(true)}
        >
          <IconPlus size={20} />
        </ActionIcon>
      </Group>

      <SelectFoodItemModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSelect={handleAddItem}
        pantryItems={[...defaultItems, ...userItems]}
      />
    </Stack>
  );
} 