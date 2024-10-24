"use client";

import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <html lang="es">
            <head>
                <title>Bien Común - Dashboard</title>
                <meta name="description" content="Administra tus listas de regalos fácilmente con Bien Común." />
            </head>
            <body style={bodyStyle}>
                {/* Header - Encabezado del Dashboard */}
                <header style={headerStyle}>
                    <h1 style={{ fontSize: '2rem' }}>¡Bienvenidos!</h1>
                    <nav>
                        <button onClick={() => router.push('/profile')} style={navButtonStyle}>Perfil</button>
                        <button onClick={() => router.push('/logout')} style={navButtonStyle}>Cerrar Sesión</button>
                    </nav>
                </header>

                {/* Contenido de la página */}
                <main style={mainStyle}>
                    {children}
                </main>

                {/* Footer - Pie de página del Dashboard */}
                <footer style={footerStyle}>
                    <p>Bien Común © 2024 - Todos los derechos reservados.</p>
                </footer>
            </body>
        </html>
    );
}

const bodyStyle = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    minHeight: '100vh',
    margin: '0',
    fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
};

const navButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginLeft: '1rem',
    cursor: 'pointer',
};

const mainStyle = {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as 'column',
    padding: '2rem',
};

const footerStyle = {
    textAlign: 'center' as 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    color: '#666',
};
