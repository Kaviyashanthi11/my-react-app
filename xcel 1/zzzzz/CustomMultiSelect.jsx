import React from 'react';
import { Form } from 'react-bootstrap';
import { Autocomplete, TextField, FormControl, Grid } from '@mui/material';

const CustomMultiSelect = ({ options, value, onChange, name, label, star }) => {
  return (
    <Grid item xs={12} container alignItems="center">
      <Grid item xs={4}>
        <Form.Label>
          {label} {star && <span style={{ color: 'red' }}>*</span>}
        </Form.Label>
      </Grid>
      <Grid item xs={8}>
        <FormControl fullWidth>
          <Autocomplete
            multiple
            size='small'
            options={options}
            getOptionLabel={(option) => option.label}
            value={
              value && typeof value === "string"
                ? options.filter((option) =>
                    value
                      .split(",")
                      .includes(option.value.toString())
                  )
                : value || []
            }
            onChange={(event, newValue) => {
              onChange({
                target: {
                  name: name,
                  value: newValue.length > 0
                    ? newValue.map((option) => option.value).join(",")
                    : "", // Use an empty string instead of an empty array
                },
              });
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
            style={{ flex: '1.5', marginLeft: '44px' }}
            star={star}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default CustomMultiSelect;
