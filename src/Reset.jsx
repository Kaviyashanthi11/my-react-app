import React, { useState } from 'react';
import { TextField, Button, Container, Box, Snackbar, Alert } from '@mui/material';

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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 3,
          border: '1px solid lightgray',
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <TextField
          label="Old Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Retype Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </Box>

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
