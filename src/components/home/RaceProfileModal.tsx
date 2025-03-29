import { FC } from 'react';
import { Modal, TextInput, NumberInput, Stack, Group, Button } from '@mantine/core';

interface RaceProfileModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const RaceProfileModal: FC<RaceProfileModalProps> = ({ opened, onClose, onSubmit }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create Race Profile"
      size="md"
    >
      <Stack>
        <TextInput
          label="Race Name"
          placeholder="e.g., Ultra Trail du Mont Blanc"
          required
        />
        <NumberInput
          label="Total Distance (km)"
          placeholder="e.g., 170"
          required
        />
        <NumberInput
          label="Total Elevation (m)"
          placeholder="e.g., 10000"
          required
        />
        <NumberInput
          label="Estimated Duration (hours)"
          placeholder="e.g., 30"
          required
        />
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit({})}>Create Profile</Button>
        </Group>
      </Stack>
    </Modal>
  );
}; 