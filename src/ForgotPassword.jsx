import React, { useState } from 'react';
import { Button, Container, Snackbar, Alert } from '@mui/material';
import { Form } from 'react-bootstrap';
import CustomTextField from './maintain/CustomTextField';
const ResetPasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!oldPassword || !newPassword || !retypePassword) {
      setSnackbarMessage('All fields are required.');
      setOpenSnackbar(true);
      return;
    }

    if (newPassword !== retypePassword) {
      setSnackbarMessage('New Password and Retype Password do not match.');
      setOpenSnackbar(true);
      return;
    }

    // Add your password reset logic here
    setSnackbarMessage('Password reset successfully.');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
   
        <Form onSubmit={handleSubmit}/>
     
        <CustomTextField
          label="Old Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          star
        />
        <CustomTextField
          label="New Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          star
        />
        <CustomTextField
          label="Retype Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          star
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResetPasswordForm;
