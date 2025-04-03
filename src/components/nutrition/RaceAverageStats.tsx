import { Card, Text, Group, Stack, SimpleGrid, Anchor } from '@mantine/core';
import { 
  IconBread, 
  IconFlame, 
  IconMeat, 
  IconSalt, 
  IconDroplet, 
  IconCoffee 
} from '@tabler/icons-react';
import { useState } from 'react';
import Image from 'next/image';

export type MetricType = 'carbs' | 'calories' | 'protein' | 'sodium' | 'volume' | 'caffeine';

interface StatRange {
  min: number;
  max: number;
  message: string;
  color: string;
  gif: string;
  referenceLink?: string;
}

type StatRanges = Partial<Record<MetricType, StatRange[]>>;

const statRanges: StatRanges = {
  carbs: [
    {
      min: 0,
      max: 30,
      message: `Very low carbs – risk of bonking. 
        For most endurance events, aim at least for 30g/hour. `,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media.giphy.com/media/Qh4FSYVY3jvmeVjRur/giphy.gif',
    },
    {
      min: 30,
      max: 50,
      message: `On the low side. You might get by, but you could fade later in long events. 
        Gut training can help increase this.`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDN5andvZWV4ZTJyeTdiYXlubXZ1bHhtYWdnM3FrdTg1NWZzM3czZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JhGpctXTwm4FlJr2Yn/giphy.gif',
    },
    {
      min: 50,
      max: 90,
      message: `Good range – enough for stable energy for most. 
        Elites often go for 60-90g/hour with proper gut training. Though some might go higher.`,
      color: 'var(--mantine-color-teal-6)',
      gif: 'https://media.giphy.com/media/QKUTD5lAgpgrSHpbMB/giphy.gif',
    },
    {
      min: 90,
      max: 110,
      message: `High intake – can boost performance if well-tolerated, but watch for GI distress`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWliZDh1cjVteHNka2I5YWt4bjV4YzYxbzBra2JzYXF2MGlnMmxueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CGYEGOGSawxgY/giphy.gif',
    },
    {
      min: 110,
      max: Infinity,
      message: `Excessive – risk GI issues. Most can't absorb this much.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3E0b3NjNGFkNzJ5cW44bHRjMjRlN29ycHFkcTRvd2k2MzMxcXU4NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eSQKNSmg07dHq/giphy.gif',
    },
  ],
  calories: [
    {
      min: 0,
      max: 150,
      message: `Too low – big energy deficit likely. 
        Consider boosting to maintain performance unless it is for sub 3 hour effort.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExajFmcTZvdWZhcTY1NHE0bHNmMXRkZnBpOGp5NjE0aDJnd3hrc3hoNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BGqofNXjxluwX0k/giphy.gif',
    },
    {
      min: 150,
      max: 250,
      message: `Borderline – may work for shorter efforts, but often not enough for ultras.`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media.giphy.com/media/3ml7z67MP4RKI52tQ0/giphy.gif',
    },
    {
      min: 250,
      max: 350,
      message: `Generally optimal for most. Helps sustain longer efforts without overloading.`,
      color: 'var(--mantine-color-teal-6)',
      gif: 'https://media.giphy.com/media/QKUTD5lAgpgrSHpbMB/giphy.gif',
    },
    {
      min: 350,
      max: 450,
      message: `High end – could benefit big or elite athletes if they can tolerate it. 
        Watch for GI issues.`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media.giphy.com/media/ifZW86clxZIs0/giphy.gif',
    },
    {
      min: 450,
      max: Infinity,
      message: `Excessive – risk of stomach overload.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media.giphy.com/media/sdUkEZjrNZfxAQOkWf/giphy.gif',
    },
  ],
  protein: [
    {
      min: 0,
      max: Infinity,
      message: `Congrats, if you're tracking proteins, this means you are taking this seriously. You might find this article interesting. A general recommendation: When you're on the trail training for over three hours, eating some protein can prevent your body from breaking down muscle proteins for energy. Even a small amount of protein, around five to 10 grams per hour, should be helpful during training runs over three hours long.`,
      color: 'var(--mantine-color-teal-6)',
      gif: 'https://media.giphy.com/media/3ohhwi25ISXC7Z4tMs/giphy.gif?cid=790b7611o2kggeo9u6iuvg0fgkz6f3bbk5ocxzvffmae0uh3&ep=v1_gifs_search&rid=giphy.gif&ct=g',
      referenceLink: 'https://www.irunfar.com/protein-for-runners'
    },
  ],
  sodium: [
    {
      min: 0,
      max: 300,
      message: `Too low – risk of cramps`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWthb2I5Mm5ydWY4bjNiYnRvOWp6bzV1ajZha2N4eGgwbHFlNDZoYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JJpohoblvC5vGDe/giphy.gif',
    },
    {
      min: 300,
      max: 500,
      message: `On the lower end – might be okay in cooler conditions, but be cautious in heat.`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnFieXA4bmVzcWNjM2podHVpYm96YTdnMzZxdXAxaTF4bHY4aGk5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H2T3U241g0Gac/giphy.gif',
    },
    {
      min: 500,
      max: 800,
      message: `Ideal for most – helps maintain electrolyte balance and reduce cramping.`,
      color: 'var(--mantine-color-teal-6)',
      gif: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGM5a2FubzdncHFxbXZtZno1d2R5ajlyYTR2cTgxbjNjZWkzOXI2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7P4F86TAI9Kz7XYk/giphy.gif',
    },
    {
      min: 800,
      max: 1200,
      message: `High – for heavy sweaters or hot conditions. Watch for thirst and dryness.`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjRjb3Z2cm1mdWE0ODRlODE4dzViYmlsempzeWFlMHBoNTd5bmNwbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xGNBmSnSXdhykkwXfr/giphy.gif',
    },
    {
      min: 1200,
      max: Infinity,
      message: `Excessive – possible bloating or GI issues. Usually more than needed.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzJyZHRrcTZtczVsNWRzNmI3N2wybXF3Y3M2MTVsZ3prcTd1YjNhbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0G178iU2mvn08p44/giphy.gif',
    },
  ],
  volume: [
    {
      min: 0,
      max: 300,
      message: `Very low fluid – risk of dehydration, especially in heat.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmp5b3o1cnpzajZqZzRqbjE1d2cwemZoZTh1bXk0ZXJqaWNlb3p1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5nbDitnG0w4dSZzeQX/giphy.gif',
    },
    {
      min: 300,
      max: 500,
      message: `Borderline low – might be adequate in cooler temps but keep an eye on thirst.`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnFieXA4bmVzcWNjM2podHVpYm96YTdnMzZxdXAxaTF4bHY4aGk5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H2T3U241g0Gac/giphy.gif',
    },
    {
      min: 500,
      max: 750,
      message: `Optimal – common sweet spot to match sweat rate for most, still make sure to adapt based on the heat of the day`,
      color: 'var(--mantine-color-teal-6)',
      gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjdidzB4MWQ2N3ZibWF3bXhzM3Y3YTZxcDE4Z2M2czNpemc3bjM5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hTz61O60eSFvTxhNXx/giphy.gif',
    },
    {
      min: 750,
      max: 1000,
      message: `High – could be necessary in very hot conditions, but watch for sloshing or hyponatremia risk.`,
      color: 'var(--mantine-color-yellow-6)',
      gif: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHJyamE3bWtvNjU5aHpmNHNpN2F4Zm9ieGg2enU3ODJyMXl3dGxyeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u7PB8DaxyCWkOc8i1t/giphy.gif',
    },
    {
      min: 1000,
      max: Infinity,
      message: `Excessive – can lead to water overload.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnV1NWJza2ZxYjg0enRwOTN0djU5MWRoZHJqNTBybnJ0Mzc1bHY4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/K9122Rp8lIa4M/giphy.gif',
    },
  ],
  caffeine: [
    {
      min: 0,
      max: 10,
      message: `No or very minimal caffeine – you might feel sluggish, especially overnight. But might also be just fine.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG15NWx6ZXFpOGJwZzZsdm1ibmlybDBrZ25seDVrZjI0NmVxODE1aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NWg7M1VlT101W/giphy.gif',
    },
    {
      min: 10,
      max: 80,
      message: `Caffeine intake depends a lot on yourself, your race and your habits ! Make sure to test beforehand especially if you go on the 
      higher end ! `,
      color: 'var(--mantine-color-teal-6)',
      gif: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJzNnp4Mmpoemx2c21zZXQwNmhlY2huczFmZnd6ZjYxamR4b3Y4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/o75ajIFH0QnQC3nCeD/giphy.gif',
    },
    {
      min: 80,
      max: Infinity,
      message: `Excessive – likely to cause serious jitters, heart pounding, or nausea.`,
      color: 'var(--mantine-color-red-6)',
      gif: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExemRvcDRkbXpvY21kbjlreXBkdXZtcnhlOHNwYnZqcWVidnhmb21paSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7YCBqmYxtIRcVXeitJ/giphy.gif',
    },
  ],
};

interface RaceAverageStatsProps {
  data: Record<MetricType, number>;
}

export function RaceAverageStats({ data }: RaceAverageStatsProps) {
  const [selectedStat, setSelectedStat] = useState<MetricType | null>(null);

  const getStatMessage = (metric: MetricType, value: number) => {
    const ranges = statRanges[metric];
    if (!ranges) return null;
    return ranges.find((range: StatRange) => value >= range.min && value < range.max);
  };

  const getMetricIcon = (metric: MetricType) => {
    switch (metric) {
      case 'carbs':
        return <IconBread size={20} />;
      case 'calories':
        return <IconFlame size={20} />;
      case 'protein':
        return <IconMeat size={20} />;
      case 'sodium':
        return <IconSalt size={20} />;
      case 'volume':
        return <IconDroplet size={20} />;
      case 'caffeine':
        return <IconCoffee size={20} />;
      default:
        return null;
    }
  };

  return (
    <SimpleGrid cols={2} spacing="md">
      <Card shadow="sm" padding="lg" style={{ height: '600px', overflow: 'auto' }}>
        <Stack gap="md">
          <Text size="xl" fw={700}>
            Race Averages
          </Text>
          {Object.entries(data).map(([metric, value]) => (
            <Card
              key={metric}
              shadow="sm"
              padding="md"
              onMouseEnter={() => setSelectedStat(metric as MetricType)}
              onClick={() => setSelectedStat(metric as MetricType)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedStat === metric ? 'var(--mantine-color-gray-0)' : undefined
              }}
            >
              <Group justify="space-between">
                <Group gap="xs">
                  {getMetricIcon(metric as MetricType)}
                  <Text fw={500} tt="capitalize">
                    {metric}
                  </Text>
                </Group>
                <Text>{value.toFixed(1)} /hour</Text>
              </Group>
            </Card>
          ))}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" style={{ height: '600px', overflow: 'auto' }}>
        {selectedStat ? (
          <Stack gap="md">
            <Text size="xl" fw={700}>
              Analysis
            </Text>
            {(() => {
              const statInfo = getStatMessage(selectedStat, data[selectedStat]);
              if (!statInfo)
                return <Text>No analysis available for this metric.</Text>;

              const { message, color, gif, referenceLink } = statInfo;

              return (
                <>
                  <Text style={{ color }}>
                    {message}
                    {referenceLink && (
                      <Anchor href={referenceLink} target="_blank" rel="noopener noreferrer" underline="hover">
                        {' article'}
                      </Anchor>
                    )}
                  </Text>
                  {gif && (
                    <div style={{ 
                      height: '300px', 
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative'
                    }}>
                      <Image
                        src={gif}
                        alt="GIF representing the intake range"
                        fill
                        style={{ 
                          objectFit: 'contain',
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </Stack>
        ) : (
          <Text color="dimmed">Hover over a stat to see analysis</Text>
        )}
      </Card>
    </SimpleGrid>
  );
}
