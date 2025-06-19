"use client";

import Dashboard from '../../../components/Dashboard';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditarListaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Optionally, you can get the list id from the query string or path
    // const listId = searchParams.get('id');

    return (
        <Dashboard
            onCreateNewList={() => router.push('/dashboard/crear-lista')}
            onEditList={() => {}}
            onViewList={() => {}}
            onViewNotifications={() => {}}
            onViewProgressReport={() => {}}
            editMode={true} // Optional: pass a prop to indicate edit mode
        />
    );
}
