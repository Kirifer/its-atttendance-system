export const formatHoursToHHMM = (decimalHours) => {
  if (decimalHours === null || decimalHours === undefined || decimalHours === "-") return "-";

  const totalMinutes = Math.floor(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export function formatHoursToHHMMFromMinutes(minutes) {
  if (minutes == null) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  
  return `${h}:${m.toString().padStart(2, "0")}`;
}
