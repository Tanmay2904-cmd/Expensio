import React, { useState } from 'react';
import { Box, Button, TextField, Paper, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';

const CategoryForm = ({ initialValues = {}, onSubmit }) => {
  const [form, setForm] = useState({
    name: initialValues.name || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Category name required';
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
      setSnackbar({ open: true, message: 'Category saved!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save category.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, minWidth: 320 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {initialValues.id ? 'Edit Category' : 'Add Category'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Category Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />
        <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : (initialValues.id ? 'Update Category' : 'Add Category')}
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

export default CategoryForm;
