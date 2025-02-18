'use client';

import { GiftListCreationProcess } from '../../../components/gift-list/GiftListCreationProcess';
import { useRouter } from 'next/navigation';
export default function CrearListaPage() {
    const router = useRouter()
    const handleListCreationComplete = (listData: any) => {
        console.log("New list created:", listData);
        // Redirigir al dashboard después de crear la lista
        router.push('/dashboard');
    };

    return (
        <GiftListCreationProcess
            onComplete={handleListCreationComplete}
            onExit={() => router.push('/dashboard')}
            onBack={() => router.push('/dashboard')}
        />
    );
}