import { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard';
import axios from '../api/axios'; // Tu configuración de axios

const DashboardCards = () => {
  const [stats, setStats] = useState({
    criticos: 0,
    seguimiento: 0,
    delegadosVencidos: 0,
    comitesDesactualizados: 0,
    programasDesactualizados: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/cedis/stats'); // Asegúrate de crear esta ruta en el back
        setStats(res.data);
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <SummaryCard 
          title="Cedis Críticos" 
          value={stats.criticos.toString()} 
          color="danger" 
          icon="alarm" 
          description="Riesgo legal inmediato"
        />

        <SummaryCard 
          title="En Seguimiento" 
          value={stats.seguimiento.toString()} 
          color="warning" 
          icon="triangle" 
          description="Monitoreo activo 2026"
        />

        <SummaryCard 
          title="Delegados Vencidos" 
          value={stats.delegadosVencidos.toString()} 
          color="danger" 
          icon="calendar" 
          description="Requieren elecciones"
        />

        <SummaryCard 
          title="Comités Desactualizados" 
          value={stats.comitesDesactualizados.toString()} 
          color="warning" 
          icon="clipboard-list" 
          description="Por vigencia o registro"
        />

        <SummaryCard 
          title="Programas Brecha" 
          value={stats.programasDesactualizados.toString()} 
          color="warning" 
          icon="clipboard-list" 
          description="Sin aprobación definitiva"
        />
      </div>
    </div>
  );
};

export default DashboardCards;