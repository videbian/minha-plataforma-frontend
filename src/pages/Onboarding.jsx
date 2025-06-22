import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress, Alert } from '@mui/material';

function Onboarding() {
  const [step, setStep] = useState('start');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cpf: '',
    company: '',
  });
  const [message, setMessage] = useState('Olá! Para começar, qual é o seu nome completo?');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const handleInputChange = (e ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/onboarding/process-step`, {
        step: step,
        data: formData,
      });
      setMessage(response.data.message);
      setStep(response.data.nextStep);
    } catch (err) {
      setError('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      setMessage('Ocorreu um erro. Por favor, tente novamente.');
      console.error('Erro no onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (step) {
      case 'start':
        return (
          <TextField
            label="Nome Completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
        );
      case 'ask_email':
        return (
          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
        );
      case 'ask_cpf':
        return (
          <TextField
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
        );
      case 'ask_company':
        return (
          <TextField
            label="Nome da Empresa/Organização"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
        );
      case 'compliance_check':
        return (
          <Box>
            <Typography variant="body1">Verificando suas informações para compliance...</Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </Box>
        );
      case 'manual_review_needed':
      case 'collect_documents':
      case 'error':
        return null; // Message will be displayed above
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Processo de Onboarding
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          {message}
        </Typography>

        {(step !== 'compliance_check' && step !== 'manual_review_needed' && step !== 'collect_documents' && step !== 'error') && (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {renderForm()}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Continuar'}
            </Button>
          </Box>
        )}

        {step === 'collect_documents' && (
          <Button variant="contained" color="success" sx={{ mt: 2 }}>
            Ir para Geração de Documentos
          </Button>
        )}
      </Paper>
    </Container>
  );
}

export default Onboarding;
