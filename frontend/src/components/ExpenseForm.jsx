import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField, Paper, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';

const ExpenseForm = ({ initialValues = {}, onSubmit, categories, users }) => {
  const [form, setForm] = useState({
    amount: initialValues.amount || '',
    description: initialValues.description || '',
    date: initialValues.date || '',
    categoryId: initialValues.categoryId || '',
    userId: initialValues.userId || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.description) errs.description = 'Description required';
    if (!form.date) errs.date = 'Date required';
    if (!form.categoryId) errs.categoryId = 'Category required';
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
      setSnackbar({ open: true, message: 'Expense saved!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save expense.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, minWidth: 320 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {initialValues.id ? 'Edit Expense' : 'Add Expense'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.amount}
          helperText={errors.amount}
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
          error={!!errors.date}
          helperText={errors.date}
        />
        <TextField
          select
          label="Category"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.categoryId}
          helperText={errors.categoryId}
        >
          {categories && categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </TextField>
        {users && (
          <TextField
            select
            label="User"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            fullWidth
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
            ))}
          </TextField>
        )}
        <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : (initialValues.id ? 'Update Expense' : 'Add Expense')}
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

export default ExpenseForm; 