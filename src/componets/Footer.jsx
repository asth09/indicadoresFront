import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Importación de tu contexto de tema

const Footer = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    // Obtenemos el año actual dinámicamente
    const currentYear = new Date().getFullYear();

    // Paleta de estilos adaptativos para el Footer
    const styles = {
        bg: isDark ? '#111827' : '#ffffff',              // Fondo oscuro profundo vs Blanco limpio
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e3e6f0', // Divisor sutil adaptado
        textColor: isDark ? '#6b7280' : '#858796'         // Gris tenue balanceado según el contraste
    };

    return (
        <footer 
            className="sticky-footer" 
            style={{ 
                backgroundColor: styles.bg, 
                padding: '2rem 0',
                borderTop: styles.borderTop,
                transition: 'background-color 0.3s ease, border-top 0.3s ease'
            }}
        >
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span 
                        style={{ 
                            color: styles.textColor, 
                            fontSize: '0.85rem',
                            transition: 'color 0.3s ease'
                        }}
                    >
                        Copyright &copy; Cervecería Regional {currentYear} 
                        <span className="mx-2">|</span> 
                        Sistema Integrado de Seguridad Industrial
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;