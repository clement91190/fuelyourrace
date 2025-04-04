import { Modal, TextInput, NumberInput, Stack, Group, Button, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FoodItem, FoodCategory } from '@/types';

interface FoodItemModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (_item: FoodItem) => void;
}

export function FoodItemModal({ opened, onClose, onSave }: FoodItemModalProps) {
  const form = useForm({
    initialValues: {
      name: '',
      category: FoodCategory.GEL,
      calories: 0,
      carbs: 0,
      proteins: 0,
      sodium: 0,
      caffeine: 0,
      servingSize: '',
      description: '',
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      calories: (value) => (value <= 0 ? 'Calories must be greater than 0' : null),
      carbs: (value) => (value < 0 ? 'Carbs cannot be negative' : null),
      proteins: (value) => (value < 0 ? 'Proteins cannot be negative' : null),
      sodium: (value) => (value < 0 ? 'Sodium cannot be negative' : null),
      caffeine: (value) => (value < 0 ? 'Caffeine cannot be negative' : null),
      servingSize: (value) => (!value ? 'Serving size is required' : null),
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.values;
    const newItem: FoodItem = {
      id: `food-item-${Date.now()}`,
      name: values.name,
      category: values.category,
      nutritionFacts: {
        calories: values.calories,
        carbs: values.carbs,
        proteins: values.proteins,
        sodium: values.sodium,
        caffeine: values.caffeine
      },
      servingSize: values.servingSize,
      description: values.description,
      brand: {
        id: 'custom',
        name: 'Custom'
      },
      isCustom: true
    };
    onSave(newItem);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Food Item"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Food Name"
            placeholder="e.g., Maurten Gel 100"
            required
            {...form.getInputProps('name')}
          />
          
          <Select
            label="Category"
            data={[
              { value: FoodCategory.GEL, label: 'Gel' },
              { value: FoodCategory.DRINK, label: 'Drink' },
            ]}
            required
            {...form.getInputProps('category')}
          />

          <TextInput
            label="Description"
            placeholder="e.g., High-carb energy gel with hydrogel technology"
            {...form.getInputProps('description')}
          />

          <NumberInput
            label="Calories"
            placeholder="e.g., 100"
            required
            min={0}
            {...form.getInputProps('calories')}
          />

          <NumberInput
            label="Carbs (g)"
            placeholder="e.g., 25"
            required
            min={0}
            {...form.getInputProps('carbs')}
          />

          <NumberInput
            label="Proteins (g)"
            placeholder="e.g., 0"
            required
            min={0}
            {...form.getInputProps('proteins')}
          />

          <NumberInput
            label="Sodium (mg)"
            placeholder="e.g., 100"
            required
            min={0}
            {...form.getInputProps('sodium')}
          />

          <NumberInput
            label="Caffeine (mg)"
            placeholder="e.g., 0"
            required
            min={0}
            {...form.getInputProps('caffeine')}
          />

          <TextInput
            label="Serving Size"
            placeholder="e.g., 40g"
            required
            {...form.getInputProps('servingSize')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Food Item</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 