export const formatDate = (dateString, withTime = false) => {
  if (!dateString) return "-";

  const options = withTime
    ? {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

  return new Intl.DateTimeFormat("fr-FR", options).format(
    new Date(dateString)
  );
};
