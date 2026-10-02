const NOW = Date.now();

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const ago = (minutes: number) => new Date(NOW - minutes * MINUTE).toISOString();
export const agoHours = (hours: number) => new Date(NOW - hours * HOUR).toISOString();
export const agoDays = (days: number) => new Date(NOW - days * DAY).toISOString();
export const aheadDays = (days: number) => new Date(NOW + days * DAY).toISOString();
