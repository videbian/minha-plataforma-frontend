import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper, TextField, Button, CircularProgress, Alert, Grid } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react'; // Biblioteca para QR Code

function PartnerDashboard() {
  const [partnerId, setPartnerId] = useState('');
  const [partnerData, setPartnerData] = useState(null);
  const [brandingConfig, setBrandingConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [shareableLink, setShareableLink] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const fetchPartnerData = async (id ) => {
    setLoading(true);
    setError(null);
    try {
      const partnerRes = await axios.get(`${backendUrl}/partners/${id}`);
      setPartnerData(partnerRes.data);
      const brandingRes = await axios.get(`${backendUrl}/branding/${id}`);
      setBrandingConfig(brandingRes.data);
    } catch (err) {
      setError('Parceiro não encontrado ou erro ao carregar dados.');
      setPartnerData(null);
      setBrandingConfig(null);
      console.error('Erro ao buscar dados do parceiro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerIdChange = (e) => {
    setPartnerId(e.target.value);
  };

  const handleSearch = () => {
    if (partnerId) {
      fetchPartnerData(partnerId);
    }
  };

  const handleBrandingChange = (e) => {
    setBrandingConfig({ ...brandingConfig, [e.target.name]: e.target.value });
  };

  const handleUpdateBranding = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${backendUrl}/branding/${partnerId}`, brandingConfig);
      setBrandingConfig(response.data);
      alert('Configurações de branding atualizadas com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar configurações de branding.');
      console.error('Erro ao atualizar branding:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!partnerId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${backendUrl}/branding/${partnerId}/qr-code`, {
        data: `https://your-platform.com/onboarding?partnerId=${partnerId}`, // Exemplo de dado para o QR Code
      } );
      setQrCodeData(response.data);
    } catch (err) {
      setError('Erro ao gerar QR Code.');
      console.error('Erro ao gerar QR Code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateShareableLink = async () => {
    if (!partnerId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${backendUrl}/branding/${partnerId}/shareable-link`, {
        type: 'onboarding', // Pode ser 'onboarding', 'login', etc.
      });
      setShareableLink(response.data);
    } catch (err) {
      setError('Erro ao gerar link compartilhável.');
      console.error('Erro ao gerar link:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard do Parceiro
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Buscar Parceiro</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="ID do Parceiro"
            variant="outlined"
            value={partnerId}
            onChange={handlePartnerIdChange}
            type="number"
            fullWidth
          />
          <Button variant="contained" onClick={handleSearch} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Buscar'}
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>

      {partnerData && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Detalhes do Parceiro: {partnerData.name}</Typography>
          <Typography variant="body1">Email: {partnerData.email}</Typography>
          <Typography variant="body1">Empresa: {partnerData.company || 'N/A'}</Typography>
          <Typography variant="body1">Status: {partnerData.status}</Typography>
          <Typography variant="body1">Criado em: {new Date(partnerData.createdAt).toLocaleDateString()}</Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Configurações de Branding</Typography>
            {brandingConfig && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="URL do Logo"
                    name="logoUrl"
                    value={brandingConfig.logoUrl || ''}
                    onChange={handleBrandingChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cor Primária"
                    name="primaryColor"
                    value={brandingConfig.primaryColor || ''}
                    onChange={handleBrandingChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cor Secundária"
                    name="secondaryColor"
                    value={brandingConfig.secondaryColor || ''}
                    onChange={handleBrandingChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mensagem de Boas-Vindas"
                    name="welcomeMessage"
                    value={brandingConfig.welcomeMessage || ''}
                    onChange={handleBrandingChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nome da Empresa"
                    name="companyName"
                    value={brandingConfig.companyName || ''}
                    onChange={handleBrandingChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email de Contato"
                    name="contactEmail"
                    value={brandingConfig.contactEmail || ''}
                    onChange={handleBrandingChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tema (light/dark)"
                    name="theme"
                    value={brandingConfig.theme || ''}
                    onChange={handleBrandingChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            )}
            <Button variant="contained" color="primary" onClick={handleUpdateBranding} disabled={loading} sx={{ mt: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Atualizar Branding'}
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Ferramentas de Marketing</Typography>
            <Button variant="outlined" onClick={handleGenerateQRCode} disabled={loading} sx={{ mr: 2 }}>
              Gerar QR Code
            </Button>
            <Button variant="outlined" onClick={handleGenerateShareableLink} disabled={loading}>
              Gerar Link Compartilhável
            </Button>

            {qrCodeData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">QR Code Gerado:</Typography>
                <img src={qrCodeData.documentUrl} alt="QR Code" style={{ maxWidth: '200px', height: 'auto' }} />
              </Box>
            )}

            {shareableLink && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Link Compartilhável:</Typography>
                <TextField
                  fullWidth
                  value={shareableLink}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default PartnerDashboard;
