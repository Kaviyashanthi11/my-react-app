import React from "react";
import { Form } from "react-bootstrap";
import { Autocomplete, TextField, FormControl, Grid } from "@mui/material";

const CustomMultiSelect = ({ options, value, onChange, name, label, star }) => {
  return (
    <Grid item xs={12} container alignItems="center">
      <Grid item xs={4}>
        <Form.Label>
          {label} {star && <span style={{ color: "red" }}>*</span>}
        </Form.Label>
      </Grid>
      <Grid item xs={8}>
        <FormControl fullWidth>
          <Autocomplete
            multiple
            size="small"
            options={options}
            getOptionLabel={option => option.label}
            value={value || []} // Ensure value is an array
            onChange={(event, newValue) => {
              onChange({
                target: {
                  name: name,
                  value: newValue // Pass the array of selected options
                }
              });
            }}
            renderInput={params => <TextField {...params} variant="outlined" />}
            style={{ flex: "1.6", marginLeft: "40px" }}
            required={star}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default CustomMultiSelect;
