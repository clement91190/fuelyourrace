import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';
import { FC } from 'react';

interface ButtonProps extends MantineButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary-color)',
          '&:hover': { backgroundColor: '#1B5E20' }
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--secondary-color)',
          '&:hover': { backgroundColor: '#E65100' }
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: '2px solid var(--primary-color)',
          color: 'var(--primary-color)',
          '&:hover': {
            backgroundColor: 'var(--primary-color)',
            color: 'white'
          }
        };
      default:
        return {};
    }
  };

  return (
    <MantineButton
      styles={{
        root: {
          ...getVariantStyles(),
          transition: 'all 0.2s ease',
          borderRadius: '4px',
          padding: '0.75rem 1.5rem',
          fontWeight: 500
        }
      }}
      {...props}
    >
      {children}
    </MantineButton>
  );
}; 