import { Group, Select, NumberInput, TextInput, Text, Button } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { IconCheck } from '@tabler/icons-react';

interface ValueEditorProps {
  absoluteValue: number | string;
  deltaValue: number | string;
  mode: 'absolute' | 'delta';
  onModeChange: (mode: 'absolute' | 'delta') => void;
  onValueChange: (value: number | string) => void;
  type: 'number' | 'time';
  min?: number;
  step?: number;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ValueEditor({
  absoluteValue,
  deltaValue,
  mode,
  onModeChange,
  onValueChange,
  type,
  min,
  step,
  placeholder,
  autoFocus = false,
}: ValueEditorProps) {
  const [currentValue, setCurrentValue] = useState<number | string>(mode === 'absolute' ? absoluteValue : deltaValue);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentValue(mode === 'absolute' ? absoluteValue : deltaValue);
  }, [mode, absoluteValue, deltaValue]);

  return (
    <Group gap="xs" ref={editorRef}>
      <Select
        size="xs"
        value={mode}
        onChange={(value) => onModeChange(value as 'absolute' | 'delta')}
        data={[
          { value: 'absolute', label: 'Since Start' },
          { value: 'delta', label: 'Segment' },
        ]}
      />
      {type === 'number' ? (
        <NumberInput
          value={currentValue as number}
          onChange={(value) => setCurrentValue(value)}
          min={min}
          step={step}
          autoFocus={autoFocus}
        />
      ) : (
        <TextInput
          value={currentValue as string}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      )}
      <Button
        size="xs"
        variant="light"
        color="green"
        onClick={() => onValueChange(currentValue)}
        leftSection={<IconCheck size={14} />}
      >
        Apply
      </Button>
    </Group>
  );
} 