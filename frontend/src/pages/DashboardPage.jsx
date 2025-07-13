import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5a2b'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const renderPieLabel = ({ name }) => name;

const DashboardPage = () => {
  const theme = useTheme();
  const { role } = useAuth();
  const [barData, setBarData] = useState(MONTHS.map(month => ({ month, total: 0 })));
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        let monthlyRes, categoryRes;

        if (role === 'ADMIN') {
          // Admin gets system-wide data
          [monthlyRes, categoryRes] = await Promise.all([
            axios.get('/api/expenses/monthly-summary'),
            axios.get('/api/expenses/total-by-category')
          ]);
        } else {
          // Regular users get their personal data
          [monthlyRes, categoryRes] = await Promise.all([
            axios.get('/api/expenses/my/monthly-summary'),
            axios.get('/api/expenses/my/total-by-category')
          ]);
        }

        // Process monthly data for bar chart
        const apiMonthlyData = monthlyRes.data || {};
        const mapped = MONTHS.map(month => ({ month, total: apiMonthlyData[month] || 0 }));
        setBarData(mapped);

        // Process category data for pie chart
        const apiCategoryData = categoryRes.data || {};
        const pieChartData = Object.entries(apiCategoryData).map(([name, value]) => ({
          name,
          value: parseFloat(value)
        }));
        setPieData(pieChartData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Fallback to empty data if error
        setBarData(MONTHS.map(month => ({ month, total: 0 })));
        setPieData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [role]);

  const getChartTitle = (chartType) => {
    if (role === 'ADMIN') {
      return chartType === 'pie' ? 'System Expenses by Category' : 'System Monthly Expense Overview';
    } else {
      return chartType === 'pie' ? 'My Expenses by Category' : 'My Monthly Expense Overview';
    }
  };

  const getTotalTitle = () => {
    return role === 'ADMIN' ? 'System Total Spent' : 'My Total Spent';
  };

  const getTotalDescription = () => {
    return role === 'ADMIN' 
      ? 'Total expenses across all users and categories'
      : 'Total expenses across all categories';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: { xs: 2, md: 4 }, 
      px: { xs: 1, md: 3 },
      width: '100%', // Fix here
    }}>
      <Typography variant="h3" sx={{ 
        mb: 4, 
        fontWeight: 800, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: 1
      }}>
        {role === 'ADMIN' ? 'System Dashboard' : 'Dashboard'}
      </Typography>
      
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 4, 
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 35, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            height: 450,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Typography variant="h5" sx={{ 
              mb: 3, 
              fontWeight: 700, 
              textAlign: 'center',
              color: theme.palette.text.primary
            }}>
              {getChartTitle('pie')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320 }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      labelLine={false}
                      isAnimationActive={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                        color: theme.palette.text.primary,
                        borderRadius: 12,
                        border: theme.palette.mode === 'dark' 
                          ? '1px solid rgba(255, 255, 255, 0.1)' 
                          : '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  {loading ? 'Loading...' : 'No expense data available'}
                </Typography>
              )}
              {pieData.length > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <ResponsiveContainer width="100%" height={60}>
                    <PieChart>
                      <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 4, 
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 35, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            height: 450,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Typography variant="h5" sx={{ 
              mb: 3, 
              fontWeight: 700, 
              textAlign: 'center',
              color: theme.palette.text.primary
            }}>
              {getChartTitle('bar')}
            </Typography>
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={theme.palette.text.primary} />
                  <YAxis stroke={theme.palette.text.primary} />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                      color: theme.palette.text.primary,
                      borderRadius: 12,
                      border: theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]} 
                    isAnimationActive={true}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Total Spent Card */}
      <Grid container spacing={3} sx={{ maxWidth: 1400, mt: 3, mx: 'auto' }}>
        <Grid item xs={12} sm={8} md={6} lg={4} sx={{ mx: 'auto' }}>
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 4 }, 
            borderRadius: 4, 
            textAlign: 'center',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(99, 102, 241, 0.2)'
              : '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}>
              {getTotalTitle()}
            </Typography>
            <Typography variant="h2" sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              ₹{pieData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'text.secondary',
              fontWeight: 500
            }}>
              {getTotalDescription()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 