export const formatHoursToHHMM = (decimalHours) => {
  if (decimalHours === null || decimalHours === undefined || decimalHours === "-") return "-";

  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};
