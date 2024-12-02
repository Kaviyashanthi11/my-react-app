import React, { useEffect, useState } from "react";

// Forward ref to allow parent component to set focus
const CustomTextField = React.forwardRef(
  ({ label, name, value, onChange, star = false, disabled, height, width, required, placeholder, readOnly, inputprops }, ref) => {
    const [isButtonFocused, setButtonFocused] = useState(false);

    // Styling
    const formGroup = {
      display: "flex",
      alignItems: "center",
      margin: "1rem 0",
    };

    const labelStyle = {
      flex: "1.3",
      textAlign: "left",
      marginRight: "0.5rem",
      fontSize: "0.8rem",
      fontWeight: "bold",
      whiteSpace: "nowrap",
    };

    const inputContainerStyle = {
      flex: "3",
      position: "relative",
    };

    const commonInputStyle = {
      height: height || "1.7rem",
      fontSize: "0.9rem",
      padding: "0.3rem",
      borderRadius: "0.25rem",
      border: `${isButtonFocused ? "0px" : "1px"} solid ${isButtonFocused ? "#1449E9" : "#9e9e9e"}`,
      width: width || "100%",
      boxSizing: "border-box",
      backgroundColor: disabled ? "#f2f2f2" : "transparent",
    };

    const requiredAsteriskStyle = {
      color: "red",
      fontSize: "1rem",
    };

    // Handle focus/blur events
    const handleButtonBlur = () => {
      setButtonFocused(false);
    };

    const handleButtonFocus = () => {
      setButtonFocused(true);
    };

    // Media query for smaller screens
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

    // Focus the input field when it mounts
    useEffect(() => {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }, [ref]);

    return (
      <div style={formGroup} className="form-group">
        {label && (
          <label style={labelStyle} className="label">
            {label}
            {star && <span style={requiredAsteriskStyle}>*</span>}
          </label>
        )}
        <div style={inputContainerStyle} className="input-container">
          <input
            type="text"
            className="form-control"
            ref={ref}
            style={commonInputStyle}
            placeholder={placeholder}
            value={value}
            readOnly={readOnly}
            name={name}
            onChange={onChange}
            disabled={disabled}
            onFocus={handleButtonFocus}
            onBlur={handleButtonBlur}
            tabIndex="0"
          />
          {inputprops?.endAdornment && (
            <div
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {inputprops.endAdornment}
            </div>
          )}
        </div>
        <style>{mediaQuery}</style>
      </div>
    );
  }
);

export default CustomTextField;
