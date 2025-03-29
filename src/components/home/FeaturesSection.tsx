import { FC } from 'react';
import { Container, Grid, Paper, Title, Text } from '@mantine/core';
import { IconCookie, IconCalendar, IconChartBar } from '@tabler/icons-react';

export const FeaturesSection: FC = () => {
  return (
    <Container size="lg" py={80}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <IconCookie size={40} color="#2E7D32" style={{ marginBottom: '1rem' }} />
            <Title order={3} style={{ marginBottom: '1rem' }}>Track Food Items</Title>
            <Text>Add and manage your favorite trail running foods with detailed nutritional information.</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <IconCalendar size={40} color="#2E7D32" style={{ marginBottom: '1rem' }} />
            <Title order={3} style={{ marginBottom: '1rem' }}>Race Profiles</Title>
            <Text>Create detailed race profiles with aid stations and predicted times.</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <IconChartBar size={40} color="#2E7D32" style={{ marginBottom: '1rem' }} />
            <Title order={3} style={{ marginBottom: '1rem' }}>Nutrition Strategy</Title>
            <Text>Plan and optimize your nutrition strategy for optimal performance.</Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}; 