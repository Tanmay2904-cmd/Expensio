import React, { useState, createContext, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  CssBaseline,
  IconButton,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard,
  AccountBalance,
  Category,
  Group,
  Login,
  AppRegistration,
  Logout,
  DarkMode,
  LightMode,
  Settings,
  Assessment,
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import CategoriesPage from './pages/CategoriesPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Sidebar from './components/Sidebar';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const LOGO_URL = '/logo.png';

const drawerWidth = 240;

const ProtectedRoute = ({ children, adminOnly }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && role !== 'ADMIN') return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const location = useLocation();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#0f0f23' : '#f8fafc',
        paper: mode === 'dark' ? '#1a1a2e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
        secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
          contained: {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: mode === 'dark' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'dark'
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
  }), [mode]);

  const { token, role, logout, user } = useAuth();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          minHeight: '100vh', 
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
          backgroundAttachment: 'fixed'
        }}>
          {token && (
            <Sidebar drawerWidth={drawerWidth} role={role} />
          )}
          <Box sx={{ flexGrow: 1, ml: token ? `${drawerWidth}px` : 0, minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              ml: token ? `${drawerWidth}px` : 0,
              background: mode === 'dark'
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderBottom: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}>
              <Toolbar sx={{ minHeight: 70, display: 'flex', alignItems: 'center', px: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: 12, 
                  p: 1, 
                  mr: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <img src={LOGO_URL} alt="App Logo" style={{ 
                    height: 32, 
                    borderRadius: 8, 
                    background: '#fff', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                  }} />
                </Box>
                <Typography variant="h5" sx={{ 
                  flexGrow: 1, 
                  fontWeight: 800, 
                  letterSpacing: 1,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Expensio
                </Typography>
                {token && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mr: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    p: 1,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Avatar sx={{ 
                      width: 36, 
                      height: 36, 
                      fontSize: 16,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      fontWeight: 600
                    }}>
                      {(user || '').charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff' }}>
                      {user}
                    </Typography>
                  </Box>
                )}
                {token && (
                  <Button 
                    color="inherit" 
                    startIcon={<Logout />} 
                    onClick={logout} 
                    sx={{ 
                      fontWeight: 600, 
                      mr: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 8,
                      px: 2,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    Logout
                  </Button>
                )}
                <IconButton 
                  color="inherit" 
                  onClick={colorMode.toggleColorMode}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 8,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Box sx={{ p: 3 }}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                {role === 'ADMIN' && (
                  <Route path="/users" element={<ProtectedRoute adminOnly={true}><UsersPage /></ProtectedRoute>} />
                )}
              </Routes>
            </Box>
            {location.pathname === '/login' && (
              <Box component="footer" sx={{ 
                py: 3, 
                textAlign: 'center', 
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 35, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                borderTop: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                mt: 4 
              }}>
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} Expensio · TN
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
