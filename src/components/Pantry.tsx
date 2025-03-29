import { useStore } from '@nanostores/react';
import { pantryStore, addFoodItem, updateFoodItem, removeFoodItem } from '@/store/pantry';
import { SimpleGrid, Button, Group, Title, Text, Stack, Modal } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { FoodItemCard } from './ui/FoodItemCard';
import { FoodItemModal } from './home/FoodItemModal';
import { FoodItem } from '@/types';

export function Pantry() {
  const { defaultItems, userItems } = useStore(pantryStore);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | undefined>(undefined);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FoodItem | undefined>(undefined);

  const handleDelete = (item: FoodItem) => {
    setItemToDelete(item);
    setDeleteModalOpened(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFoodItem(itemToDelete.id);
      setDeleteModalOpened(false);
      setItemToDelete(undefined);
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={2}>Food Items</Title>
        <Button
          leftSection={<IconPlus size={14} />}
          onClick={() => {
            setEditingItem(undefined);
            setModalOpened(true);
          }}
        >
          Add Food Item
        </Button>
      </Group>

      {defaultItems.length > 0 && (
        <Stack gap="md">
          <Text size="sm" c="dimmed" fw={500}>Default Items</Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {defaultItems.map(item => (
              <FoodItemCard
                key={item.id}
                item={item}
                isDefault
              />
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {userItems.length > 0 && (
        <Stack gap="md">
          <Text size="sm" c="dimmed" fw={500}>My Items</Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {userItems.map(item => (
              <FoodItemCard
                key={item.id}
                item={item}
                onEdit={(item) => {
                  setEditingItem(item);
                  setModalOpened(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </SimpleGrid>
        </Stack>
      )}

      <FoodItemModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingItem(undefined);
        }}
        item={editingItem}
        onSave={(item) => {
          if (editingItem) {
            updateFoodItem(editingItem.id, item);
          } else {
            addFoodItem(item);
          }
        }}
      />

      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
          setItemToDelete(undefined);
        }}
        title="Delete Food Item"
        size="sm"
      >
        <Stack gap="md">
          <Text>Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => {
              setDeleteModalOpened(false);
              setItemToDelete(undefined);
            }}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
} 