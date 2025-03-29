import { Card, Group, Text, Badge, Stack, ActionIcon } from '@mantine/core';
import { IconDroplet, IconBottle, IconChevronDown, IconChevronUp, IconEdit, IconLock, IconTrash } from '@tabler/icons-react';
import { FoodItem, FoodCategory } from '@/types';
import { useState } from 'react';
import { FoodItemAvatar } from './FoodItemAvatar';

interface FoodItemCardProps {
  item: FoodItem;
  onEdit?: (item: FoodItem) => void;
  onDelete?: (item: FoodItem) => void;
  isDefault?: boolean;
}

export function FoodItemCard({ item, onEdit, onDelete, isDefault }: FoodItemCardProps) {
  const CategoryIcon = item.category === FoodCategory.GEL ? IconBottle : IconDroplet;
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ position: 'relative' }}>
      <Stack gap="xs">
        <Group>
          <Group gap="xs">
            <Badge 
              leftSection={<CategoryIcon size={14} />}
              color={item.category === FoodCategory.GEL ? 'blue' : 'green'}
              variant="light"
            >
              {item.category}
            </Badge>
            <Text fw={500} size="sm">{item.name}</Text>
            {isDefault && (
              <Badge leftSection={<IconLock size={12} />} variant="light" color="gray">
                Default
              </Badge>
            )}
          </Group>
        </Group>
        
        <Group style={{ position: 'absolute', top: 8, right: 8 }} gap={4}>
          <ActionIcon
            variant="subtle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </ActionIcon>
        </Group>
        
        {isExpanded && (
          <>
            <Text size="xs" c="dimmed" lineClamp={2}>
              {item.description}
            </Text>
            
            <Group gap="xs" wrap="wrap">
              <Text size="xs">Calories: {item.nutritionFacts.calories}</Text>
              <Text size="xs">Carbs: {item.nutritionFacts.carbs}g</Text>
              <Text size="xs">Proteins: {item.nutritionFacts.proteins}g</Text>
              <Text size="xs">Sodium: {item.nutritionFacts.sodium}mg</Text>
            </Group>
            
            <Text size="xs" c="dimmed">
              Serving: {item.servingSize}
            </Text>

            <Group gap="xs">
              {onEdit && !isDefault && (
                <ActionIcon
                  variant="subtle"
                  onClick={() => onEdit(item)}
                  color="blue"
                >
                  <IconEdit size={16} />
                </ActionIcon>
              )}
              {onDelete && !isDefault && (
                <ActionIcon
                  variant="subtle"
                  onClick={() => onDelete(item)}
                  color="red"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
} 