import React from "react";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

const CustomTextArea = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
  star,
  width = "100%"
}) => {
  const [isButtonFocused, setButtonFocused] = React.useState(false);

  // Custom styles
  const labelStyle = {
    flex: "1.3",
    textAlign: "left",
    marginRight: "0.5rem",
    fontSize: "0.8rem",
    fontWeight: "bold",
    whiteSpace: "nowrap"
  };

  const formGroup = {
    display: "flex",
    alignItems: "flex-start",
    margin: "1rem 0"
  };

  const inputContainerStyle = {
    flex: "3",
    position: "relative"
  };

  const commonInputStyle = {
    fontSize: "0.9rem",
    width: width,
    boxSizing: "border-box",
    border: `${isButtonFocused ? "0px" : "1px"} solid ${isButtonFocused
      ? "#1449E9"
      : "#9e9e9e"}`,
    resize: "vertical",
    height: "3.5rem" // Adjust height as needed
  };

  const asteriskStyle = {
    color: "red",
    fontSize: "1.1rem"
  };

  const handleTextareaChange = event => {
    const { name, value } = event.target;
    onChange({ target: { name, value } });
  };

  const mediaQuery = `@media (max-width: 767px) {
    .form-group {
      flex-direction: column;
      align-items: flex-start;
    }
    .label {
      margin-right: 0;
      width: 100%;
    }
    .input-container {
      width: 100%;
    }
    .form-control {
      width: 100%;
      border-color: #9e9e9e;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
    }
  }`;

  const handleButtonBlur = () => {
    setButtonFocused(false);
  };

  const handleButtonFocus = () => {
    setButtonFocused(true);
  };

  return (
    <FormGroup style={formGroup} className="form-group">
      <FormLabel style={labelStyle} className="label">
        {label}
        {star && <span style={asteriskStyle}>*</span>}
      </FormLabel>
      <div style={inputContainerStyle} className="input-container">
        <FormControl
          as="textarea"
          style={commonInputStyle}
          name={name}
          value={value}
          onChange={handleTextareaChange}
          onFocus={handleButtonFocus}
          onBlur={handleButtonBlur}
          rows={rows}
          tabIndex="0"
          className="form-control"
          star
        />
      </div>
      <style>
        {mediaQuery}
      </style>
    </FormGroup>
  );
};

export default CustomTextArea;
