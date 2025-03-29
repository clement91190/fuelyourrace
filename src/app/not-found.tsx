import { Container, Title, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="md">404 - Page Not Found</Title>
      <Text ta="center" mb="xl">
        Sorry, we couldn't find the page you're looking for.
      </Text>
      <Group justify="center">
        <Link href="/" passHref>
          <Button component="a">
            Return Home
          </Button>
        </Link>
      </Group>
    </Container>
  );
} 