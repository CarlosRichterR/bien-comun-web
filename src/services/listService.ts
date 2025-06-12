export interface GiftList {
  id: number;
  listName: string;
  eventType: string;
  customEventType?: string;
  listStatus: string;
  guestCount: number;
  minContribution: number;
  eventDate?: string;
  campaignStartDate?: string;
  campaignEndDate?: string;
  address?: string;
  // Agrega más campos según el modelo real
}

export async function fetchGiftLists(): Promise<GiftList[]> {
  const res = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include' // Si usas cookies para auth
  });
  if (!res.ok) throw new Error('Error al obtener las listas');
  return res.json();
}

export async function deleteGiftList(id: number): Promise<void> {
  const res = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/list/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Error al borrar la lista');
}
