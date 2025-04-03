import { useStore } from '@nanostores/react';
import { Card, Title, Text, Stack, Group, TextInput, ActionIcon, Modal, Button } from '@mantine/core';
import { raceProfilesStore, updateAidStation, addAidStation, removeAidStation, updateProfile, saveProfiles, createNewProfile } from '@/store/raceProfiles';
import { racePlanHistoryStore } from '@/store/racePlanHistory';
import { AidStationsTable } from './AidStationsTable';
import { NutritionStrategy } from './NutritionStrategy';
import { LiveTrailLoader } from './LiveTrailLoader';
import { AidStation } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { extractRaceName } from '@/utils/liveTrailParser';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy, IconPlus, IconPrinter } from '@tabler/icons-react';
import { sortAndUpdateStations } from '@/utils/raceCalculations';
import { PrintAllStickersModal } from './PrintAllStickersModal';

export function RaceProfile() {
  const { profiles, selectedProfileId } = useStore(raceProfilesStore);
  const { selectedPlanId } = useStore(racePlanHistoryStore);
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [liveTrailUrl, setLiveTrailUrl] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const lastSavedStateRef = useRef<string | null>(null);
  const [printModalOpened, setPrintModalOpened] = useState(false);

  // Track changes by comparing current state with last saved state
  useEffect(() => {
    if (selectedProfile) {
      const currentState = JSON.stringify(selectedProfile);
      if (lastSavedStateRef.current === null) {
        lastSavedStateRef.current = currentState;
      }
    }
  }, [selectedProfile]);

  const hasUnsavedChanges = () => {
    if (!selectedProfile || lastSavedStateRef.current === null) return false;
    return JSON.stringify(selectedProfile) !== lastSavedStateRef.current;
  };

  const handleSave = () => {
    saveProfiles();
    if (selectedProfile) {
      lastSavedStateRef.current = JSON.stringify(selectedProfile);
    }
    notifications.show({
      title: 'Success',
      message: 'Race profile saved successfully',
      color: 'green'
    });
  };

  const handleCreateNew = () => {
    if (hasUnsavedChanges()) {
      setShowConfirmModal(true);
    } else {
      createNewProfile();
      notifications.show({
        title: 'Success',
        message: 'New race profile created',
        color: 'blue'
      });
    }
  };

  // Load selected race plan from history
  useEffect(() => {
    if (selectedPlanId) {
      const { plans } = racePlanHistoryStore.get();
      const selectedPlan = plans.find(plan => plan.raceProfile.name === selectedPlanId);
      if (selectedPlan) {
        // Update the race profile with the selected plan's data
        updateProfile(selectedPlan.raceProfile.id, selectedPlan.raceProfile);
        
        // Clear existing aid stations
        selectedProfile?.aidStations.forEach(station => {
          removeAidStation(selectedPlan.raceProfile.id, station.id);
        });
        
        // Add aid stations from the selected plan
        selectedPlan.raceProfile.aidStations.forEach(station => {
          addAidStation(selectedPlan.raceProfile.id, station);
        });
      }
    }
  }, [selectedPlanId, selectedProfile?.aidStations]);

  const handleTitleChange = (newTitle: string) => {
    if (!selectedProfile) return;
    
    // If the title has changed, create a new profile
    if (newTitle !== selectedProfile.name) {
      const newProfile = {
        ...selectedProfile,
        id: newTitle.toLowerCase().replace(/\s+/g, '-'),
        name: newTitle
      };
      
      // Add the new profile and select it
      raceProfilesStore.set({
        ...raceProfilesStore.get(),
        profiles: [...profiles.filter(p => p.id !== selectedProfile.id), newProfile],
        selectedProfileId: newProfile.id
      });
    }
    
    setIsEditingTitle(false);
  };

  const handleLiveTrailData = (data: any) => {
    if (!selectedProfile) return;
    
    // Extract race name from URL
    const raceName = extractRaceName(liveTrailUrl);
    
    // Update profile with new data
    updateProfile(selectedProfile.id, {
      ...selectedProfile,
      name: raceName || 'Unknown Race',
      totalDistance: data.totalDistance,
      totalElevationGain: data.totalElevationGain,
      startLocation: data.aidStations[0].name,
      finishLocation: data.aidStations[data.aidStations.length - 1].name,
      startElevation: data.aidStations[0].currentElevation,
    });

    // Clear existing aid stations
    selectedProfile.aidStations.forEach(station => {
      removeAidStation(selectedProfile.id, station.id);
    });

    // Add new aid stations
    data.aidStations.forEach((station: AidStation) => {
      addAidStation(selectedProfile.id, station);
    });
  };

  useEffect(() => {
    if (selectedProfile?.aidStations) {
      const updatedStations = sortAndUpdateStations(selectedProfile.aidStations);
      updateProfile(selectedProfile.id, { aidStations: updatedStations });
    }
  }, [selectedProfile?.aidStations, selectedProfile?.id]);

  if (!selectedProfile) return null;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <div>
          <Text size="xl" fw={700}>My Race</Text>
          {isEditingTitle ? (
            <TextInput
              size="xl"
              variant="unstyled"
              defaultValue={selectedProfile.name}
              onBlur={(e) => handleTitleChange(e.target.value)}
              autoFocus
            />
          ) : (
            <Title order={2} size="h1" onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer' }}>
              {selectedProfile.name}
            </Title>
          )}
          <Text size="sm" c="dimmed">
            {selectedProfile.startLocation} to {selectedProfile.finishLocation} • {selectedProfile.totalDistance}km • {selectedProfile.totalElevationGain}m D+
          </Text>
        </div>
        <Group gap="xs">
          <ActionIcon
            variant="filled"
            color="blue"
            size="lg"
            onClick={handleCreateNew}
          >
            <IconPlus size={20} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            color="green"
            size="lg"
            onClick={handleSave}
          >
            <IconDeviceFloppy size={20} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            color="blue"
            size="lg"
            onClick={() => setPrintModalOpened(true)}
          >
            <IconPrinter size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Card withBorder>
        <Stack gap="md">
          <LiveTrailLoader onLoad={handleLiveTrailData} url={liveTrailUrl} onUrlChange={setLiveTrailUrl} />
          <AidStationsTable
            data={selectedProfile.aidStations}
            onUpdate={(id, updates) => updateAidStation(selectedProfile.id, id, updates)}
            onAdd={(station) => addAidStation(selectedProfile.id, station)}
            onRemove={(id) => removeAidStation(selectedProfile.id, id)}
          />
        </Stack>
      </Card>

      <NutritionStrategy />

      <PrintAllStickersModal
        opened={printModalOpened}
        onClose={() => setPrintModalOpened(false)}
        stations={selectedProfile.aidStations}
      />

      <Modal
        opened={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Unsaved Changes"
        centered
      >
        <Stack>
          <Text>You have unsaved changes. Do you want to save them before creating a new race?</Text>
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
            <Button variant="light" color="red" onClick={() => {
              setShowConfirmModal(false);
              createNewProfile();
              notifications.show({
                title: 'Success',
                message: 'New race profile created',
                color: 'blue'
              });
            }}>Discard</Button>
            <Button onClick={() => {
              handleSave();
              setShowConfirmModal(false);
              createNewProfile();
              notifications.show({
                title: 'Success',
                message: 'New race profile created',
                color: 'blue'
              });
            }}>Save & Create New</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
} 