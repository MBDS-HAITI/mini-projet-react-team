export const surfaceCardSx = (theme) => ({
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: theme.palette.background.paperGlass,
  boxShadow: theme.palette.effects?.containerShadow,
  backdropFilter: "blur(14px)",
  p: 3,
});
