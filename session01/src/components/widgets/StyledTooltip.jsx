import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#111827",
    color: "#E5E7EB",
    fontSize: 12,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(167,139,250,.35)",
    boxShadow: "0 10px 30px rgba(0,0,0,.35)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#111827",
    "&:before": {
      border: "1px solid rgba(167,139,250,.35)",
    },
  },
}));
