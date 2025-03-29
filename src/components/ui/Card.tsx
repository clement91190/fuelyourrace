import { Card as MantineCard, CardProps as MantineCardProps } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface CardProps extends MantineCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const Card: FC<CardProps> = ({ children, title, subtitle, ...props }) => {
  return (
    <MantineCard
      styles={{
        root: {
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          marginBottom: '1rem'
        }
      }}
      {...props}
    >
      {title && (
        <h3 style={{ 
          margin: '0 0 0.5rem 0',
          color: 'var(--primary-color)',
          fontFamily: 'var(--heading-font)'
        }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p style={{ 
          margin: '0 0 1rem 0',
          color: 'var(--text-color)',
          opacity: 0.8
        }}>
          {subtitle}
        </p>
      )}
      {children}
    </MantineCard>
  );
}; 