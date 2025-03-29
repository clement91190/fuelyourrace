import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

interface HeroSectionProps {
  onCreateRace: () => void;
}

export function HeroSection({ onCreateRace }: HeroSectionProps) {
  return (
    <Container size="xl" py="xl">
      <Stack gap="md" align="center" ta="center">
        <Title order={1} size="3rem">Fuel Your Race</Title>
        <Text size="xl" c="dimmed" maw={600}>
          Plan your nutrition strategy for trail races with precision. Track your favorite foods, create race profiles, and optimize your fueling plan.
        </Text>
        
        <Group>
          <Button size="lg" leftSection={<IconPlus size={20} />} onClick={onCreateRace}>
            Create Race Profile
          </Button>
        </Group>
      </Stack>
    </Container>
  );
} 