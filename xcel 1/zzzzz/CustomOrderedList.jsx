import React from 'react';
import { FormGroup, FormLabel } from 'react-bootstrap';

const CustomOrderedList = ({ label, value, star = false }) => {
  // Split the input value into items based on newline characters
  const items = value.split('\n').filter(item => item.trim() !== '');

  return (
    <FormGroup style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      <FormLabel style={{ flex: '1', marginBottom: '0', paddingTop: '8px' }}>
        {label} {star && <span style={{ color: 'red' }}>*</span>}
      </FormLabel>
      <div style={{ 
        flex: '1.5', 
        marginLeft: '8px', 
        maxHeight: '50px', // Max height to enable scrolling
        overflowY: 'auto', // Enable vertical scrolling only when needed
        border: '1px solid lightgrey',
        backgroundColor: '#ffffff',
        padding: '8px', // Padding inside the container
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
      }}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: '#ffffff',
              wordWrap: 'break-word',
            }}>
              {item}
            </div>
          ))
        ) : (
          <div style={{ padding: '8px' }}>No items to display</div>
        )}
      </div>
    </FormGroup>
  );
};

export default CustomOrderedList;
