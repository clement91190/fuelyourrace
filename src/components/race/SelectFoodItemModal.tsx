import { FoodItem } from '@/types';
import { Modal, Stack, Group, Button, SimpleGrid } from '@mantine/core';
import { FoodItemAvatar } from '../ui/FoodItemAvatar';

interface SelectFoodItemModalProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (itemId: string) => void;
  pantryItems: FoodItem[];
}

export function SelectFoodItemModal({ opened, onClose, onSelect, pantryItems }: SelectFoodItemModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Food Item"
      size="md"
    >
      <Stack gap="md">
        <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="md">
          {pantryItems.map((item) => (
            <Group
              key={item.id}
              gap="xs"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              <FoodItemAvatar item={item} size={40} />
            </Group>
          ))}
        </SimpleGrid>
      </Stack>
    </Modal>
  );
} 