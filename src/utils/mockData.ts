import { CatalogItem } from "./catalog-data";

export const mockProgressReportData = {
  listName: "Lista de Boda de Juan y María",
  totalAmount: 5000,
  contributedAmount: 3500,
  contributors: [
    { name: "Carlos Pérez", amount: 1000, giftItem: "Refrigerador" },
    { name: "Ana García", amount: 800, giftItem: "Lavadora" },
    { name: "Luis Rodríguez", amount: 500, giftItem: "Microondas" },
    { name: "Elena Martínez", amount: 700, giftItem: "Juego de Comedor" },
    { name: "Roberto Sánchez", amount: 500, giftItem: "Televisor" },
  ],
  giftItems: [
    { name: "Refrigerador", price: 1500, contributedAmount: 1000 },
    { name: "Lavadora", price: 1000, contributedAmount: 800 },
    { name: "Microondas", price: 500, contributedAmount: 500 },
    { name: "Juego de Comedor", price: 1200, contributedAmount: 700 },
    { name: "Televisor", price: 800, contributedAmount: 500 },
  ],
};

export const mockPublishedListData: CatalogItem[] = [
  {
    id: "1",
    name: "Refrigerador",
    price: 1500,
    category: "Electrodomésticos",
    imageUrl: "/placeholder.svg?height=200&width=200",
    vendor: "ElectroHogar",
    contributedAmount: 1000,
  },
  {
    id: "2",
    name: "Lavadora",
    price: 1000,
    category: "Electrodomésticos",
    imageUrl: "/placeholder.svg?height=200&width=200",
    vendor: "ElectroHogar",
    contributedAmount: 800,
  },
  {
    id: "3",
    name: "Microondas",
    price: 500,
    category: "Electrodomésticos",
    imageUrl: "/placeholder.svg?height=200&width=200",
    vendor: "ElectroHogar",
    contributedAmount: 500,
  },
  {
    id: "4",
    name: "Juego de Comedor",
    price: 1200,
    category: "Muebles",
    imageUrl: "/placeholder.svg?height=200&width=200",
    vendor: "MuebleríaElegante",
    contributedAmount: 700,
  },
  {
    id: "5",
    name: "Televisor",
    price: 800,
    category: "Electrónica",
    imageUrl: "/placeholder.svg?height=200&width=200",
    vendor: "TechStore",
    contributedAmount: 500,
  },
];

export const mockPublishedListViewData = {
  listName: "Lista de Boda de Juan y María",
  eventType: "Boda",
  eventDate: "2023-12-15",
  giftItems: mockPublishedListData,
  minContribution: 50,
  startDate: "2023-06-01",
  endDate: "2023-12-01",
  totalCollected: 3500,
};
