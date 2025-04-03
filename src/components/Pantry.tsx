import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { 
  foodLibraryStore, 
  toggleItemSelection,
  addCustomItem,
  removeCustomItem,
  setFoodLibrary
} from '@/store/foodLibrary';
import { 
  SimpleGrid, 
  Button, 
  Group, 
  Title, 
  Text, 
  Stack, 
  TextInput,
  Collapse,
  Checkbox,
  Avatar,
  Divider
} from '@mantine/core';
import { IconPlus, IconSearch, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { FoodItem, NutritionFacts } from '@/types';
import { FoodItemModal } from './home/FoodItemModal';

function NutritionFactsDisplay({ nutritionFacts }: { nutritionFacts: NutritionFacts }) {
  const facts = [
    { label: 'cal', value: nutritionFacts.calories },
    { label: 'g carbs', value: nutritionFacts.carbs },
    { label: 'mg caffeine', value: nutritionFacts.caffeine },
    { label: 'mg sodium', value: nutritionFacts.sodium }
  ].filter(fact => fact.value > 0);

  return (
    <Text size="sm" c="dimmed">
      {facts.map((fact, index) => (
        <span key={fact.label}>
          {fact.value} {fact.label}
          {index < facts.length - 1 ? ' • ' : ''}
        </span>
      ))}
    </Text>
  );
}

export function Pantry() {
  const { library, selectedItems, customItems } = useStore(foodLibraryStore);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBrands, setExpandedBrands] = useState<{ [key: string]: boolean }>({});
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    // Fetch food library data when component mounts
    fetch('/api/food-library')
      .then(res => res.json())
      .then(data => setFoodLibrary(data))
      .catch(console.error);
  }, []);

  const toggleBrand = (brandId: string) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
  };

  const filteredItems = library.items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsByBrand = library.brands.reduce((acc, brand) => {
    acc[brand.id] = filteredItems.filter(item => item.brand.id === brand.id);
    return acc;
  }, {} as { [key: string]: FoodItem[] });

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={2}>My Pantry</Title>
        <Button
          leftSection={<IconPlus size={14} />}
          onClick={() => {
            setModalOpened(true);
          }}
        >
          Add Custom Item
        </Button>
      </Group>

      <TextInput
        placeholder="Search items..."
        leftSection={<IconSearch size={14} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Stack gap="md">
        {library.brands.map(brand => (
          <div key={brand.id}>
            <Group 
              justify="space-between" 
              style={{ cursor: 'pointer' }}
              onClick={() => toggleBrand(brand.id)}
            >
              <Group>
                {brand.iconUrl ? (
                  <Avatar src={brand.iconUrl} size="sm" />
                ) : (
                  <Avatar size="sm">{brand.name[0]}</Avatar>
                )}
                <Text fw={500}>{brand.name}</Text>
              </Group>
              {expandedBrands[brand.id] ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            </Group>
            
            <Collapse in={expandedBrands[brand.id]}>
              <Stack gap="xs" mt="sm">
                {itemsByBrand[brand.id]?.map(item => (
                  <Group key={item.id} justify="space-between">
                    <Text>{item.name}</Text>
                    <Checkbox
                      checked={selectedItems.some(i => i.id === item.id)}
                      onChange={() => toggleItemSelection(item)}
                    />
                  </Group>
                ))}
              </Stack>
            </Collapse>
            <Divider my="sm" />
          </div>
        ))}
      </Stack>

      {selectedItems.length > 0 && (
        <Stack gap="md">
          <Title order={3}>Selected Items</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {selectedItems.map(item => (
              <div key={item.id}>
                <Group>
                  {item.brand.iconUrl ? (
                    <Avatar src={item.brand.iconUrl} size="sm" />
                  ) : (
                    <Avatar size="sm">{item.brand.name[0]}</Avatar>
                  )}
                  <Text>{item.name}</Text>
                </Group>
                <NutritionFactsDisplay nutritionFacts={item.nutritionFacts} />
              </div>
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {customItems.length > 0 && (
        <Stack gap="md">
          <Title order={3}>Custom Items</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {customItems.map(item => (
              <div key={item.id}>
                <Group justify="space-between">
                  <Text>{item.name}</Text>
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={() => removeCustomItem(item.id)}
                  >
                    Remove
                  </Button>
                </Group>
                <NutritionFactsDisplay nutritionFacts={item.nutritionFacts} />
              </div>
            ))}
          </SimpleGrid>
        </Stack>
      )}

      <FoodItemModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
        }}
        onSave={(newItem) => {
          addCustomItem(newItem);
          setModalOpened(false);
        }}
      />
    </Stack>
  );
} 