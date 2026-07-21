import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserRequest, updateUserRequest } from "../api/user";
import { useTheme } from "../context/ThemeContext";

// Componentes del Layout global
import Sidebar from "../componets/Sidebar";
import Footer from "../componets/Footer";
import Topbar from "../componets/Topbar";

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [usuario, setUsuario] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await getUserRequest(id);
        setUsuario(res.data.usuario);
        setRole(res.data.role);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        navigate("/user"); // Cambiado a /user para que regrese a la tabla correcta
      }
    };
    cargarUsuario();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosActualizados = { usuario, role };
      if (password.trim() !== "") {
        datosActualizados.password = password;
      }

      await updateUserRequest(id, datosActualizados);
      navigate("/user"); // Cambiado a /user para volver a la tabla
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  // --- VARIABLES DE ESTILO ADAPTATIVAS DEL WRAPPER ---
  const themeStyles = {
    backgroundColor: isDark ? '#111827' : '#f8f9fc', 
    color: isDark ? '#f3f4f6' : '#5a5c69'           
  };

  // --- ESTILOS INTERNOS DEL FORMULARIO CARD ---
  const formStyles = {
    cardBg: isDark ? '#1f2937' : '#ffffff',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
    textColor: isDark ? '#f3f4f6' : '#1f2937',
    inputBg: isDark ? '#374151' : '#ffffff',
    inputBorder: isDark ? '#4b5563' : '#cbd5e1',
  };

  return (
    <div 
      id="wrapper" 
      className="d-flex" 
      style={{ 
        backgroundColor: themeStyles.backgroundColor, 
        minHeight: '100vh', 
        color: themeStyles.color,
        transition: 'background-color 0.3s ease, color 0.3s ease' 
      }}
    >
      <Sidebar />
      
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
          
          <div className="container-fluid py-4 d-flex justify-content-center">
            {loading ? (
              <div className="text-center mt-5 text-muted">Cargando datos del usuario...</div>
            ) : (
              <div className="w-100" style={{ maxWidth: '500px', marginTop: '2rem' }}>
                <div 
                  className="card p-4 border-0" 
                  style={{ 
                    backgroundColor: formStyles.cardBg, 
                    border: formStyles.border, 
                    color: formStyles.textColor, 
                    borderRadius: '10px',
                    boxShadow: isDark ? '0 1rem 3rem rgba(0, 0, 0, 0.175)' : '0 0.15rem 1.75rem rgba(33, 40, 50, 0.05)'
                  }}
                >
                  <h4 className="mb-4 fw-bold">⚙️ Editar Usuario</h4>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nombre de Usuario</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        style={{ backgroundColor: formStyles.inputBg, borderColor: formStyles.inputBorder, color: formStyles.textColor }}
                        value={usuario} 
                        onChange={(e) => setUsuario(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Rol del Sistema</label>
                      <select 
                        className="form-select"
                        style={{ backgroundColor: formStyles.inputBg, borderColor: formStyles.inputBorder, color: formStyles.textColor }}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Analista">Analista</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Nueva Contraseña <span className="text-muted" style={{fontSize: '0.8rem'}}>(Dejar en blanco para no cambiar)</span></label>
                      <input 
                        type="password" 
                        className="form-control" 
                        style={{ backgroundColor: formStyles.inputBg, borderColor: formStyles.inputBorder, color: formStyles.textColor }}
                        value={password} 
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary w-100 rounded-pill">
                        Guardar Cambios
                      </button>
                      <Link to="/user" className="btn btn-outline-secondary w-100 rounded-pill">
                        Cancelar
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default UserFormPage;