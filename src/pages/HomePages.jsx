import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Sidebar from "../componets/Sidebar";
import Footer from "../componets/Footer";
import Topbar from "../componets/Topbar";
import DashboardCards from "../componets/Cards";
import InicioAlertas from "../componets/DeleVen";
import ProximosVencimientos from "../componets/deleProxVenci";
import TablaBrechas from "../componets/Brechas";
import TablaComitesAlertas from "../componets/TablaComitesAlertas";
import { getNationalReportRequest } from "../api/cedis";
import { useAuth } from "../context/AuthContext";
import generarInformeNacionalPDF from "../componets/InformeNacional";
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

function HomePages() {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isDark = theme === 'dark';

  const handleDownloadNationalReport = async () => {
      try {
          const res = await getNationalReportRequest();
          if (res.data) {
              generarInformeNacionalPDF(res.data);
          }
      } catch (error) {
          console.error("Error al obtener el reporte nacional:", error);
          alert("No se pudo obtener la información para el reporte nacional.");
      }
  };
    
  // Configuración de fondos y textos globales de la página
  const pageStyles = {
      wrapperBg: isDark ? '#111827' : '#f8f9fc',       // Fondo general oscuro profundo vs gris claro limpio
      contentBg: isDark ? '#111827' : '#f8f9fc',       // Sincronizado con el contenedor principal
      titleColor: isDark ? '#f3f4f6' : '#5a5c69',     // Texto blanco grisáceo vs gris corporativo oscuro
  };

  return (
    <div 
      id="wrapper" 
      data-bs-theme={isDark ? "dark" : "light"} 
      style={{ 
        backgroundColor: pageStyles.wrapperBg, 
        minHeight: '100vh',
        transition: 'background-color 0.3s ease' 
      }}
    >
      <Sidebar/>
      
      {/* Content Wrapper */}
      <div 
        id="content-wrapper" 
        className="d-flex flex-column" 
        style={{ 
          backgroundColor: pageStyles.contentBg,
          transition: 'background-color 0.3s ease' 
        }}
      >
        <div id="content">
          {/* Topbar */}
          <Topbar/>

          {/* Begin Page Content */}
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 
                className="h3 mb-0 font-weight-bold" 
                style={{ 
                  color: pageStyles.titleColor,
                  transition: 'color 0.3s ease' 
                }}
              >
                Dashboard
              </h1>

             {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'Gerente') && (
              <button 
                onClick={handleDownloadNationalReport}
                className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2 shadow-sm"
                style={{ fontSize: '0.85rem' }}
              >
                <FontAwesomeIcon icon={faDownload} size="sm" />
                <span>Informe Nacional</span>
              </button>
              )}
            </div>

            {/* Fila de Tarjetas (Cards) */}
            <div className="row">
              <DashboardCards/>
            </div>

            {/* Delegados vencidos */}
            <div className="row">
              <InicioAlertas/>
            </div>

            {/* Delegados próximos a vencer */}
            <div className="row">
              <ProximosVencimientos/>
            </div>

            {/* Alertas de Comités */}
            <div className="row">
              <TablaComitesAlertas/>
            </div>

            {/* Brechas */}
            <div className="row">
              <TablaBrechas/>
            </div>
          </div>
        </div>
        
        <Footer/>
      </div>
    </div>
  );
}

export default HomePages;