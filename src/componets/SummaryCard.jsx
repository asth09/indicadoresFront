import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendar, 
  faDollarSign, 
  faClipboardList, 
  faBell, 
  faTriangleExclamation,
  faComments 
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

const iconMap = {
  "calendar": faCalendar,
  "dollar-sign": faDollarSign,
  "clipboard-list": faClipboardList,
  "comments": faComments,
  "alarm": faBell,
  "triangle": faTriangleExclamation
};

const SummaryCard = ({ title, value, color, icon, description, isProgress }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const name = icon ? icon.toLowerCase().trim() : "";
  const selectedIcon = iconMap[name] || faCalendar;

  // Mapeo de colores para el acento lateral y barras de progreso
  const colorHex = {
    danger: '#ef4444',   // Rojo vibrante
    warning: '#f59e0b',  // Ambar
    primary: '#3b82f6',  // Azul brillante
    success: '#10b981'   // Esmeralda
  };

  const accentColor = colorHex[color] || colorHex.primary;

  // Paleta de colores condicional según el modo activo
  const styles = {
    cardBg: isDark ? '#1f2937' : '#ffffff',
    cardBorder: isDark ? 'transparent' : '#f3eade',
    titleColor: isDark ? '#9ca3af' : '#4b5563',      // Gris suave vs Gris intermedio
    descColor: isDark ? '#6b7280' : '#9ca3af',       // Gris oscuro vs Gris claro
    textColorClass: isDark ? 'text-white' : 'text-dark',
    progressBg: isDark ? '#374151' : '#e5e7eb',      // Fondo de la barra de progreso
    iconOpacity: isDark ? '0.4' : '0.55'
  };

  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div 
        className="card shadow-sm h-100 py-2 border-0" 
        style={{ 
          backgroundColor: styles.cardBg, 
          borderLeft: `4px solid ${accentColor}`,
          borderTop: isDark ? 'none' : `1px solid ${styles.cardBorder}`,
          borderRight: isDark ? 'none' : `1px solid ${styles.cardBorder}`,
          borderBottom: isDark ? 'none' : `1px solid ${styles.cardBorder}`,
          borderRadius: '10px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
      >
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              {/* Título */}
              <div 
                className="text-xs font-weight-bold text-uppercase mb-1"
                style={{ color: styles.titleColor, letterSpacing: '0.5px', transition: 'color 0.3s ease' }}
              >
                {title}
              </div>

              {/* Descripción */}
              <div className="small mb-2" style={{ color: styles.descColor, fontSize: '0.75rem', transition: 'color 0.3s ease' }}>
                {description}
              </div>
              
              {isProgress ? (
                <div className="row no-gutters align-items-center">
                  <div className="col-auto">
                    <div className={`h5 mb-0 mr-3 font-weight-bold ${styles.textColorClass}`} style={{ transition: 'color 0.3s ease' }}>
                      {value}%
                    </div>
                  </div>
                  <div className="col">
                    <div className="progress progress-sm mr-2" style={{ backgroundColor: styles.progressBg, height: '6px', transition: 'background-color 0.3s ease' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${value}%`, 
                          backgroundColor: accentColor,
                          boxShadow: isDark ? `0 0 8px ${accentColor}66` : 'none' // Brillo sutil solo en modo oscuro
                        }} 
                        aria-valuenow={value} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`h5 mb-0 font-weight-bold ${styles.textColorClass}`} style={{ transition: 'color 0.3s ease' }}>
                    {value}
                </div>
              )}
            </div>
            <div className="col-auto">
              <FontAwesomeIcon 
                icon={selectedIcon} 
                size="2x" 
                style={{ color: accentColor, opacity: styles.iconOpacity, transition: 'opacity 0.3s ease' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;