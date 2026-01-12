import { Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../theme/ThemeContextProvider";

const ThemeModeToggle = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <IconButton sx={{ m: 0 }} onClick={toggleColorMode} color="inherit">
      {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeModeToggle;
