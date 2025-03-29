'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { RaceProfileModal } from '@/components/home/RaceProfileModal';
import { Container } from '@mantine/core';
import { Pantry } from '../components/Pantry';
import { RaceProfile } from '../components/race/RaceProfile';

export default function Home() {
  const [raceModalOpened, setRaceModalOpened] = useState(false);

  const handleCreateRace = (data: any) => {
    console.log('Creating race profile:', data);
    setRaceModalOpened(false);
  };

  return (
    <Layout>
      <HeroSection 
        onCreateRace={() => setRaceModalOpened(true)}
      />
      <FeaturesSection />
      
      <Container size="xl" py="xl">
        <Pantry />
      </Container>

      <Container size="xl" py="xl">
        <RaceProfile />
      </Container>
      
      <RaceProfileModal
        opened={raceModalOpened}
        onClose={() => setRaceModalOpened(false)}
        onSubmit={handleCreateRace}
      />
    </Layout>
  );
} 