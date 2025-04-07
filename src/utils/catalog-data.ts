export type CatalogItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  supplier: string;
  referenceUrl?: string; // Add this line
};

export type PaginatedResponse = {
  items: CatalogItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
};

const allCatalogItems: CatalogItem[] = [
  {
    id: "item-1",
    name: "Blender",
    price: 49.99,
    category: "Kitchen",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "KitchenWare",
  },
  {
    id: "item-2",
    name: "Toaster",
    price: 29.99,
    category: "Kitchen",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "HomeAppliances",
  },
  {
    id: "item-3",
    name: "Coffee Maker",
    price: 79.99,
    category: "Kitchen",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "CoffeeLovers",
  },
  {
    id: "item-4",
    name: "Bedding Set",
    price: 89.99,
    category: "Bedroom",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "SweetDreams",
  },
  {
    id: "item-5",
    name: "Throw Pillows",
    price: 24.99,
    category: "Living Room",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "CozyHome",
  },
  {
    id: "item-6",
    name: "Picture Frames",
    price: 19.99,
    category: "Decor",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "FrameIt",
  },
  {
    id: "item-7",
    name: "Baby Monitor",
    price: 129.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "BabyTech",
  },
  {
    id: "item-8",
    name: "Diaper Bag",
    price: 59.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "BabyEssentials",
  },
  {
    id: "item-9",
    name: "Stroller",
    price: 199.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "BabyOnTheGo",
  },
  {
    id: "item-10",
    name: "Board Game Set",
    price: 39.99,
    category: "Entertainment",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "FunAndGames",
  },
  {
    id: "item-11",
    name: "Crib",
    price: 299.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "BabyDreams",
  },
  {
    id: "item-12",
    name: "High Chair",
    price: 89.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "BabyDining",
  },
  {
    id: "item-13",
    name: "Baby Bottles",
    price: 19.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "BabyFeeding",
  },
  {
    id: "item-14",
    name: "Pacifiers",
    price: 9.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "BabyComfort",
  },
  {
    id: "item-15",
    name: "Baby Clothes Set",
    price: 49.99,
    category: "Baby",
    imageUrl: "/placeholder.svg?height=100&width=100",
    supplier: "TinyFashion",
  },
];

export const fetchCatalogItems = (
  page: number = 1,
  itemsPerPage: number = 6,
  category?: string,
  searchTerm?: string,
  vendor?: string,
  priceRange?: [number, number]
): PaginatedResponse => {
  let filteredItems = allCatalogItems;

  if (category) {
    filteredItems = filteredItems.filter((item) => item.category === category);
  }

  if (searchTerm) {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseSearchTerm) ||
        item.category.toLowerCase().includes(lowercaseSearchTerm) ||
        item.supplier.toLowerCase().includes(lowercaseSearchTerm)
    );
  }

  if (vendor && vendor !== "All") {
    filteredItems = filteredItems.filter((item) => item.supplier === vendor);
  }

  if (priceRange) {
    filteredItems = filteredItems.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );
  }

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const items = filteredItems.slice(startIndex, endIndex);

  return {
    items,
    totalItems,
    currentPage: page,
    totalPages,
    itemsPerPage,
  };
};

export const categories = Array.from(
  new Set(allCatalogItems.map((item) => item.category))
);
