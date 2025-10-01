import type { Bar, DayOfWeek } from '../types/bar';

/**
 * Check if a bar is currently open
 * @param bar - The bar object with hours information
 * @param now - Current date/time (defaults to new Date())
 * @param timezone - Timezone string (defaults to 'America/Los_Angeles')
 * @returns boolean indicating if the bar is currently open
 */
export function isOpenNow(
  bar: Bar,
  now: Date = new Date(),
  timezone: string = 'America/Los_Angeles'
): boolean {
  try {
    // Get current time in the specified timezone
    const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const currentDay = getDayOfWeek(localTime);
    const currentTime = formatTime(localTime);

    const todayHours = bar.hours[currentDay];
    if (!todayHours || todayHours.length === 0) {
      return false; // Closed if no hours defined
    }

    // Check if current time falls within any of the hour ranges for today
    return todayHours.some(range =>
      isTimeInRange(currentTime, range.open, range.close)
    );
  } catch (error) {
    console.error('Error checking if bar is open:', error);
    return false;
  }
}

/**
 * Get day of week abbreviation from Date object
 */
function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

/**
 * Format time as HH:mm string
 */
function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5); // HH:mm format
}

/**
 * Check if current time is within open/close range, handling overnight hours
 * @param currentTime - Current time in HH:mm format
 * @param openTime - Opening time in HH:mm format
 * @param closeTime - Closing time in HH:mm format
 * @returns boolean indicating if time is within range
 */
function isTimeInRange(currentTime: string, openTime: string, closeTime: string): boolean {
  const [currentHour, currentMin] = currentTime.split(':').map(Number);
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);

  const currentMinutes = currentHour * 60 + currentMin;
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  // Handle overnight hours (e.g., 22:00 to 02:00)
  if (closeMinutes < openMinutes) {
    // Overnight: open if current time >= open OR current time <= close
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    // Same day: open if current time >= open AND current time <= close
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }
}