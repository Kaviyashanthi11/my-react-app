import React from "react";
import PropTypes from "prop-types";
import { FormSelect } from "react-bootstrap";

const CustomSelect = React.forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      options = [],
      star = false,
      disabled,
      required,
      width = "100%"
    },
    ref
  ) => {
    const [isButtonFocused, setButtonFocused] = React.useState(false);

    // Style objects
    const formGroup = {
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
    const inputContainerStyle = {
      flex: "3",
      position: "relative"
    };
    const commonSelectStyle = {
      height: "1.7rem",
      fontSize: "0.9rem",
      backgroundColor: "white",
      width: width || "100%",
      border: isButtonFocused ? "2px solid #1449E9" : "1px solid #9e9e9e",
      boxSizing: "border-box",
      padding: "0.2rem",
      borderRadius: "0.25rem"
    };
    const requiredAsteriskStyle = {
      color: "red",
      marginLeft: "0.2rem",
      fontSize: "1.1rem"
    };

    const handleButtonBlur = () => {
      setButtonFocused(false);
    };
    const handleButtonFocus = () => {
      setButtonFocused(true);
    };

    return (
      <div style={formGroup} className="form-group">
        {label &&
          <label style={labelStyle} className="label">
            {label}
            {star && <span style={requiredAsteriskStyle}>*</span>}
          </label>}
        <div style={inputContainerStyle} className="input-container">
          <FormSelect
            {...{ name, value, onChange }}
            ref={ref}
            size="small"
            style={commonSelectStyle}
            className="form-control"
            onFocus={handleButtonFocus}
            onBlur={handleButtonBlur}
            disabled={disabled}
          >
            {options.map(option =>
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )}
          </FormSelect>
        </div>

        {/* Add media query for responsiveness */}
        <style>
          {`@media (max-width: 767px) {
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
          }`}
        </style>
      </div>
    );
  }
);

// PropTypes for type checking
CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  star: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  width: PropTypes.string
};

export default CustomSelect;
