import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography, Paper, Grid, useTheme } from '@mui/material';
import { Add } from '@mui/icons-material';
import CategoryTable from '../components/CategoryTable';
import CategoryForm from '../components/CategoryForm';

const CategoriesPage = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };
  const handleEdit = (category) => {
    setEditing(category);
    setOpen(true);
  };
  const handleDelete = async (id) => {
    await axios.delete(`/api/categories/${id}`);
    fetchCategories();
  };
  const handleSubmit = async (form) => {
    if (editing) {
      await axios.put(`/api/categories/${editing.id}`, { ...editing, ...form });
    } else {
      await axios.post('/api/categories', form);
    }
    setOpen(false);
    fetchCategories();
  };

  return (
    <Box sx={{ 
      minHeight: '50vh', 
      py: { xs: 2, md: 4 }, 
      px: { xs: 1, md: 3 },
      width: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <Grid container sx={{ width: '100%', mx: 0 }}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 4,
            width: '100%',
            maxWidth: 1400,
            overflowX: 'auto',
            boxSizing: 'border-box',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 35, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              pb: 2,
              borderBottom: theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1
              }}>
                Expense Categories
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleAdd}
                startIcon={<Add />}
                sx={{ 
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Add Category
              </Button>
            </Box>
            <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
            <Dialog 
              open={open} 
              onClose={() => setOpen(false)} 
              maxWidth="sm" 
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <DialogTitle sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                pb: 1
              }}>
                {editing ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogContent>
                <CategoryForm
                  initialValues={editing || {}}
                  onSubmit={handleSubmit}
                />
              </DialogContent>
            </Dialog>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoriesPage; 