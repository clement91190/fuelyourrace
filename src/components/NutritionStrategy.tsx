import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FoodItem, RacePlan } from '../types';
import { Settings, VolumeUnit } from '../types/settings';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface NutritionStrategyProps {
  racePlan: RacePlan;
  settings: Settings;
}

interface NutritionDataPoint {
  time: string;
  distance: number;
  sodium: number;
  sodiumPerHour: number;
  volume: number;
  volumePerHour: number;
}

export const NutritionStrategy: React.FC<NutritionStrategyProps> = ({ racePlan, settings }) => {
  const calculateNutritionData = (): NutritionDataPoint[] => {
    const dataPoints: NutritionDataPoint[] = [];
    let totalSodium = 0;
    let totalVolume = 0;
    let previousTime = new Date(0);
    let previousDistance = 0;

    racePlan.foodItems.forEach((item) => {
      const aidStation = racePlan.raceProfile.aidStations.find(
        (station) => station.id === item.aidStationId
      );
      if (!aidStation) return;

      const currentTime = new Date(`1970-01-01T${aidStation.estimatedTimeFromStart}`);
      const timeDiffHours = (currentTime.getTime() - previousTime.getTime()) / (1000 * 60 * 60);
      const distanceDiff = aidStation.distanceFromStart - previousDistance;

      // Calculate nutrition values
      const sodiumAmount = item.foodItem.nutritionFacts.sodium * item.quantity;
      const volumeAmount = (item.foodItem.nutritionFacts.volume || 0) * item.quantity;

      totalSodium += sodiumAmount;
      totalVolume += volumeAmount;

      // Calculate rates
      const sodiumPerHour = timeDiffHours > 0 ? totalSodium / timeDiffHours : 0;
      const volumePerHour = timeDiffHours > 0 ? totalVolume / timeDiffHours : 0;

      dataPoints.push({
        time: aidStation.estimatedTimeFromStart,
        distance: aidStation.distanceFromStart,
        sodium: totalSodium,
        sodiumPerHour,
        volume: totalVolume,
        volumePerHour,
      });

      previousTime = currentTime;
      previousDistance = aidStation.distanceFromStart;
    });

    return dataPoints;
  };

  const data = calculateNutritionData();
  const volumeUnit = settings.volumeUnit;
  const volumeConversion = volumeUnit === VolumeUnit.OUNCES ? 0.033814 : 1;

  const chartData = {
    labels: data.map((point) => point.time),
    datasets: [
      {
        label: 'Sodium (mg)',
        data: data.map((point) => point.sodium),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Sodium (mg/hour)',
        data: data.map((point) => point.sodiumPerHour),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
        borderDash: [5, 5],
      },
      {
        label: `Volume (${volumeUnit})`,
        data: data.map((point) => point.volume * volumeConversion),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y2',
      },
      {
        label: `Volume (${volumeUnit}/hour)`,
        data: data.map((point) => point.volumePerHour * volumeConversion),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y3',
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Sodium (mg)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Sodium (mg/hour)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: `Volume (${volumeUnit})`,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: `Volume (${volumeUnit}/hour)`,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Nutrition Strategy</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance (km)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sodium (mg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sodium (mg/hour)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume ({volumeUnit})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume ({volumeUnit}/hour)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((point, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{point.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {point.distance.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {point.sodium.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {point.sodiumPerHour.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(point.volume * volumeConversion).toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(point.volumePerHour * volumeConversion).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Nutrition Strategy Graph</h2>
        <div className="h-[400px]">
          <Line options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
}; 