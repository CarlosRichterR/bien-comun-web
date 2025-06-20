'use client';

import { useEffect, useState, use } from 'react';
import { PublishedListView } from '@/components/gift-list/PublishedListView';

export default function ListaPublicaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [listData, setListData] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    const fetchData = async () => {
      try {
        // Fetch list data
        const listRes = await fetch(`${process.env.API_URL}/api/list/${resolvedParams.id}`);
        const listData = listRes.ok ? await listRes.json() : null;

        // Fetch contributions
        const contribRes = await fetch(`${process.env.API_URL}/api/list/${resolvedParams.id}/contributions`);
        const contributions = contribRes.ok ? await contribRes.json() : [];

        setListData(listData);
        setContributions(contributions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!listData) return <div className="p-8 text-center">No se encontró la lista.</div>;

  return (
    <PublishedListView
      listName={listData.listName}
      eventType={listData.eventType}
      eventDate={listData.eventDate}
      giftItems={listData.products || []}
      minContribution={listData.minContribution}
      onBack={() => window.history.back()}
      startDate={listData.campaignStartDate}
      endDate={listData.campaignEndDate}
      totalCollected={listData.totalCollected || 0}
      contributions={contributions}
    />
  );
}
