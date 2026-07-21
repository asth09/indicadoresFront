import Sidebar from "../componets/Sidebar";
import Footer from "../componets/Footer";
import Topbar from "../componets/Topbar";
import DetalleCedis from "../componets/DetalleCedis"; // El componente dinámico
import { useTheme } from "../context/ThemeContext"; // Importamos el contexto del tema

function CedisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // --- VARIABLES DE ESTILO ADAPTATIVAS ---
  const themeStyles = {
    backgroundColor: isDark ? '#111827' : '#f8f9fc', // Fondo oscuro tipo slate o fondo claro grisáceo clásico de SB Admin
    color: isDark ? '#f3f4f6' : '#5a5c69'           // Texto claro o texto oscuro gris principal
  };

  return (
    // d-flex asegura que el Sidebar y el content-wrapper se coloquen correctamente lado a lado
    <div 
      id="wrapper" 
      className="d-flex" 
      style={{ 
        backgroundColor: themeStyles.backgroundColor, 
        minHeight: '100vh', 
        color: themeStyles.color,
        transition: 'background-color 0.3s ease, color 0.3s ease' // Transición suave al cambiar de modo
      }}
    >
      <Sidebar />
      
      {/* content-wrapper ocupa el resto del espacio disponible (flex-grow-1) */}
      <div 
        id="content-wrapper" 
        className="d-flex flex-column flex-grow-1" 
        style={{ 
          backgroundColor: themeStyles.backgroundColor, 
          minHeight: '100vh',
          transition: 'background-color 0.3s ease'
        }}
      >
        <div id="content">
          <Topbar />
          
          {/* Añadido py-4 para consistencia con el espaciado del layout */}
          <div className="container-fluid py-4">
            {/* 
                Eliminada la clase 'row' ya que DetalleCedis maneja su propia grilla interna.
            */}
            <div className="mt-2">
              <DetalleCedis />
            </div>
          </div>
        </div>
        
        {/* El Footer se mantendrá abajo gracias al comportamiento flex-column */}
        <Footer />
      </div>
    </div>
  );
}

export default CedisPage;