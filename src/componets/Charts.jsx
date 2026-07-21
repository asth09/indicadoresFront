import AreaChartComponent from "./AreaChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Registramos los componentes de Chart.js necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartsSection = () => {
  // Datos de ejemplo (Aquí conectarías luego con tu API de MongoDB)
  const dataLine = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{
      label: "Indicador de Seguridad",
      data: [0, 10000, 5000, 15000, 10000, 20000],
      fill: true,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
    }]
  };

  const dataBar = {
    labels: ["Enero", "Febrero", "Marzo", "Abril"],
    datasets: [{
      label: "Reportes",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",
      data: [4215, 5312, 6251, 7841],
    }]
  };

  const dataDoughnut = {
    labels: ["Directo", "Social", "Referencial"],
    datasets: [{
      data: [55, 30, 15],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <h1 className="h3 mb-2 text-gray-800">Gráficos de Indicadores</h1>
      <p className="mb-4">
        Visualización de datos para el seguimiento de seguridad industrial.
      </p>

      {/* Content Row */}
      <div className="row">
        <div className="col-xl-8 col-lg-7">
          {/* Area Chart */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Tendencia Mensual</h6>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <Line data={dataLine} options={{ maintainAspectRatio: false }} />
              </div>
              <hr />
              Análisis dinámico de indicadores de C.A. Cervecería Regional.
            </div>
          </div>

          {/* Bar Chart */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Reportes por Mes</h6>
            </div>
            <div className="card-body">
              <div className="chart-bar">
                <Bar data={dataBar} options={{ maintainAspectRatio: false }} />
              </div>
              <hr />
              Comparativa de gestión de incidentes.
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Distribución de Casos</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4">
                <Doughnut data={dataDoughnut} options={{ maintainAspectRatio: false }} />
              </div>
              <hr />
              Clasificación porcentual de eventos detectados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;