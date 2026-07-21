import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDelegadosVencidosRequest } from "../api/cedis"; 
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

const InicioAlertas = () => {
  const [delegados, setDelegados] = useState([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const cargarDelegados = async () => {
      try {
        const res = await getDelegadosVencidosRequest();
        setDelegados(res.data);
      } catch (error) {
        console.error("Error al cargar alertas de delegados:", error);
      }
    };
    cargarDelegados();
  }, []);

  // Paleta de estilos adaptativos para mantener consistencia con los demás componentes
  const styles = {
    cardBg: isDark ? '#1f2937' : '#ffffff',
    cardShadow: isDark ? '0 0.5rem 1.5rem rgba(220, 53, 69, 0.15)' : '0 0.5rem 1.5rem rgba(220, 53, 69, 0.08)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
    divider: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
    titleColor: isDark ? '#ef4444' : '#dc3545', // Rojo sutil vs Rojo Bootstrap estándar
    nameColor: isDark ? '#e5e7eb' : '#1f2937',  // Gris claro vs Gris oscuro legible
    subTextColor: isDark ? '#9ca3af' : '#4b5563', // Textos secundarios intermedios
    strongColor: isDark ? '#f3f4f6' : '#111827', // Resaltados en el texto de CEDI
    btnColor: isDark ? '#9ca3af' : '#4b5563',
    btnBorder: isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1'
  };

  return (
    <div className="container mt-4">
      <div 
        className="card border-0" 
        style={{ 
          backgroundColor: styles.cardBg, 
          boxShadow: styles.cardShadow,
          borderLeft: '5px solid #dc3545', 
          borderTop: styles.border,
          borderRight: styles.border,
          borderBottom: styles.border,
          borderRadius: '10px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        {/* Cabecera con fondo transparente */}
        <div className="card-header bg-transparent py-3" style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}>
          <h5 className="mb-0 fw-bold" style={{ color: styles.titleColor, transition: 'color 0.3s ease' }}>
            🚨 Delegados con Registro Vencido · {delegados.length} Registros
          </h5>
        </div>

        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            {delegados.length > 0 ? (
              delegados.map((delegado) => (
                <li 
                  key={delegado._id} 
                  className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent"
                  style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}
                >
                  <div className="d-flex align-items-center">
                    {/* Indicador de estado */}
                    <span className="me-3" style={{ fontSize: "1.2rem" }}>🔴</span>
                    
                    <div>
                      <h6 className="mb-0 text-uppercase fw-bold" style={{ fontSize: '0.9rem', color: styles.nameColor, transition: 'color 0.3s ease' }}>
                        {delegado.nombre}
                      </h6>
                      <small style={{ color: styles.subTextColor, transition: 'color 0.3s ease' }}>
                        CEDI: <strong style={{ color: styles.strongColor, transition: 'color 0.3s ease' }}>{delegado.cedis}</strong> · Región: {delegado.region}
                      </small>
                      <br />
                      <small className="fw-bold" style={{ color: styles.titleColor, opacity: '0.9', transition: 'color 0.3s ease' }}>
                        Venció el: {new Date(delegado.vencimiento).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  {/* Botón dinámico adaptado al tema */}
                  <Link 
                    to={`/cedis/${encodeURIComponent(delegado.cedis)}`} 
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    style={{ 
                      fontSize: '0.8rem', 
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
              <li className="list-group-item text-center py-4 bg-transparent text-muted">
                ✅ No hay delegados vencidos actualmente.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InicioAlertas;