import { useEffect, useState } from "react";
import { getComitesAlertasRequest } from "../api/cedis";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

const TablaComitesAlertas = () => {
  const [comites, setComites] = useState([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const cargarComites = async () => {
      try {
        const res = await getComitesAlertasRequest();
        setComites(res.data);
      } catch (error) {
        console.error("Error al cargar alertas de comités:", error);
      }
    };
    cargarComites();
  }, []);

  // Paleta de estilos adaptativos
  const styles = {
    cardBg: isDark ? '#1f2937' : '#ffffff',
    cardShadow: isDark ? '0 1rem 3rem rgba(0, 0, 0, 0.175)' : '0 0.15rem 1.75rem rgba(33, 40, 50, 0.05)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
    divider: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
    titleColor: isDark ? '#f59e0b' : '#b45309',       // Ámbar brillante vs Ámbar oscuro corporativo
    nameColor: isDark ? '#e5e7eb' : '#1f2937',        // Gris claro vs Gris oscuro legible
    subTextColor: isDark ? '#9ca3af' : '#4b5563',      // Textos secundarios intermedios
    strongColor: isDark ? '#f3f4f6' : '#111827',      // Estado / Resaltado
    noDateColor: isDark ? '#ef4444' : '#dc3545',      // Alerta para "Sin fecha registrada"
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
        {/* Cabecera con acento en amarillo/warning adaptado */}
        <div className="card-header bg-transparent py-3" style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}>
          <h5 className="mb-0 fw-bold" style={{ color: styles.titleColor, transition: 'color 0.3s ease' }}>
            📋 Comité vencido o pendiente · {comites.length} CEDIS
          </h5>
        </div>

        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            {comites.length > 0 ? (
              comites.map((c) => (
                <li 
                  key={c._id} 
                  className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent"
                  style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}
                >
                  <div className="d-flex align-items-center">
                    {/* Icono de estado */}
                    <span className="me-3" style={{ fontSize: "1.2rem" }}>🟡</span>
                    
                    <div>
                      <h6 className="mb-0 text-uppercase fw-bold" style={{ fontSize: '0.9rem', color: styles.nameColor, transition: 'color 0.3s ease' }}>
                        {c.cedis}
                      </h6>
                      <small style={{ color: styles.subTextColor, transition: 'color 0.3s ease' }}>
                        {c.region} — Estado: <strong style={{ color: styles.strongColor, transition: 'color 0.3s ease' }}>{c.psst.reg}</strong> · 
                        Vigencia: <span 
                          className={!c.comite.fechaActualizacionRegistro ? "fw-bold" : ""}
                          style={{ 
                            color: !c.comite.fechaActualizacionRegistro 
                              ? styles.noDateColor 
                              : styles.subTextColor,
                            transition: 'color 0.3s ease'
                          }}
                        >
                          {c.comite.fechaActualizacionRegistro || "Sin fecha registrada"}
                        </span>
                      </small>
                    </div>
                  </div>

                  <Link 
                    to={`/cedis/${encodeURIComponent(c.cedis)}`} 
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
                ✨ Todos los comités están actualizados y registrados.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TablaComitesAlertas;