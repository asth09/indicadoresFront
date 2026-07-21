import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { getDelegadosProximosRequest } from "../api/cedis"; 
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

const ProximosVencimientos = () => {
  const [proximos, setProximos] = useState([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const cargarProximos = async () => {
      try {
        const res = await getDelegadosProximosRequest();
        setProximos(res.data);
      } catch (error) {
        console.error("Error al cargar próximos vencimientos:", error);
      }
    };
    cargarProximos();
  }, []);

  // Configuración de la paleta de colores para modo claro y oscuro
  const styles = {
    cardBg: isDark ? '#1f2937' : '#ffffff',
    cardShadow: isDark ? '0 1rem 3rem rgba(0, 0, 0, 0.175)' : '0 0.15rem 1.75rem rgba(33, 40, 50, 0.05)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
    divider: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
    titleColor: isDark ? '#60a5fa' : '#1d4ed8', // Azul brillante vs Azul corporativo fuerte
    nameColor: isDark ? '#e5e7eb' : '#1f2937', // Gris claro vs Gris oscuro legible
    subTextColor: isDark ? '#9ca3af' : '#4b5563', // Textos secundarios intermedios
    strongColor: isDark ? '#f3f4f6' : '#111827', // Resaltados en el texto
    btnColor: isDark ? '#9ca3af' : '#4b5563',
    btnBorder: isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1'
  };

  return (
    <div className="container mt-4">
      <div 
        className="card border-0" 
        style={{ 
          backgroundColor: styles.cardBg, 
          borderRadius: '10px',
          boxShadow: styles.cardShadow,
          border: styles.border,
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        {/* Cabecera con acento dinámico según el tema */}
        <div className="card-header bg-transparent py-3" style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}>
          <h5 className="mb-0 fw-bold" style={{ color: styles.titleColor, transition: 'color 0.3s ease' }}>
            📅 Vencimientos próximos (60 días) · {proximos.length} Delegados
          </h5>
        </div>

        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            {proximos.length > 0 ? (
              proximos.map((d) => (
                <li 
                  key={d._id} 
                  className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent"
                  style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}
                >
                  <div className="d-flex align-items-center">
                    {/* Icono de estado dinámico */}
                    <span 
                      className="me-3" 
                      style={{ fontSize: "1.2rem" }}
                    >
                      {d.diasRestantes < 30 ? "🔴" : "🟠"}
                    </span>

                    <div>
                      <h6 className="mb-0 text-uppercase fw-bold" style={{ fontSize: '0.9rem', color: styles.nameColor, transition: 'color 0.3s ease' }}>
                        {d.nombre}
                      </h6>
                      <small style={{ color: styles.subTextColor, transition: 'color 0.3s ease' }}>
                        CEDI: <strong style={{ color: styles.strongColor, transition: 'color 0.3s ease' }}>{d.cedis}</strong> ({d.region}) · 
                        Vencimiento: <span style={{ color: styles.subTextColor }}>
                          {new Date(d.vencimiento).toLocaleDateString()}
                        </span>
                      </small>
                      
                      <div className="mt-1">
                        {/* Badges adaptativos integrados con opacidades exactas */}
                        <span 
                          className="badge rounded-pill" 
                          style={{ 
                            backgroundColor: d.diasRestantes < 30 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: d.diasRestantes < 30 ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#fbbf24' : '#d97706'),
                            border: `1px solid ${d.diasRestantes < 30 ? '#ef4444' : '#f59e0b'}44`
                          }}
                        >
                          Faltan {d.diasRestantes} días
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/cedis/${encodeURIComponent(d.cedis)}`} 
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    style={{ 
                      fontSize: '0.75rem', 
                      color: styles.btnColor, 
                      borderColor: styles.btnBorder,
                      transition: 'all 0.3s ease' 
                    }}
                  >
                    Ver detalle
                  </Link>
                </li>
              ))
            ) : (
              <li className="list-group-item text-center py-5 bg-transparent text-muted">
                No hay vencimientos cercanos en el radar.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProximosVencimientos;