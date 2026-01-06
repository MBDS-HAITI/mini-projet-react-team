import { TableContainer } from "@mui/material";

export default function ResponsiveTableContainer({ children, sx }) {
  return (
    <TableContainer
      sx={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.12)",
        backgroundColor: "transparent",
        ...sx,
      }}
    >
      {children}
    </TableContainer>
  );
}
