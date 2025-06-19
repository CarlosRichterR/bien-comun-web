import { CatalogItem } from "../utils/catalog-data";

export async function fetchGiftListWithProducts(id: number): Promise<{ products: CatalogItem[] } & any> {
  const res = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/list/${id}`);
  if (!res.ok) throw new Error('Error al obtener la lista con productos');
  return res.json();
}
