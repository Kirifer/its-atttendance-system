export function getUTCDay(date = new Date()) {
  // 1. Shift the input date by 8 hours to get PH Time
  const phDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  return new Date(
    Date.UTC(
      phDate.getUTCFullYear(),
      phDate.getUTCMonth(),
      phDate.getUTCDate(),
    ),
  );
}
