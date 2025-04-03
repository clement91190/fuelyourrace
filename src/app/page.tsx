'use client';

import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Container } from '@mantine/core';
import { Pantry } from '../components/Pantry';
import { RaceProfile } from '../components/race/RaceProfile';

export default function Home() {
  return (
    <Layout>
      <div style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '70vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }} />
      <HeroSection />
      <FeaturesSection />
      
      <Container size="xl" py="xl">
        <Pantry />
      </Container>

      <Container size="xl" py="xl">
        <RaceProfile />
      </Container>
    </Layout>
  );
} 