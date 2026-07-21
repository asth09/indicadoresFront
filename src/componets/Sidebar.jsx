import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { generarInformePDF } from "../componets/InformePdf";
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

const Sidebar = () => {
    const [isToggled, setIsToggled] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleSidebarToggle = () => {
        setIsToggled(!isToggled);
    };

    // Estructura de datos modificada para coincidir con tu MongoDB (Mayúsculas)
    const regiones = [
        {
            titulo: "Andes",
            ciudades: [
                { name: 'SAN CRISTÓBAL', path: 'SAN CRISTOBAL', color: 'text-danger' },
                { name: 'LA FRÍA', path: 'LA FRIA', color: 'text-warning' },
                { name: 'MÉRIDA', path: 'MÉRIDA', color: 'text-warning' },
                { name: 'VALERA', path: 'VALERA', color: 'text-warning' },
                { name: 'CAJA SECA', path: 'CAJA SECA', color: 'text-warning' },
                { name: 'EL VIGÍA', path: 'EL VIGÍA', color: 'text-warning' },
            ]
        },
        {
            titulo: "Capital",
            ciudades: [
                { name: 'CARACAS ESTE', path: 'CARACAS ESTE', color: 'text-success' },
                { name: 'CARACAS OESTE', path: 'CARACAS OESTE', color: 'text-success' },
                { name: 'LA GUAIRA', path: 'LA GUAIRA', color: 'text-warning' },
                { name: 'GUARENAS', path: 'GUARENAS', color: 'text-success' },
                { name: 'VALLES DEL TUY', path: 'VALLES DEL TUY', color: 'text-warning' },
                { name: 'HIGUEROTE', path: 'HIGUEROTE', color: 'text-success' },
            ]
        },
        {
            titulo: "Centro llanos",
            ciudades: [
                { name: 'CAGUA', path: 'CAGUA', color: 'text-success' },
                { name: 'VALENCIA', path: 'VALENCIA', color: 'text-warning' },
                { name: 'PUERTO CABELLO', path: 'PUERTO CABELLO', color: 'text-danger' },
                { name: 'CALABOZO', path: 'CALABOZO', color: 'text-success' },
                { name: 'MARGARITA', path: 'MARGARITA', color: 'text-danger' },
            ]
        },
        {
            titulo: "Centro occidente",
            ciudades: [
                { name: 'BARQUISIMETO', path: 'BARQUISIMETO', color: 'text-success' },
                { name: 'CARORA', path: 'CARORA', color: 'text-success' },
                { name: 'BARINAS', path: 'BARINAS', color: 'text-success' },
                { name: 'SAN FELIPE', path: 'SAN FELIPE', color: 'text-success' },
                { name: 'ACARIGUA', path: 'ACARIGUA', color: 'text-danger' },
            ]
        },
        {
            titulo: "Occidente Norte",
            ciudades: [
                { name: 'CENTRO NORTE', path: 'CENTRO NORTE', color: 'text-warning' },
                { name: 'MARA', path: 'MARA', color: 'text-warning' },
                { name: 'CORO', path: 'CORO', color: 'text-danger' },
                { name: 'PUNTO FIJO', path: 'PUNTO FIJO', color: 'text-danger' },
                { name: 'DABAJURO', path: 'DABAJURO', color: 'text-success' },
            ]
        },
        {
            titulo: "Occidente sur",
            ciudades: [
                { name: 'SUR', path: 'SUR', color: 'text-warning' },
                { name: 'MENE GRANDE', path: 'MENE GRANDE', color: 'text-warning' },
                { name: 'LA VILLA', path: 'LA VILLA', color: 'text-warning' },
                { name: 'CABIMAS', path: 'CABIMAS', color: 'text-danger' },
                { name: 'CIUDAD OJEDA', path: 'CIUDAD OJEDA', color: 'text-danger' },
            ]
        },
        {
            titulo: "Oriente",
            ciudades: [
                { name: 'BARCELONA', path: 'BARCELONA', color: 'text-warning' },
                { name: 'MATURÍN', path: 'MATURIN', color: 'text-success' },
                { name: 'SAN FÉLIX', path: 'SAN FELIX', color: 'text-warning' },
                { name: 'CARÚPANO', path: 'CARUPANO', color: 'text-warning' },
                { name: 'CUMANÁ', path: 'CUMANA', color: 'text-warning' },
                { name: 'EL TIGRE', path: 'EL TIGRE', color: 'text-warning' },
                { name: 'ANACO', path: 'ANACO', color: 'text-warning' },
            ]
        }
    ];

    // Paleta de estilos adaptativa
    const styles = {
        sidebarBg: isDark ? '#1f2937' : '#fafafa',
        sidebarBorder: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb',
        divider: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb',
        subDivider: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #f3f4f6',
        headingColor: isDark ? '#9ca3af' : '#4b5563',      // Gris suave vs Gris intermedio oscuro
        cityName: isDark ? '#d1d5db' : '#1f2937',          // Gris claro vs Gris oscuro legible
        btnBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        btnBorder: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
        scrollbarThumb: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        togglerBg: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
        togglerColor: isDark ? '#ffffff' : '#4b5563',
    };

    return (
        <ul className={`navbar-nav sidebar ${isDark ? 'sidebar-dark' : 'sidebar-light'} accordion ${isToggled ? 'toggled' : ''}`} id="accordionSidebar"
            style={{ 
                backgroundColor: styles.sidebarBg, 
                borderRight: styles.sidebarBorder, 
                backgroundImage: 'none', 
                height: '100vh',            
                position: 'sticky',         
                top: 0,                     
                overflowY: 'auto',          
                overflowX: 'hidden',
                scrollbarWidth: 'thin',              
                scrollbarColor: `${styles.scrollbarThumb} ${styles.sidebarBg}`,
                transition: 'background-color 0.3s ease, border-color 0.3s ease'
            }}>

            {/* Sidebar - Brand */}
            <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/" style={{ height: '4.375rem' }}>
                <div className="sidebar-brand-icon">
                    <img 
                        className="img-fluid" 
                        src="/img/logo.PNG" 
                        alt="Logo" 
                        style={{ 
                            maxHeight: '90px', 
                            filter: isDark ? 'brightness(1.1)' : 'none',
                            transition: 'filter 0.3s ease'
                        }} 
                    />
                </div>
            </Link>

            <hr className="sidebar-divider" style={{ borderTop: styles.divider, margin: '0', transition: 'border-color 0.3s ease' }} />

            {/* Renderizado Dinámico de Secciones */}
            {regiones.map((región, idx) => (
                <React.Fragment key={idx}>
                    {/* Cabecera de Región con Botón de Informe */}
                    <div className="sidebar-heading d-flex justify-content-between align-items-center mt-4 mb-1 px-3">
                        <span style={{ 
                            color: styles.headingColor, 
                            fontSize: '0.65rem', 
                            fontWeight: '800', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1px',
                            transition: 'color 0.3s ease'
                        }}>
                            {región.titulo}
                        </span>
                        
                        {/* Botón de Informe estilo Cápsula */}
                        {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'Gerente') && (
                        <button 
                            className="btn btn-sm py-0 px-2"
                            style={{ 
                                fontSize: '0.6rem', 
                                backgroundColor: styles.btnBg, 
                                color: '#ef4444', 
                                border: styles.btnBorder,
                                borderRadius: '20px',
                                fontWeight: '700',
                                boxShadow: isDark ? '0 2px 4px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.04)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                generarInformePDF(región.titulo, región.titulo);
                            }}
                        >
                            Informe
                        </button>
                        )}
                    </div>

                    {región.ciudades.map((ciudad) => (
                        <li className="nav-item" key={ciudad.path}>
                            <Link 
                                className="nav-link py-2 d-flex align-items-center justify-content-between" 
                                to={`/cedis/${encodeURIComponent(ciudad.path)}`}
                                style={{ transition: 'all 0.2s' }}
                            >
                                <div>
                                    <FontAwesomeIcon 
                                        icon={faCircle} 
                                        className={`${ciudad.color} me-2`} 
                                        style={{ fontSize: '0.55rem' }} 
                                    />
                                    <span style={{ 
                                        color: styles.cityName, 
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        transition: 'color 0.3s ease' 
                                    }}>
                                        {ciudad.name}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                    
                    <hr className="sidebar-divider" style={{ borderTop: styles.subDivider, marginTop: '0.75rem', transition: 'border-color 0.3s ease' }} />
                </React.Fragment>
            ))}

            {/* Sidebar Toggler */}
            <div className="text-center d-none d-md-inline mt-3 pb-4">
                <button 
                    className="rounded-circle border-0" 
                    id="sidebarToggle"
                    onClick={handleSidebarToggle}
                    style={{ 
                        backgroundColor: styles.togglerBg, 
                        color: styles.togglerColor,
                        transition: 'all 0.3s ease' 
                    }}
                ></button>
            </div>
        </ul>
    );
};

export default Sidebar;