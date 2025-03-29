'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useState } from 'react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/globals.css';

type ColorScheme = 'light' | 'dark';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider
          theme={{
            primaryColor: 'green',
            fontFamily: 'Open Sans, sans-serif',
            headings: { fontFamily: 'Montserrat, sans-serif' },
          }}
          defaultColorScheme={colorScheme}
        >
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
} 