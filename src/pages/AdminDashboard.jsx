import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(( ) => {
    const fetchData = async () => {
      try {
        const [metricsRes, healthRes, activityRes] = await Promise.all([
          axios.get(`${backendUrl}/admin-dashboard/metrics`),
          axios.get(`${backendUrl}/admin-dashboard/health`),
          axios.get(`${backendUrl}/admin-dashboard/partner-activity`),
        ]);
        setMetrics(metricsRes.data);
        setHealth(healthRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard. Verifique se o backend está rodando.');
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [backendUrl]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Carregando Dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const partnerData = [
    { id: 0, value: metrics.activePartners, label: 'Ativos' },
    { id: 1, value: metrics.totalPartners - metrics.activePartners, label: 'Inativos/Pendentes' },
  ];

  const onboardingData = [
    { id: 0, value: metrics.pendingOnboardings, label: 'Pendentes' },
    { id: 1, value: metrics.manualReviewCases, label: 'Revisão Manual' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Administrativo
      </Typography>

      <Grid container spacing={3}>
        {/* Métricas Principais */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', heig
