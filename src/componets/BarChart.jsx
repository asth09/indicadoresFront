import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registro de componentes necesarios para gráficos de barras
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 1. Configuración de Estilos Globales
ChartJS.defaults.font.family = 'Nunito, -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
ChartJS.defaults.color = '#858796';

// 2. Función auxiliar para formato de números
const numberFormat = (number, decimals, dec_point, thousands_sep) => {
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = (n, prec) => {
      let k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
};

const BarChartComponent = () => {
  // 3. Datos del Gráfico
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [{
      label: "Revenue",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",
      data: [4215, 5312, 6251, 7841, 9821, 14984],
      maxBarThickness: 25, // Grosor de la barra tal cual el JS original
    }],
  };

  // 4. Opciones del Gráfico (Migradas a v3/v4)
  const options = {
    maintainAspectRatio: false,
    layout: {
      padding: { left: 10, right: 25, top: 25, bottom: 0 }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { maxTicksLimit: 6 }
      },
      y: {
        min: 0,
        max: 15000,
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Formato con signo de dólar y la función number_format
          callback: (value) => '$' + numberFormat(value)
        },
        grid: {
          color: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        titleMarginBottom: 10,
        titleColor: '#6e707e',
        titleFont: { size: 14 },
        backgroundColor: "rgb(255,255,255)",
        bodyColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        padding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            return `${label}: $${numberFormat(context.parsed.y)}`;
          }
        }
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Bar Chart (Revenue)</h6>
      </div>
      <div className="card-body">
        <div className="chart-bar" style={{ height: '320px', position: 'relative' }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;