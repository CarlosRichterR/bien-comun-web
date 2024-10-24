"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  // Handlers para las acciones principales
  const handleCreateList = () => {
    router.push('/create-list');
  };

  const handleViewLists = () => {
    router.push('/view-lists');
  };

  return (
    <section style={actionSectionStyle}>
      <h2 style={{ marginBottom: '1rem' }}>Gestiona tus listas de regalos</h2>
      <div style={buttonGroupStyle}>
        <button onClick={handleCreateList} style={mainButtonStyle}>Crear Nueva Lista</button>
        <button onClick={handleViewLists} style={mainButtonStyle}>Ver Listas Creadas</button>
      </div>

      <section style={currentListsSectionStyle}>
        <h3 style={{ marginBottom: '1rem' }}>Tus Listas Actuales</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Aquí se mapearían las listas actuales del usuario, como ejemplo haré 2 listas ficticias */}
          <div style={listItemStyle}>
            <h4>Lista de Boda - Playa</h4>
            <button style={secondaryButtonStyle}>Ver Detalles</button>
          </div>
          <div style={listItemStyle}>
            <h4>Lista de Hogar</h4>
            <button style={secondaryButtonStyle}>Ver Detalles</button>
          </div>
        </div>
      </section>
    </section>
  );
}

// Estilos en línea para mantener el ejemplo sencillo y autocontenido
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

const currentListsSectionStyle = {
  padding: '1rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '8px',
};

const listItemStyle = {
  padding: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
};

const secondaryButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
