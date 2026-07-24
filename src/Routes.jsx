import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, userRole, user } = useAuth();

  // Si está cargando el estado de autenticación, mostramos un loader
  if (loading) return <h1>Cargando...</h1>;

  // 1. Si no está autenticado, redirigir a Login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Obtener el rol actual (desde userRole o desde user.role) en MAYÚSCULAS
  const currentRole = (userRole || user?.role)?.toUpperCase();

  // 2. Si la ruta requiere roles específicos y el usuario no los tiene
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.map(r => r.toUpperCase()).includes(currentRole);

    if (!hasPermission) {
      // Si no es Administrador u otro rol permitido, redirigir al Home (o a donde no rompa)
      return <Navigate to="/" replace />;
    }
  }

  // 3. Si pasa las verificaciones, renderiza las rutas hijas
  return <Outlet />;
};