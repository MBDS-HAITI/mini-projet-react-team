import TextField from "@mui/material/TextField";
import { fieldSx } from "../../utils/fieldStylesSx.js";

/* --------------------------- small component helper -------------------------- */
export function FormField({ formik, name, label, type = "text", shrinkLabel = false }) {
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
      InputLabelProps={shrinkLabel ? { shrink: true } : undefined} />
  );
}
