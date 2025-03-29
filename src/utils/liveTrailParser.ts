import { AidStation } from '@/types';

interface ParsedLiveTrailData {
  aidStations: AidStation[];
  totalDistance: number;
  totalElevationGain: number;
}

export function parseLiveTrailHtml(html: string): ParsedLiveTrailData {
  // Create a temporary div to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find the tpass table
  const table = doc.querySelector('.tpass');
  if (!table) {
    throw new Error('Could not find timing points table');
  }

  // Get all rows except the header
  const rows = Array.from(table.querySelectorAll('tr')).slice(1);
  if (rows.length === 0) {
    throw new Error('No timing points found');
  }

  // Parse each row into an aid station
  const aidStations: AidStation[] = rows.map((row, index) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 5) {
      throw new Error('Invalid row format');
    }

    // Extract elevation from the first cell
    const elevationCell = cells[0].querySelector('.rig');
    if (!elevationCell) {
      throw new Error('Elevation not found');
    }
    const elevationText = elevationCell.textContent || '';
    const elevation = parseInt(elevationText.replace(/[^0-9]/g, ''));

    // Extract name from the first cell
    const nameCell = cells[0].querySelector('a');
    if (!nameCell) {
      throw new Error('Name not found');
    }
    const name = nameCell.textContent || '';

    // Extract time from the last cell
    const timeCell = cells[4].querySelector('.rig');
    if (!timeCell) {
      throw new Error('Time not found');
    }
    const time = timeCell.textContent || '00:00:00';

    // Calculate distance from speed and time
    const speedCell = cells[1].querySelector('.rig');
    if (!speedCell) {
      throw new Error('Speed not found');
    }
    const speedText = speedCell.textContent || '';
    const speed = parseFloat(speedText.replace(/[^0-9.]/g, ''));
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const timeInHours = hours + minutes / 60 + seconds / 3600;
    const distance = speed * timeInHours;

    // Get elevation gain from the d attribute in the XML
    const elevationGain = parseInt(row.getAttribute('d') || '0');

    return {
      id: `station-${index}`,
      name,
      distanceFromStart: distance,
      elevationFromStart: elevationGain,
      currentElevation: elevation,
      estimatedTimeFromStart: time,
      assistanceAllowed: true,
      foodItems: []
    } as AidStation;
  });

  // Calculate total distance and elevation gain
  if (aidStations.length === 0) {
    throw new Error('No aid stations found');
  }
  const lastStation = aidStations[aidStations.length - 1] as AidStation;
  const firstStation = aidStations[0] as AidStation;
  if (!lastStation || !firstStation) {
    throw new Error('Invalid aid stations array');
  }
  const totalDistance = lastStation.distanceFromStart;
  const totalElevationGain = lastStation.elevationFromStart; // Use the elevation gain from the last station

  return {
    aidStations,
    totalDistance,
    totalElevationGain
  };
}

export function validateLiveTrailUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === 'livetrail.net' &&
      parsedUrl.pathname.startsWith('/histo/') &&
      parsedUrl.pathname.includes('/coureur.php') &&
      parsedUrl.searchParams.has('rech')
    );
  } catch {
    return false;
  }
}

export function extractRaceName(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');
    const raceIndex = pathParts.indexOf('histo') + 1;
    if (raceIndex < pathParts.length) {
      return pathParts[raceIndex]
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return '';
  } catch {
    return '';
  }
} 