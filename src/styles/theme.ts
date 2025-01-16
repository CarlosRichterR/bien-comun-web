const theme = {
  colors: {
    primary: "#0070f3", // Color principal
    secondary: "#ff4081", // Color secundario
    background: "#ffffff", // Fondo general
    textPrimary: "#171717", // Texto principal
    textSecondary: "#6b7280", // Texto secundario
    cardBackground: "#f8f9fa", // Fondo de las tarjetas
    border: "#e5e7eb", // Color para bordes
    error: "#dc2626", // Mensajes de error
    success: "#10b981", // Mensajes de éxito
  },
  spacing: (value: number ) => {
    const sizes: Record<string, string> = {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    };
    // Si el valor existe en tamaños predefinidos, devuélvelo; de lo contrario, asume que es un número y devuelve "valor px".
    return sizes[value] || `${value * 4}px`; // Escalado basado en 4px (1 = 4px, 2 = 8px, etc.)
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  boxShadow: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  },
  typography: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: {
      sm: "0.875rem", // 14px
      md: "1rem", // 16px
      lg: "1.25rem", // 20px
      xl: "1.5rem", // 24px
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
};

export default theme;
