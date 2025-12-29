

// helpers
export const toDateInputValue = (isoOrDateLike) => {
  if (!isoOrDateLike) return "";
  const d = new Date(isoOrDateLike);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const toISOStartOfDay = (yyyy_mm_dd) => new Date(`${yyyy_mm_dd}T00:00:00.000Z`).toISOString();
export const toISOEndOfDay = (yyyy_mm_dd) => new Date(`${yyyy_mm_dd}T23:59:59.000Z`).toISOString();