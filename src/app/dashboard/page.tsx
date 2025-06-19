'use client';

import Dashboard from '../../components/Dashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const handleCreateNewList = () => {
        router.push('/dashboard/crear-lista');
    };

    const handleEditList = (listId: number) => {
        // Navegar a la ruta de edición con el id de la lista
        router.push(`/dashboard/editar-lista?id=${listId}`);
    };

    return (        <Dashboard
            onCreateNewList={handleCreateNewList}
            onEditList={handleEditList}
            onViewNotifications={() => { }}
            onViewProgressReport={() => { }}
        />
    );
}