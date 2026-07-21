import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const dummyData = [
  { name: 'EN', IFN: 0, IFB: 0, IS: 0 }, { name: 'FE', IFN: 0, IFB: 0, IS: 0 },
  { name: 'MA', IFN: 0, IFB: 0, IS: 0 }, { name: 'AB', IFN: 0, IFB: 0, IS: 0 },
  { name: 'MY', IFN: 0, IFB: 0, IS: 0 }, { name: 'JN', IFN: 0, IFB: 0, IS: 0 },
  { name: 'JL', IFN: 0, IFB: 0, IS: 0 }, { name: 'AG', IFN: 0, IFB: 0, IS: 0 },
  { name: 'SE', IFN: 0, IFB: 0, IS: 0 }, { name: 'OC', IFN: 0, IFB: 0, IS: 0 },
  { name: 'NO', IFN: 0, IFB: 0, IS: 0 }, { name: 'DI', IFN: 0, IFB: 0, IS: 0 },
];

const SafetyCard = ({ title, dataKey, color, textColorClass, totalValue, data, isDark }) => {
  // Aplicamos tus nuevos colores aquí
  const styles = {
    cardBg: isDark ? '#1f2937' : '#fafafa',       // Superficie de tarjeta en oscuro
    cardBorder: isDark ? '#374151' : '#f3eade',   // Borde un poco más claro que el fondo
    chartBg: isDark ? '#111827' : '#fffcf8',      // Fondo interno del gráfico (más oscuro)
    chartBorder: isDark ? '#1f2937' : '#f9f3eb', 
    pillBg: isDark ? '#374151' : '#ffffff',       // Píldoras inferiores de los meses
    pillBorder: isDark ? '#4b5563' : '#f0e6da',
    textColor: isDark ? 'text-light' : 'text-dark',
    mutedColor: isDark ? '#9ca3af' : '#a0a0a0'    // Gris suavizado para los textos secundarios
  };

  return (
    <div 
      className="card shadow-sm p-4 w-100" 
      style={{ 
        backgroundColor: styles.cardBg, 
        borderColor: styles.cardBorder, 
        borderRadius: '24px',
        maxWidth: '450px',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className={`fw-bold text-uppercase m-0 tracking-wide ${styles.textColor}`} style={{ fontSize: '0.85rem' }}>
          {title}
        </h6>
        <span className={`fw-bold ${textColorClass}`} style={{ fontSize: '0.85rem' }}>
          {totalValue} MESES
        </span>
      </div>

      <div 
        className="p-3 mb-4 d-flex flex-column justify-content-between"
        style={{ 
          backgroundColor: styles.chartBg, 
          border: `1px solid ${styles.chartBorder}`, 
          borderRadius: '20px',
          height: '180px'
        }}
      >
        <div style={{ width: '100%', height: '110px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: styles.mutedColor, fontSize: 10, fontWeight: 'bold' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#fff', 
                  borderRadius: '8px', 
                  color: isDark ? '#fff' : '#000', 
                  fontSize: '12px',
                  borderColor: styles.chartBorder 
                }}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="m-0 font-weight-medium" style={{ fontSize: '0.75rem', color: styles.mutedColor }}>
          Comportamiento mensual 2026
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center gap-1 overflow-auto pb-1">
        {data.map((item, index) => (
          <div key={index} className="d-flex flex-column align-items-center gap-2" style={{ minWidth: '28px' }}>
            <div 
              className="border d-flex align-items-center justify-content-center shadow-sm"
              style={{ 
                backgroundColor: styles.pillBg,
                borderColor: styles.pillBorder, 
                borderRadius: '50px', 
                width: '28px', 
                height: '40px' 
              }}
            >
              <span className={`${styles.textColor} fw-bold`} style={{ fontSize: '0.75rem' }}>
                {item[dataKey]}
              </span>
            </div>
            <span className="text-uppercase fw-bold" style={{ fontSize: '0.65rem', color: styles.mutedColor }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardSafetyCards() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className="container-fluid py-4" 
      style={{ 
        backgroundColor: isDark ? '#111827' : '#eeeeee', // El contenedor principal usa el fondo oscuro de tu app
        minHeight: '20vh',
        transition: 'all 0.3s ease' 
      }}
    >
      <div className="d-flex flex-nowrap justify-content-start justify-content-md-center gap-4 align-items-start overflow-x-auto px-2 pb-3">
        <SafetyCard title="Índice de Frecuencia Neta · IFN" dataKey="IFN" color="#d84315" textColorClass="text-danger" totalValue="0/12" data={dummyData} isDark={isDark} />
        <SafetyCard title="Índice de Frecuencia Bruta · IFB" dataKey="IFB" color="#d97706" textColorClass="text-warning" totalValue="0/12" data={dummyData} isDark={isDark} />
        <SafetyCard title="Índice de Severidad · IS" dataKey="IS" color="#d84315" textColorClass="text-danger" totalValue="0/12" data={dummyData} isDark={isDark} />
      </div>
    </div>
  );
}