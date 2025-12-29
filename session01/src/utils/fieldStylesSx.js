/* ----------------------------- styles (factorisé) ----------------------------- */
export const dialogPaperSx = {
  bgcolor: "rgba(15, 23, 42, 0.92)",
  color: "white",
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(10px)",
};
export const titleSx = { color: "white", bgcolor: "rgba(0,0,0,0.15)" };
export const sectionSx = { bgcolor: "rgba(0,0,0,0.10)" };
export const fieldSx = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#a78bfa" },

  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.06)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&:hover fieldset": { borderColor: "rgba(167,139,250,0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#a78bfa" },
  },

  "& .MuiFormHelperText-root": { color: "#fca5a5" },

  // icône calendrier (type=date)
  "& input::-webkit-calendar-picker-indicator": {
    filter: "invert(1)",
    opacity: 0.8,
  },
};
export const checkboxSx = { color: "white", "&.Mui-checked": { color: "#a78bfa" } };
export const btnCancelSx = { bgcolor: "#1e3a8a" };
export const btnSaveSx = { bgcolor: "#701a75" };
