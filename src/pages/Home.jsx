import { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Typography, Box, CircularProgress, Alert, Paper, Grid } from '@mui/material';

function Home() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // URL do Backend no Railway - HARDCODED para garantir que funcione
  const backendUrl = 'https://minha-plataforma-backend-production.up.railway.app'

  useEffect((   ) => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin-dashboard/metrics`)
        setMetrics(response.data)
      } catch (err) {
        setError('Erro ao carregar métricas do dashboard. Verifique se o backend está rodando.')
        console.error('Erro ao buscar métricas do dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    
    return () => clearInterval(interval)
  }, [backendUrl])

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados iniciais...</Typography>
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bem-vindo à Plataforma PRM CaaS IA-First
      </Typography>
      <Typography variant="body1" paragraph>
        Esta plataforma oferece uma solução completa para gestão de relacionamento com parceiros (PRM)
        com foco em automação e inteligência artificial.
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: 150, justifyContent: 'center' }}>
            <Typography variant="h6" color="primary">Total de Parceiros</Typography>
            <Typography variant="h3">{metrics.totalPartners}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: 150, justifyContent: 'center' }}>
            <Typography variant="h6" color="primary">Parceiros Ativos</Typography>
            <Typography variant="h3">{metrics.activePartners}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: 150, justifyContent: 'center' }}>
            <Typography variant="h6" color="primary">Onboardings Pendentes</Typography>
            <Typography variant="h3">{metrics.pendingOnboardings}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Funcionalidades Principais:
        </Typography>
        <Typography variant="body1" align="left">
          <ul>
            <li>**Onboarding Inteligente:** Processo de cadastro de parceiros guiado por IA.</li>
            <li>**Geração de Documentos:** Crie contratos, políticas e termos automaticamente com IA.</li>
            <li>**Branding Personalizado:** Permita que seus parceiros personalizem a experiência da plataforma.</li>
            <li>**Dashboard Administrativo:** Monitore métricas chave e a saúde do sistema em tempo real.</li>
          </ul>
        </Typography>
      </Box>
    </Container>
  )
}

export default Home
