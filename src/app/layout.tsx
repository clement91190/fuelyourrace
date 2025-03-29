'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useState } from 'react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/globals.css';
import { Montserrat, Open_Sans } from 'next/font/google';

type ColorScheme = 'light' | 'dark';

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});   

const openSans = Open_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
});





export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  void setColorScheme;

  return (
      <html lang="en" className={`${montserrat.className} ${openSans.className}`}>
      <head>
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