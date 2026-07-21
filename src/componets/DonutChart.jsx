import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los elementos necesarios para gráficos circulares
ChartJS.register(ArcElement, Tooltip, Legend);

// 1. Configuración de Estilos Globales (Consistente con los anteriores)
ChartJS.defaults.font.family = 'Nunito, -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
ChartJS.defaults.color = '#858796';

const DonutChartComponent = () => {
  // 2. Datos del Gráfico
  const data = {
    labels: ["Direct", "Referral", "Social"],
    datasets: [{
      data: [55, 30, 15],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  };

  // 3. Opciones del Gráfico
  const options = {
    maintainAspectRatio: false,
    cutout: '80%', // Reemplaza a cutoutPercentage: 80
    plugins: {
      legend: {
        display: false // Ocultamos la leyenda original para usar una personalizada si deseas
      },
      tooltip: {
        backgroundColor: "rgb(255,255,255)",
        bodyColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        padding: 15,
        displayColors: false,
        caretPadding: 10,
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      {/* Card Header - Dropdown */}
      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">Fuentes de Ingresos</h6>
      </div>
      {/* Card Body */}
      <div className="card-body">
        <div className="chart-pie pt-4 pb-2" style={{ height: '300px', position: 'relative' }}>
          <Doughnut data={data} options={options} />
        </div>
        
        {/* Leyenda personalizada estilo SB Admin 2 */}
        <div className="mt-4 text-center small">
          <span className="mr-2">
            <FontAwesomeIcon icon={faCircle} className="text-primary" /> Direct
          </span>
          <span className="mr-2">
            <FontAwesomeIcon icon={faCircle} className="text-success" />  Referral
          </span>
          <span className="mr-2">
             <FontAwesomeIcon icon={faCircle} className="text-info" /> Social
          </span>
        </div>
      </div>
    </div>
  );
};

export default DonutChartComponent;