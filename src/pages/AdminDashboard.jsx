import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL do Backend no Railway - HARDCODED
  const backendUrl = 'https://minha-plataforma-backend-production.up.railway.app';

  useEffect(( ) => {
    const fetchData = async () => {
      try {
        const [metricsRes, healthRes, activityRes] = await Promise.all([
          fetch(`${backendUrl}/admin-dashboard/metrics`),
          fetch(`${backendUrl}/admin-dashboard/system-status`),
          fetch(`${backendUrl}/admin-dashboard/recent-activities`)
        ]);
        
        setMetrics(await metricsRes.json());
        setHealth(await healthRes.json());
        setActivity(await activityRes.json());
      } catch (err) {
        setError('Erro ao carregar dados do dashboard. Verifique se o backend está rodando.');
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{color: 'red', padding: '20px'}}>{error}</div>;

  return (
    <div style={{padding: '20px'}}>
      <h1>Admin Dashboard</h1>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
          <h3>Métricas</h3>
          {metrics && (
            <div>
              <p>Total de Parceiros: {metrics.totalPartners}</p>
              <p>Parceiros Ativos: {metrics.activePartners}</p>
              <p>Receita Total: R$ {metrics.totalRevenue?.toLocaleString()}</p>
              <p>Crescimento Mensal: {metrics.monthlyGrowth}%</p>
            </div>
          )}
        </div>

        <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
          <h3>Status do Sistema</h3>
          {health && (
            <div>
              <p>Status: <span style={{color: health.status === 'healthy' ? 'green' : 'red'}}>{health.status}</span></p>
              <p>Uptime: {health.uptime}</p>
              <p>Database: <span style={{color: health.services?.database === 'online' ? 'green' : 'red'}}>{health.services?.database}</span></p>
              <p>API: <span style={{color: health.services?.api === 'online' ? 'green' : 'red'}}>{health.services?.api}</span></p>
            </div>
          )}
        </div>
      </div>

      <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
        <h3>Atividades Recentes</h3>
        {activity && activity.length > 0 ? (
          <ul>
            {activity.map((item, index) => (
              <li key={index} style={{marginBottom: '10px'}}>
                <strong>{item.type}:</strong> {item.description}
                <br />
                <small style={{color: '#666'}}>{new Date(item.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma atividade recente</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
