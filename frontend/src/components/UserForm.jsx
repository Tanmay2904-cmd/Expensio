import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField, Paper, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';

const roles = ['USER', 'ADMIN'];

const UserForm = ({ initialValues = {}, onSubmit }) => {
  const [form, setForm] = useState({
    name: initialValues.name || '',
    role: initialValues.role || 'USER',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Name required';
    if (!initialValues.id && !form.password) errs.password = 'Password required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
      setSnackbar({ open: true, message: 'User saved!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save user.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, minWidth: 320 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {initialValues.id ? 'Edit User' : 'Add User'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          select
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </TextField>
        {!initialValues.id && (
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />
        )}
        <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : (initialValues.id ? 'Update User' : 'Add User')}
        </Button>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserForm; 