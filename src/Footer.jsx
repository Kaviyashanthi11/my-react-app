import React from 'react';
import Typography from '@mui/material/Typography';

const text = "PMS Insight LLC";
const text1 = "v0.0.7";

const Footer = () => {
  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      textAlign: 'center',
      backgroundColor: '#fff', // Optional: background color to ensure text visibility
      padding: '10px 0', // Increased padding for better spacing
      boxShadow: '0 -1px 4px rgba(0,0,0,0.1)', // Optional: add shadow for separation
      zIndex: 1200, // Ensure it is above other elements, adjust as needed
      fontSize: '0.875rem', // Adjust font size for better appearance
    }}>
      <Typography variant="body2" color="textSecondary">
        <span style={{ color: '#29b6f6', fontWeight: 'bold' }}>{text}</span>
        <span> &copy; {new Date().getFullYear()} </span>
        <span> {text1}</span>
      </Typography>
    </footer>
  );
};

export default Footer;
