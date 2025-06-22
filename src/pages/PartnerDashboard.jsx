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
      setQrCo
