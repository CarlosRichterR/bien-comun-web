"use client";

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    // Handlers para las acciones principales
    const handleCreateList = () => {
        router.push('/dashboard/create-list'); // Ruta para crear una nueva lista
    };

    const handleViewLists = () => {
        router.push('/dashboard/view-lists'); // Ruta para ver listas creadas
    };

    return (
        <section style={actionSectionStyle}>
            <h2 style={{ marginBottom: '1rem' }}>Gestiona tus listas de regalos</h2>
            <div style={buttonGroupStyle}>
                <button onClick={handleCreateList} style={mainButtonStyle}>Crear Nueva Lista</button>
                <button onClick={handleViewLists} style={mainButtonStyle}>Ver Listas Creadas</button>
            </div>
        </section>
    );
}

const actionSectionStyle = {
    marginBottom: '2rem',
    padding: '1rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    textAlign: 'center',
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem',
};

const mainButtonStyle = {
    padding: '1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    minWidth: '200px',
};
