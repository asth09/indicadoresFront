import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./Routes";

import LoginPages from "./pages/LoginPages";
import RegisterPages from "./pages/RegisterPages";
import HomePages from "./pages/HomePages";
import UserPages from "./pages/UserPages";
import UserFormPage from "./pages/UserFormPage";
import CedisPages from "./pages/CedisPages";

function App() {
  
  return (
    <AuthProvider> 
      <ThemeProvider>
        <BrowserRouter>
            <Routes> 
              <Route path="/login" element={<LoginPages/>} />
              <Route path="/register" element={<RegisterPages/>} />
              <Route path="/contacto" element={<h1>Contacto Page</h1>} />

              {/* Aquí es donde proteges las rutas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePages/>} />
                <Route path="/user" element={<UserPages/>} />
                <Route path="/user/:id" element={<UserFormPage />} />
                <Route path="/cedis/:name" element={<CedisPages />} />
              </Route>
            </Routes>
          </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App