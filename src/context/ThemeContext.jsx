import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Intentamos recuperar el tema del localStorage, por defecto será 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Cada vez que el tema cambie, lo guardamos y actualizamos un atributo en el HTML
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Esto le avisa a Bootstrap o a tus CSS personalizados qué tema está activo
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema fácilmente en cualquier componente
export const useTheme = () => useContext(ThemeContext);