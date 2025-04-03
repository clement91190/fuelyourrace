import { Container, Title, Text, Stack } from '@mantine/core';

export function HeroSection() {
  return (
    <Container 
      size="xl" 
      py="xl" 
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Stack gap="md" align="center" ta="center" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <Title order={1} size="3.5rem" c="white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Fuel Your Race
        </Title>
        <Text size="xl" c="white" maw={600} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          Plan your nutrition strategy for trail races with precision. Track your favorite foods, create race profiles, and optimize your fueling plan.
        </Text>
      </Stack>
    </Container>
  );
} 