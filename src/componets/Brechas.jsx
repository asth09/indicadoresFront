import { useEffect, useState } from "react";
import { getCedisBrechasRequest } from "../api/cedis";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

const TablaBrechas = () => {
  const [centros, setCentros] = useState([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const cargarBrechas = async () => {
      try {
        const res = await getCedisBrechasRequest();
        setCentros(res.data);
      } catch (error) {
        console.error("Error al cargar brechas:", error);
      }
    };
    cargarBrechas();
  }, []);

  // Paleta de estilos adaptativos
  const styles = {
    cardBg: isDark ? '#1f2937' : '#ffffff',
    cardShadow: isDark ? '0 1rem 3rem rgba(0, 0, 0, 0.175)' : '0 0.15rem 1.75rem rgba(33, 40, 50, 0.05)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
    divider: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
    titleColor: isDark ? '#ef4444' : '#dc3545',       // Rojo brillante vs Rojo corporativo
    nameColor: isDark ? '#e5e7eb' : '#1f2937',        // Gris claro vs Gris oscuro legible
    subTextColor: isDark ? '#9ca3af' : '#4b5563',      // Textos secundarios
    strongColor: isDark ? '#f3f4f6' : '#111827',      // Resaltados
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
        {/* Cabecera con acento en rojo para indicar criticidad */}
        <div className="card-header bg-transparent py-3" style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}>
          <h5 className="mb-0 fw-bold" style={{ color: styles.titleColor, transition: 'color 0.3s ease' }}>
            📉 Programa con brechas · {centros.length} CEDIS
          </h5>
        </div>

        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            {centros.length > 0 ? (
              centros.map((centro) => (
                <li 
                  key={centro._id} 
                  className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent"
                  style={{ borderBottom: `1px solid ${styles.divider}`, transition: 'border-color 0.3s ease' }}
                >
                  <div className="d-flex align-items-center">
                    {/* Icono de estado crítico */}
                    <span className="me-3" style={{ fontSize: "1.2rem" }}>🔴</span>
                    
                    <div>
                      <h6 className="mb-0 text-uppercase fw-bold" style={{ fontSize: '0.9rem', color: styles.nameColor, transition: 'color 0.3s ease' }}>
                        {centro.cedis}
                      </h6>
                      <small style={{ color: styles.subTextColor, transition: 'color 0.3s ease' }}>
                        {centro.region} — Registro: <strong style={{ color: styles.strongColor, transition: 'color 0.3s ease' }}>{centro.psst.reg}</strong> · 
                        Estado: <span className="fw-bold" style={{ color: styles.titleColor, transition: 'color 0.3s ease' }}>{centro.psst.aprobado}</span>
                      </small>
                    </div>
                  </div>

                  {/* Botón adaptativo con estilo minimalista */}
                  <Link 
                    to={`/cedis/${encodeURIComponent(centro.cedis)}`} 
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
                ✨ No se detectaron brechas en los programas actuales.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TablaBrechas;