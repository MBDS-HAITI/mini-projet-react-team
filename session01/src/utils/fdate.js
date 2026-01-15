export const formatDate = (dateString, withTime = false) => {
  if (!dateString) return "-";

  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";

  const baseOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC", // éviter les décalages d'un jour liés au fuseau
  };

  const options = withTime
    ? {
        ...baseOptions,
        hour: "2-digit",
        minute: "2-digit",
      }
    : baseOptions;

  return new Intl.DateTimeFormat("fr-FR", options).format(d);
};
