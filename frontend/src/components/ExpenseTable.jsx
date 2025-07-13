import React, { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, TextField, Box, Paper, InputAdornment, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const ExpenseTable = ({ expenses, categories, users, onEdit, onDelete }) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const filteredExpenses = useMemo(() => {
    if (!search) return expenses;
    const lower = search.toLowerCase();
    return expenses.filter(row => {
      const desc = row.description?.toLowerCase() || '';
      const cat = categories?.find(c => c.id === (row.category?.id || row.categoryId))?.name?.toLowerCase() || '';
      const user = users?.find(u => u.id === (row.user?.id || row.userId))?.name?.toLowerCase() || '';
      return desc.includes(lower) || cat.includes(lower) || user.includes(lower);
    });
  }, [search, expenses, categories, users]);

  const columns = [
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 110, 
      minWidth: 90, 
      maxWidth: 130, 
      sortable: true, 
      align: 'right', 
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ 
          fontWeight: 700,
          color: theme.palette.mode === 'dark' ? '#10b981' : '#059669',
          fontSize: 15
        }}>
          ₹{params.value?.toFixed(2)}
        </Box>
      )
    },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 150, sortable: true },
    { field: 'date', headerName: 'Date', width: 120, minWidth: 100, maxWidth: 140, sortable: true, align: 'center', headerAlign: 'center' },
    {
      field: 'category',
      headerName: 'Category',
      width: 140,
      minWidth: 100,
      valueGetter: (params) => {
        if (!params || !params.row) return '';
        const catId = params.row.category?.id || params.row.categoryId;
        const cat = categories && catId ? categories.find(c => c.id === catId) : undefined;
        return cat ? cat.name : (params.row.category?.name || '');
      },
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ 
          background: theme.palette.mode === 'dark' 
            ? 'rgba(99, 102, 241, 0.2)' 
            : 'rgba(99, 102, 241, 0.1)',
          color: theme.palette.mode === 'dark' ? '#818cf8' : '#6366f1',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          fontSize: 13,
          fontWeight: 600,
          textTransform: 'capitalize'
        }}>
          {params.value}
        </Box>
      )
    },
    users && {
      field: 'user',
      headerName: 'User',
      width: 140,
      minWidth: 100,
      valueGetter: (params) => {
        if (!params || !params.row) return '';
        const userId = params.row.user?.id || params.row.userId;
        const user = users && userId ? users.find(u => u.id === userId) : undefined;
        return user ? user.name : (params.row.user?.name || '');
      },
      sortable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: 1 }}>
          <IconButton 
            onClick={() => onEdit(params.row)} 
            size="small"
            sx={{ 
              background: theme.palette.mode === 'dark' 
                ? 'rgba(99, 102, 241, 0.2)' 
                : 'rgba(99, 102, 241, 0.1)',
              color: theme.palette.mode === 'dark' ? '#818cf8' : '#6366f1',
              '&:hover': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(99, 102, 241, 0.3)' 
                  : 'rgba(99, 102, 241, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={() => onDelete(params.row.id)} 
            size="small"
            sx={{ 
              background: theme.palette.mode === 'dark' 
                ? 'rgba(239, 68, 68, 0.2)' 
                : 'rgba(239, 68, 68, 0.1)',
              color: theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
              '&:hover': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(239, 68, 68, 0.3)' 
                  : 'rgba(239, 68, 68, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
    },
  ].filter(Boolean);

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        label="Search expenses"
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            background: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
            '&:hover': {
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-focused': {
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(99, 102, 241, 0.05)',
            }
          }
        }}
        placeholder="Search description, category, or user"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          ),
        }}
      />
      <Paper elevation={0} sx={{ 
        width: '100%', 
        borderRadius: 3,
        background: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.05)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <DataGrid
          rows={filteredExpenses}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 16, 32]}
          getRowId={row => row.id}
          disableSelectionOnClick
          autoHeight
          sx={{
            border: 0,
            fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
            '& .MuiDataGrid-columnHeaders': {
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              fontWeight: 700,
              fontSize: 14,
              minHeight: 56,
              borderBottom: theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
            },
            '& .MuiDataGrid-row': {
              background: 'transparent',
              minHeight: 52,
              maxHeight: 64,
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(99, 102, 241, 0.02)',
              },
              '&:nth-of-type(even)': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.01)'
                  : 'rgba(0, 0, 0, 0.01)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(99, 102, 241, 0.03)',
                },
              },
            },
            '& .MuiDataGrid-cell': {
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 1.5,
              borderBottom: theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.05)'
                : '1px solid rgba(0, 0, 0, 0.05)',
            },
            '& .MuiDataGrid-footerContainer': {
              minHeight: 56,
              borderTop: theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(0, 0, 0, 0.02)',
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'hidden',
            },
            '& .MuiDataGrid-virtualScrollerContent': {
              overflow: 'hidden',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              color: theme.palette.text.primary,
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ExpenseTable;