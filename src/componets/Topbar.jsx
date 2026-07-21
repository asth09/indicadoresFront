import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCedisRequest } from "../api/cedis";
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from 'xlsx';
import { faMagnifyingGlass, faBars, faBell, faUser, faEnvelope, faArrowRightFromBracket, faDownload } from '@fortawesome/free-solid-svg-icons';


const Topbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.usuario}`;

    const exportToExcel = async () => {
        try {
            const response = await getCedisRequest();
            const data = response.data;

            const cleanData = data.map((item) => {
                return {
                    "region": item.region,
                    "cedis": item.cedis,
                    "trabajadores": item.trabajadores,
                    "Delegados": item.delegados 
                    ? item.delegados.map(d => d.nombre).join(", ") 
                    : "Sin delegados",
                    "Patronos": item.patronos 
                    ? item.patronos.map(p => p.nombre).join(", ") 
                    : "Sin patronos",
                    "ssst": item.ssst ? JSON.stringify(item.ssst) : "N/A",
                    "psst": item.psst ? JSON.stringify(item.psst) : "N/A",
                    "comite": item.comite ? JSON.stringify(item.comite) : "N/A",
                    "politica": item.politica ? JSON.stringify(item.politica) : "N/A",
                    "formacion": item.formacion?.join(", ") || "N/A",
                    "informes": item.informes?.join(", ") || "N/A",
                    "estadisticas": item.estadisticas?.join(", ") || "N/A",
                    "form_extra": item.form_extra ? JSON.stringify(item.form_extra) : "N/A",
                    "accidentabilidad": item.accidentabilidad ? JSON.stringify(item.accidentabilidad) : "N/A",
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(cleanData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Cedis");
            XLSX.writeFile(workbook, "Reporte_Cedis.xlsx");

        } catch (error) {
            console.error("Error al exportar Excel:", error);
            alert("No se pudieron obtener los datos para el reporte");
        }
    };
    
    // Paleta de estilos dinámicos para el Topbar
    const styles = {
        navBg: isDark ? '#1f2937' : '#ffffff',
        border: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e5e7eb',
        shadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.04)',
        titleMain: isDark ? 'text-white' : 'text-dark',
        titleSub: isDark ? '#9ca3af' : '#4b5563',
        iconColorClass: isDark ? 'text-white-50' : 'text-secondary',
        divider: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
    };
    
    return (
        <nav className={`navbar navbar-expand ${isDark ? 'navbar-dark' : 'navbar-light'} mb-4 static-top border-bottom`} 
             style={{ 
                 backgroundColor: styles.navBg, 
                 borderColor: styles.border, 
                 boxShadow: styles.shadow,
                 transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
             }}>
            
            {/* Sidebar Toggle (Topbar) */}
            <button id="sidebarToggleTop" className={`btn btn-link d-md-none rounded-circle mr-3 ${styles.iconColorClass}`}>
                <FontAwesomeIcon icon={faBars} />
            </button> 

            {/* Topbar Titulo */}
            <div className="d-none d-sm-inline-block mr-auto ml-md-3 my-2 my-md-0 mw-100">
                <div className="d-flex flex-column justify-content-center">
                    <span className="text-uppercase mb-0 font-weight-bold" 
                          style={{ fontSize: '0.65rem', letterSpacing: '1px', color: styles.titleSub, transition: 'color 0.3s ease' }}>
                        Gerencia de Seguridad Industrial
                    </span>
                    
                    <h1 className={`h6 mb-0 font-weight-bold ${styles.titleMain}`} style={{ transition: 'color 0.3s ease' }}>
                        Dashboard de Gestión de Seguridad y Salud en el Trabajo
                    </h1>
                    
                    <span className="small font-weight-bold" style={{ color: '#3b82f6' }}>
                        Matriz corporativa de CEDIS <span style={{ color: styles.titleSub, transition: 'color 0.3s ease' }}>· Año 2026</span>
                    </span>
                </div>
            </div>

            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto align-items-center gap-2">

               {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'Gerente') && (
                <li className="nav-item">
                    <button 
                        onClick={exportToExcel}
                        className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2 shadow-sm"
                        style={{ fontSize: '0.85rem' }}
                    >
                        <FontAwesomeIcon icon={faDownload} size="sm" />
                        <span>Exportar a Excel</span>
                    </button>
                </li>
                )}
    

                {/* User */}
                {/* 🔐 Renderizado Condicional: Solo se muestra si está autenticado Y su rol es 'admin' */}
              {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'Gerente') && (
            <li className="nav-item dropdown no-arrow">
             <a className={`nav-link dropdown-toggle ${styles.iconColorClass}`} href="/user">
               <FontAwesomeIcon icon={faUser} />
             </a>
            </li>
      )}
                
                {/* Modo oscuro/claro */}
                <li className="nav-item dropdown no-arrow d-flex align-items-center px-1">
                    <button
                        onClick={toggleTheme}
                        className="btn p-0 border-0 d-flex align-items-center position-relative"
                        style={{
                            width: '58px',
                            height: '30px',
                            borderRadius: '30px',
                            backgroundColor: isDark ? '#111827' : '#e2e8f0', // Fondo gris oscuro (#1f2937) en oscuro
                            border: `1px solid ${isDark ? '#374151' : '#cbd5e1'}`,
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease, border-color 0.3s ease',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                        }}
                        aria-label="Cambiar tema"
                    >
                        {/* Círculo deslizante con el icono */}
                        <div
                            className="d-flex align-items-center justify-content-center position-absolute shadow-sm"
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: isDark ? '#3b82f6' : '#ffffff', // Azul nítido en oscuro o blanco en claro
                                left: isDark ? '30px' : '3px',
                                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
                            }}
                        >
                            {isDark ? (
                                <i className="bi bi-moon-fill" style={{ fontSize: '0.75rem', color: '#ffffff' }}></i>
                            ) : (
                                <i className="bi bi-sun-fill" style={{ fontSize: '0.85rem', color: '#d97706' }}></i>
                            )}
                        </div>
                    </button>
                </li>

                <div className="topbar-divider d-none d-sm-block" style={{ borderRight: `1px solid ${styles.divider}`, height: '2rem', margin: '0 8px', transition: 'border-color 0.3s ease' }}></div>

                {/* User Information */}
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle d-flex align-items-center p-0" href="#/">
                        <span className={`mr-2 d-none d-lg-inline small font-weight-bold ${styles.iconColorClass}`} style={{ transition: 'color 0.3s ease' }}>
                            {user.usuario}
                        </span>
                        <img 
                            className="img-profile rounded-circle border" 
                            src={avatarUrl} 
                            alt="Avatar"
                            style={{ width: '32px', height: '32px', borderColor: styles.divider, transition: 'border-color 0.3s ease' }} 
                        />
                    </a>
                </li>

                {/* Logout */}
                <li className="nav-item dropdown no-arrow">
                    <a className={`nav-link dropdown-toggle ${styles.iconColorClass}`} href="/" onClick={(e) => { e.preventDefault(); logout(); }}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Topbar;