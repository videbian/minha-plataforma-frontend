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
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 180 }}>
            <Typography variant="h6" color="primary">Total de Parceiros</Typography>
            <Typography variant="h3">{metrics.totalPartners}</Typography>
            <Typography variant="body2" color="text.secondary">Ativos: {metrics.activePartners}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 180 }}>
            <Typography variant="h6" color="primary">Onboardings Pendentes</Typography>
            <Typography variant="h3">{metrics.pendingOnboardings}</Typography>
            <Typography variant="body2" color="text.secondary">Casos de Revisão Manual: {metrics.manualReviewCases}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 180 }}>
            <Typography variant="h6" color="primary">Documentos Gerados (24h)</Typography>
            <Typography variant="h3">{metrics.documentsGeneratedLast24h}</Typography>
            <Typography variant="body2" color="text.secondary">Última atualização: {new Date(metrics.lastUpdated).toLocaleTimeString()}</Typography>
          </Paper>
        </Grid>

        {/* Gráficos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Status dos Parceiros</Typography>
            <PieChart
              series={[{ data: partnerData, innerRadius: 30, outerRadius: 90, paddingAngle: 5, cornerRadius: 5, highlightScope: { faded: 'global', highlighted: 'item' } }]}
              height={250}
              width={400}
              slotProps={{
                legend: { hidden: false, direction: 'row', position: { vertical: 'bottom', horizontal: 'center' } },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Status de Onboarding</Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['Pendentes', 'Revisão Manual'] }]}
              series={[{ data: [metrics.pendingOnboardings, metrics.manualReviewCases], label: 'Contagem' }]}
              height={250}
              width={400}
            />
          </Paper>
        </Grid>

        {/* Atividade e Saúde do Sistema */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="primary" gutterBottom>Atividade Recente</Typography>
            {activity.recentSignups.length > 0 ? (
              activity.recentSignups.map((signup) => (
                <Box key={signup.id} sx={{ mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                  <Typography variant="body1"><strong>{signup.name}</strong> ({signup.company})</Typography>
                  <Typography variant="body2" color="text.secondary">Cadastrado em: {new Date(signup.createdAt).toLocaleDateString()} - Status: {signup.status}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">Nenhum cadastro recente.</Typography>
            )}
            <Typography variant="body2" sx={{ mt: 2 }}>Parceiros Ativos Hoje: {activity.activeToday}</Typography>
            <Typography variant="body2">Taxa de Conversão Onboarding: {activity.conversionRate}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="primary" gutterBottom>Saúde do Sistema</Typography>
            <Typography variant="body1">Status: <Box component="span" sx={{ color: health.status === 'healthy' ? 'success.main' : 'error.main' }}>{health.status.toUpperCase()}</Box></Typography>
            <Typography variant="body2">Uptime: {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m</Typography>
            <Typography variant="body2">Memória Usada: {(health.memory.heapUsed / 1024 / 1024).toFixed(2)} MB</Typography>
            <Typography variant="body2">Última Verificação: {new Date(health.timestamp).toLocaleTimeString()}</Typography>
            
            <Typography variant="h6" color="primary" sx={{ mt: 2 }} gutterBottom>Alertas do Sistema</Typography>
            {metrics.alerts.length > 0 ? (
              metrics.alerts.map((alert, index) => (
                <Alert key={index} severity={alert.type} sx={{ mb: 1 }}>
                  {alert.message}
                </Alert>
              ))
            ) : (
              <Typography variant="body2">Nenhum alerta ativo.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
