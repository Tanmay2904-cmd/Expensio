import React, { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Paper, Box, TextField, InputAdornment, useTheme, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const UserTable = ({ users, onEdit, onDelete }) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const lower = search.toLowerCase();
    return users.filter(user => 
      user.name?.toLowerCase().includes(lower) ||
      user.role?.toLowerCase().includes(lower)
    );
  }, [search, users]);

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1, 
      minWidth: 200, 
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ 
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: 14
        }}>
          {params.value}
        </Box>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120, 
      minWidth: 100, 
      maxWidth: 140, 
      sortable: true, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            background: params.value === 'ADMIN' 
              ? theme.palette.mode === 'dark'
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(239, 68, 68, 0.1)'
              : theme.palette.mode === 'dark'
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(16, 185, 129, 0.1)',
            color: params.value === 'ADMIN'
              ? theme.palette.mode === 'dark' ? '#f87171' : '#ef4444'
              : theme.palette.mode === 'dark' ? '#34d399' : '#10b981',
            fontWeight: 600,
            fontSize: 12,
            textTransform: 'uppercase'
          }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      minWidth: 120,
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
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        label="Search users"
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
        placeholder="Search name or role"
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
          rows={filteredUsers}
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

export default UserTable; 