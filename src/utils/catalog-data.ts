export type CatalogItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  thumbnailUrl?: string; // Added this property
  supplier: string;
  contributedAmount?: number; // Added this property to fix errors
  quantity?: number;
  referenceUrl?: string; // Add this line
  imageUrls?: string[]; // Add this property for high-quality images
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
    imageUrl:
      "https://www.oster.com.mx/on/demandware.static/-/Sites-oster-Library/default/dw4a9f4e0c/images/hi-res/BLSTKAGRRD-013-1.jpg",
    supplier: "KitchenWare",
    imageUrls: [
      "https://www.oster.com.mx/on/demandware.static/-/Sites-oster-Library/default/dw4a9f4e0c/images/hi-res/BLSTKAGRRD-013-1.jpg",
    ],
  },
  {
    id: "item-2",
    name: "Toaster",
    price: 29.99,
    category: "Kitchen",
    imageUrl: "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    supplier: "HomeAppliances",
    imageUrls: [
      "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-3",
    name: "Coffee Maker",
    price: 79.99,
    category: "Kitchen",
    imageUrl: "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    supplier: "CoffeeLovers",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-4",
    name: "Bedding Set",
    price: 89.99,
    category: "Bedroom",
    imageUrl:
      "https://www.bhg.com/thmb/9eYw8Ue5p3xv6YxVh7o5fYx2n6M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pottery-barn-mark-sikes-collection-bedding-11733457-05132525-1-2000-5e8f5e2a3a2b4a1e8e9f5e2a3a2b4a1e.jpg",
    supplier: "SweetDreams",
    imageUrls: [
      "https://www.bhg.com/thmb/9eYw8Ue5p3xv6YxVh7o5fYx2n6M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pottery-barn-mark-sikes-collection-bedding-11733457-05132525-1-2000-5e8f5e2a3a2b4a1e8e9f5e2a3a2b4a1e.jpg",
    ],
  },
  {
    id: "item-5",
    name: "Throw Pillows",
    price: 24.99,
    category: "Living Room",
    imageUrl: "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    supplier: "CozyHome",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-6",
    name: "Picture Frames",
    price: 19.99,
    category: "Decor",
    imageUrl: "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    supplier: "FrameIt",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-7",
    name: "Baby Monitor",
    price: 129.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    supplier: "BabyTech",
    imageUrls: [
      "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-8",
    name: "Diaper Bag",
    price: 59.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    supplier: "BabyEssentials",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-9",
    name: "Stroller",
    price: 199.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    supplier: "BabyOnTheGo",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-10",
    name: "Board Game Set",
    price: 39.99,
    category: "Entertainment",
    imageUrl: "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    supplier: "FunAndGames",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-11",
    name: "Crib",
    price: 299.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    supplier: "BabyDreams",
    imageUrls: [
      "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-12",
    name: "High Chair",
    price: 89.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    supplier: "BabyDining",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-13",
    name: "Baby Bottles",
    price: 19.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    supplier: "BabyFeeding",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81z+2F3X2cL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-14",
    name: "Pacifiers",
    price: 9.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    supplier: "BabyComfort",
    imageUrls: [
      "https://m.media-amazon.com/images/I/71u1v1zKQzL._AC_SL1500_.jpg",
    ],
  },
  {
    id: "item-15",
    name: "Baby Clothes Set",
    price: 49.99,
    category: "Baby",
    imageUrl: "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    supplier: "TinyFashion",
    imageUrls: [
      "https://m.media-amazon.com/images/I/81gF6b+zKSL._AC_SL1500_.jpg",
    ],
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
