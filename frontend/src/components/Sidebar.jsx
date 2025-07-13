import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Expenses', icon: <AccountBalanceIcon />, path: '/expenses' },
  { label: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { label: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { label: 'Users', icon: <PeopleIcon />, path: '/users' },
];

const LOGO_URL = '/logo.png';

const Sidebar = ({ drawerWidth, role }) => {
  const location = useLocation();
  const theme = useTheme();
  
  // Filter nav items based on role
  const filteredNavItems = navItems.filter(item => {
    if (item.path === '/users' && role !== 'ADMIN') {
      return false;
    }
    return true;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
          pt: 0,
        },
      }}
    >
      <Toolbar sx={{ 
        minHeight: 70, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 2,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        borderBottom: theme.palette.mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          background: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(99, 102, 241, 0.1)',
          borderRadius: 12,
          p: 1,
          backdropFilter: 'blur(10px)'
        }}>
          <img src={LOGO_URL} alt="Logo" style={{ 
            height: 32, 
            borderRadius: 8, 
            background: '#fff', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }} />
          <span style={{ 
            fontWeight: 800, 
            fontSize: 18, 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1 
          }}>
            Expensio
          </span>
        </Box>
      </Toolbar>
      <Divider sx={{ 
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)' 
      }} />
      <List sx={{ mt: 2, px: 1 }}>
        {filteredNavItems.map(item => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={selected}
              sx={{
                mb: 1,
                borderRadius: 12,
                mx: 0.5,
                background: selected 
                  ? theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                  : 'transparent',
                color: selected 
                  ? theme.palette.mode === 'dark' ? '#ffffff' : '#6366f1'
                  : theme.palette.text.primary,
                fontWeight: selected ? 700 : 500,
                border: selected 
                  ? theme.palette.mode === 'dark'
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : '1px solid rgba(99, 102, 241, 0.2)'
                  : '1px solid transparent',
                backdropFilter: selected ? 'blur(10px)' : 'none',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(99, 102, 241, 0.05)',
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease-in-out',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ 
                color: selected 
                  ? theme.palette.mode === 'dark' ? '#ffffff' : '#6366f1'
                  : theme.palette.text.secondary, 
                minWidth: 40,
                fontSize: 20
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: selected ? 600 : 500,
                  }
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar; 