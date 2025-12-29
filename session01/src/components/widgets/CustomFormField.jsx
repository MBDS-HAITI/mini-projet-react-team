import { TextField } from "@mui/material";
import { fieldSx } from "../../utils/fieldStylesSx.js"; // adapte le chemin si besoin

/* --------------------------- small component helper -------------------------- */
export function FormField({
  formik,
  name,
  label,
  type = "text",
  shrinkLabel = false,
  select = false,
  children,
  disabled = false,
}) {
  const touched = formik.touched?.[name];
  const errorMsg = formik.errors?.[name];
  const hasError = Boolean(touched && errorMsg);

  return (
    <TextField
      sx={fieldSx}
      fullWidth
      type={type}
      name={name}
      label={label}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={hasError}
      helperText={touched ? errorMsg : ""}
      InputLabelProps={shrinkLabel ? { shrink: true } : undefined}
      select={select}
      disabled={disabled}
      SelectProps={
        select
          ? {
            MenuProps: {
              PaperProps: {
                sx: {
                  bgcolor: "#0b1220",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                },
              },
            },
          }
          : undefined
      }
    >
      {select ? children : null}
    </TextField>

  );
}
