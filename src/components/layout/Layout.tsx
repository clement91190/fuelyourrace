import { FC, ReactNode, useState } from 'react';
import { AppShell, Text, useMantineTheme, useMantineColorScheme, Group, Button, ActionIcon } from '@mantine/core';
import { IconSun, IconMoonStars, IconMountain, IconCookie, IconSettings, IconHistory } from '@tabler/icons-react';
import { SettingsModal } from '../settings/SettingsModal';
import { HistoryDrawer } from '../HistoryDrawer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [historyOpened, setHistoryOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background: dark ? theme.colors.dark[8] : theme.colors.gray[0],
        },
        header: {
          background: 'transparent',
          borderBottom: 'none',
          position: 'absolute',
          width: '100%',
          zIndex: 100,
        },
      }}
      header={{
        height: 70
      }}
      padding={0}
    >
      <AppShell.Header p="md">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Group gap="xl" style={{ flex: 1 }}>
            <IconMountain size={24} color={theme.colors.green[6]} />
            <Text size="xl" fw={700} style={{ 
              background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Fuel Your Race
            </Text>
          </Group>

          <Group gap="md">
            <Button 
              variant="subtle" 
              color="green" 
              leftSection={<IconCookie size={16} />}
              onClick={() => {}}
            >
              Food Items
            </Button>
            <Button 
              variant="subtle" 
              color="green" 
              leftSection={<IconHistory size={16} />}
              onClick={() => setHistoryOpened(true)}
            >
              History
            </Button>
            <ActionIcon
              variant="subtle"
              color="green"
              onClick={() => setSettingsOpened(true)}
            >
              <IconSettings size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="green"
              onClick={() => setColorScheme(dark ? 'light' : 'dark')}
            >
              {dark ? <IconSun size={16} /> : <IconMoonStars size={16} />}
            </ActionIcon>
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <SettingsModal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
      />

      <HistoryDrawer
        opened={historyOpened}
        onClose={() => setHistoryOpened(false)}
      />
    </AppShell>
  );
}; 