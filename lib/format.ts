// Lowercase to match brand voice.
const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

// today / tomorrow / weekday (within 6 days) / "month day" + " at <time>".
export function formatRelativeDateTime(d: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / 86_400_000,
  );

  let dayPart: string;
  if (diffDays === 0) dayPart = 'today';
  else if (diffDays === 1) dayPart = 'tomorrow';
  else if (diffDays >= 2 && diffDays <= 6) dayPart = WEEKDAYS[d.getDay()];
  else dayPart = `${MONTHS[d.getMonth()]} ${d.getDate()}`;

  return `${dayPart} at ${formatTime(d)}`;
}

function formatTime(d: Date): string {
  const hours24 = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours24 >= 12 ? 'pm' : 'am';
  const hours = hours24 % 12 || 12;
  return minutes === 0
    ? `${hours}${ampm}`
    : `${hours}:${String(minutes).padStart(2, '0')}${ampm}`;
}
