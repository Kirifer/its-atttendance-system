export function countWorkDays(records) {
  if (!records || !records.length) return {};

  const userMap = {};

  for (const r of records) {
    if (!userMap[r.userId]) userMap[r.userId] = [];
    userMap[r.userId].push(r);
  }

  const result = {};

  for (const userId in userMap) {
    const valid = userMap[userId].filter(
      (r) => r.status === "PRESENT" || r.status === "TARDY"
    );

    const uniqueDates = new Set(valid.map((r) => new Date(r.date).toDateString()));
    result[userId] = uniqueDates.size;
  }

  return result;
}
