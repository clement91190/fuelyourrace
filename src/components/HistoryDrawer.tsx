import { Drawer, Button, Stack, Text, Group, ActionIcon } from '@mantine/core';
import { IconTrash, IconClock } from '@tabler/icons-react';
import { useStore } from '@nanostores/react';
import { racePlanHistoryStore, removeRacePlan, selectRacePlan } from '../store/racePlanHistory';
import { format } from 'date-fns';
import { MantineTheme } from '@mantine/core';

interface HistoryDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function HistoryDrawer({ opened, onClose }: HistoryDrawerProps) {
  const { plans, selectedPlanId } = useStore(racePlanHistoryStore);

  const handleSelectPlan = (planId: string) => {
    selectRacePlan(planId);
    onClose();
  };

  const handleDeletePlan = (planId: string) => {
    removeRacePlan(planId);
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Race Plan History"
      position="right"
      size="sm"
    >
      <Stack gap="md">
        {plans.length === 0 ? (
          <Text c="dimmed" ta="center">
            No saved race plans yet
          </Text>
        ) : (
          plans.map((plan) => (
            <Group
              key={plan.id}
              justify="space-between"
              p="xs"
              style={(theme: MantineTheme) => ({
                backgroundColor: selectedPlanId === plan.id ? theme.colors.blue[0] : 'transparent',
                borderRadius: theme.radius.sm,
              })}
            >
              <Stack gap={0}>
                <Text fw={500}>{plan.raceProfile.name}</Text>
                <Group gap="xs">
                  <IconClock size={14} />
                  <Text size="sm" c="dimmed">
                    {format(new Date(plan.updatedAt), 'MMM d, yyyy HH:mm')}
                  </Text>
                </Group>
              </Stack>
              <Group gap="xs">
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  Load
                </Button>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>
          ))
        )}
      </Stack>
    </Drawer>
  );
} 