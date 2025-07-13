import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper, MenuItem, Grid, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const roles = ['USER', 'ADMIN'];

const RegisterPage = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!username) errs.username = 'Username required';
    if (!password) errs.password = 'Password required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await register(username, password, role);
      setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      if (err.message === 'Username already exists') {
        setError('Username already exists');
        setSnackbar({ open: true, message: 'Username already exists.', severity: 'error' });
      } else {
        setError(err?.response?.data?.message || 'Registration failed. Please try again later.');
        setSnackbar({ open: true, message: 'Registration failed.', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Grid container alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 4, width: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Create your Expensio account</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
                autoComplete="username"
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
                autoComplete="new-password"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
              />
              <TextField
                select
                label="Role"
                value={role}
                onChange={e => setRole(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ fontWeight: 600, mt: 1 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </form>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
              <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterPage; 