import { ResponsiveBar } from '@nivo/bar';
import { Card } from '@mantine/core';
import { NutritionData, DisplayMode, MetricType } from './types';
import { Settings, VolumeUnit } from '@/types/settings';

interface NutritionChartProps {
  data: NutritionData[];
  displayMode: DisplayMode;
  selectedMetric: MetricType;
  displayLabel: string;
  settings: Settings;
}

export function NutritionChart({ 
  data, 
  displayMode, 
  selectedMetric, 
  displayLabel,
  settings 
}: NutritionChartProps) {
  const dataKey = displayMode === 'rate' ? `${selectedMetric}PerHour` : selectedMetric;
  const volumeConversion = settings.volumeUnit === VolumeUnit.OUNCES ? 0.033814 : 1;

  // Transform data to match Nivo's requirements
  const chartData = data.map(item => ({
    ...item,
    [dataKey]: selectedMetric === 'volume' 
      ? (item[dataKey as keyof NutritionData] as number) * volumeConversion 
      : item[dataKey as keyof NutritionData]
  }));

  const getDisplayLabel = () => {
    if (selectedMetric === 'volume') {
      return `${displayLabel} (${settings.volumeUnit})`;
    }
    return displayLabel;
  };

  return (
    <Card withBorder style={{ height: 400 }}>
      <ResponsiveBar
        data={chartData}
        keys={[dataKey]}
        indexBy="displayName"
        margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        colors={['#2E7D32']}
        valueFormat=".2f"
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Section',
          legendPosition: 'middle',
          legendOffset: 40,
          truncateTickAt: 0
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: getDisplayLabel(),
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        role="application"
        ariaLabel="Nutrition chart"
      />
    </Card>
  );
} 