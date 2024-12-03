import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const CustomCheckbox = ({ label, checked, onChange, star, name, value }) => {
  const formGroupStyle = {
    display: "flex",
    alignItems: "center",
    margin: "1rem 0"
  };

  const labelStyle = {
    flex: "1.3",
    textAlign: "left",
    marginRight: "0.5rem",
    fontSize: "0.8rem",
    fontWeight: "bold",
    whiteSpace: "nowrap"
  };

  const checkboxContainerStyle = {
    flex: "3.4",
    display: "flex",
    alignItems: "center"
  };

  const mediaQuery = `
    @media (max-width: 767px) {
      .custom-checkbox {
        flex-direction: column;
        align-items: flex-start;
      }    
      .checkbox-label {
        margin-right: 0;
        width: 100%;
      }
      .form-control-label {
        width: 100%;
      }
    }
  `;

  return (
    <div style={formGroupStyle} className="custom-checkbox">
      <label style={labelStyle} className="checkbox-label">
        {label} {star && <span style={{ color: "red" }}>*</span>}
      </label>
      <div style={checkboxContainerStyle}>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              value={value}
              onChange={onChange}
              checked={checked}
              sx={{ color: "lightgrey", "&.Mui-checked": { color: "green" } }}
            />
          }
          style={{
            flex: "1.7",
            marginBottom: "0",
            marginLeft: "8px",
            display: "flex",
            alignItems: "center"
          }}
        />
      </div>
      <style>
        {mediaQuery}
      </style>
    </div>
  );
};

export default CustomCheckbox;
