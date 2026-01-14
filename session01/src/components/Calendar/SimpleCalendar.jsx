import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box } from "@mui/material";

export default function SimpleCalendar() {
  return (
    <Box
      sx={{
        "& .react-calendar": {
          width: "100%",
          background: "transparent",
          border: "none",
          color: "inherit",
        },
        "& .react-calendar__tile--active": {
          background: "#7c3aed",
          color: "#fff",
          borderRadius: 1,
        },
      }}
    >
      <Calendar />
    </Box>
  );
}
