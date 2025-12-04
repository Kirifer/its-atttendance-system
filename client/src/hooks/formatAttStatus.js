export const formatAttStatus = (attStatus) =>
  attStatus
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());