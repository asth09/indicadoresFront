import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { getUsersRequest } from "../api/user"; 
import { useTheme } from '../context/ThemeContext';

const TableUser = () => {
  const [users, setUsers] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await getUsersRequest();
        setUsers(res.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };
    cargarUsuarios();
  }, []);

  const styles = {
    cardBg: isDark ? '#1f2937' : '#ffffff',
    cardShadow: isDark ? '0 1rem 3rem rgba(0, 0, 0, 0.175)' : '0 0.15rem 1.75rem rgba(33, 40, 50, 0.05)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
    divider: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
    titleColor: isDark ? '#60a5fa' : '#1d4ed8', 
    nameColor: isDark ? '#e5e7eb' : '#1f2937', 
    subTextColor: isDark ? '#9ca3af' : '#4b5563', 
    strongColor: isDark ? '#f3f4f6' : '#111827', 
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
        <div className="card-header bg-transparent py-3" style={{ borderBottom: `1px solid ${styles.divider}` }}>
          <h5 className="mb-0 fw-bold" style={{ color: styles.titleColor }}>
            👤 Gestión de Usuarios
          </h5>
        </div>

        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            {users.length > 0 ? (
              users.map((u) => {
                const isAdmin = u.role?.toLowerCase() === 'admin';
                
                return (
                  <li 
                    key={u._id} 
                    className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent"
                    style={{ borderBottom: `1px solid ${styles.divider}` }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-3" style={{ fontSize: "1.2rem" }}>
                        {isAdmin ? "🔑" : "👤"}
                      </span>

                      <div>
                        <h6 className="mb-0 text-uppercase fw-bold" style={{ fontSize: '0.9rem', color: styles.nameColor }}>
                          {u.usuario}
                        </h6>
                        <small style={{ color: styles.subTextColor }}>
                          Rol asignado: <strong style={{ color: styles.strongColor }}>{u.role || 'Sin Rol'}</strong>
                        </small>
                        
                        <div className="mt-1">
                          <span 
                            className="badge rounded-pill" 
                            style={{ 
                              backgroundColor: isAdmin ? 'rgba(59, 130, 246, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                              color: isAdmin ? (isDark ? '#93c5fd' : '#2563eb') : (isDark ? '#d1d5db' : '#4b5563'),
                              border: `1px solid ${isAdmin ? '#3b82f6' : '#6b7280'}44`
                            }}
                          >
                            {isAdmin ? 'Administrador' : 'Usuario Estándar'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ajustado para apuntar a /user/:id en concordancia con tu backend */}
                    {isAuthenticated && user?.role?.toLowerCase() === 'admin' && (
                      <Link 
                        to={`/user/${u._id}`} 
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        style={{ 
                          fontSize: '0.75rem', 
                          color: styles.btnColor, 
                          borderColor: styles.btnBorder,
                          transition: 'all 0.3s ease' 
                        }}
                      >
                        Editar Perfil
                      </Link>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="list-group-item text-center py-5 bg-transparent text-muted">
                No hay usuarios registrados.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TableUser;