import { Avatar, Text, Group } from '@mantine/core';
import { FoodItem, FoodCategory } from '@/types';

interface FoodItemAvatarProps {
  item: FoodItem;
  count?: number;
  size?: number;
}

export function FoodItemAvatar({ item, count, size = 32 }: FoodItemAvatarProps) {
  return (
    <Group gap="xs">
      <Avatar size={size} color={item.category === FoodCategory.GEL ? 'blue' : 'green'}>
        {item.brand.iconUrl ? (
          <Avatar src={item.brand.iconUrl} size={size} />
        ) : (
          <Avatar size={size}>{item.brand.name[0]}</Avatar>
        )}
      </Avatar>
      <div>
        <Text size="sm" fw={500}>{item.name}</Text>
        {count !== undefined && (
          <Text size="xs" c="dimmed">x{count}</Text>
        )}
      </div>
    </Group>
  );
} 