'use client';

import Dashboard from '../../components/Dashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const handleCreateNewList = () => {
        router.push('/dashboard/crear-lista');
    };

    return (
        <Dashboard
            onCreateNewList={handleCreateNewList}
            onEditList={() => { }}
            onViewList={() => { }}
            onViewNotifications={() => { }}
            onViewProgressReport={() => { }}
        />
    );
}