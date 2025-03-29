import { AidStation } from '../types';

export function parseTime(timeStr: string): number {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateEstimatedTime(distance: number, pace: number): string {
  const seconds = distance * pace * 60;
  return formatTime(seconds);
}

export function calculatePace(distance: number, timeStr: string): number {
  const seconds = parseTime(timeStr);
  return seconds / (distance * 60);
}

export function sortAndUpdateStations(stations: AidStation[]): AidStation[] {
  return stations.sort((a, b) => a.distanceFromStart - b.distanceFromStart);
}

export function updateStationTimes(stations: AidStation[], updatedStationId: string, newTime: string): AidStation[] {
  const updatedStationIndex = stations.findIndex(s => s.id === updatedStationId);
  if (updatedStationIndex === -1) return stations;

  const updatedStation = stations[updatedStationIndex];
  const updatedStationTime = parseTime(newTime);
  const updatedStationDistance = updatedStation.distanceFromStart;

  return stations.map((station, index) => {
    if (index === updatedStationIndex) {
      return { ...station, estimatedTimeFromStart: newTime };
    }

    if (index > updatedStationIndex) {
      // For stations after the updated one, recalculate their times based on the new pace
      const distanceDiff = station.distanceFromStart - updatedStationDistance;
      const pace = calculatePace(distanceDiff, newTime);
      const timeDiff = distanceDiff * pace * 60;
      const newStationTime = updatedStationTime + timeDiff;
      return { ...station, estimatedTimeFromStart: formatTime(newStationTime) };
    }

    return station;
  });
}

export function calculateSegmentDetails(stations: AidStation[], currentIndex: number) {
  if (currentIndex === 0) {
    return {
      timeFromPrevious: '00:00:00',
      paceMinPerKm: 0
    };
  }

  const currentStation = stations[currentIndex];
  const previousStation = stations[currentIndex - 1];
  const distanceDiff = currentStation.distanceFromStart - previousStation.distanceFromStart;
  const timeDiff = parseTime(currentStation.estimatedTimeFromStart) - parseTime(previousStation.estimatedTimeFromStart);
  const paceMinPerKm = timeDiff / (distanceDiff * 60);

  return {
    timeFromPrevious: formatTime(timeDiff),
    paceMinPerKm
  };
} 