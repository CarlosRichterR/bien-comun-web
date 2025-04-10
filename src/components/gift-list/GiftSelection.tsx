"use client"

import { useState, useEffect } from "react"
import { Gift, Trash2, Search, AlertCircle, MoreVertical, Plus, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "../ui-custom/Slider"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { fetchCatalogItems, categories, CatalogItem, PaginatedResponse } from "../../utils/catalog-data"
import { EventType } from "./EventTypeSelection"
import { ItemDetailsModal } from './ItemDetailsModal'
import { CustomProductModal } from './CustomProductModal'
import { MultiSelect } from "../ui-custom/multi-select"; 
interface GiftSelectionProps {
    eventType: EventType | null;
    customEventType?: string;
    listId: number | null;
    initialStatus?: 'draft' | 'published';
    onSave: (items: CatalogItem[], status: 'draft' | 'published') => void;
    guestCount: number;
    minContribution: number;
    onBack: () => void;
    onNext: () => void;
    onSelectedGiftsChange?: (selectedGifts: CatalogItem[]) => void; // Nueva prop
}

export function GiftSelection({
    eventType,
    customEventType,
    listId,
    initialStatus = 'draft',
    onSave,
    guestCount,
    minContribution,
    onBack,
    onNext,
    onSelectedGiftsChange, // Nueva prop
}: GiftSelectionProps) {
    const [selectedGifts, setSelectedGifts] = useState<CatalogItem[]>([]);

    // Llama a onSelectedGiftsChange cada vez que selectedGifts cambie
    useEffect(() => {
        if (typeof onSelectedGiftsChange === "function") {
            onSelectedGiftsChange(selectedGifts);
        }
    }, [selectedGifts, onSelectedGiftsChange]);

    const [catalogItems, setCatalogItems] = useState<PaginatedResponse>({
        items: [],
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 6,
    });
    const [categories, setCategories] = useState<string[]>([]); // State for categories
    const [currentCategory, setCurrentCategory] = useState("Todos");
    const [loadingCategories, setLoadingCategories] = useState(false); // State for loading categories
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);
    const [vendors, setVendors] = useState<{ label: string; value: string }[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<string>('Todos');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCustomProductModalOpen, setIsCustomProductModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Estado de carga
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false); // State to toggle advanced filters
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // State for selected categories
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]); // State for selected vendors

    const totalGiftValue = selectedGifts.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const suggestedTotalAmount = guestCount * minContribution;

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true); // Inicia la carga
            try {
                const { products, totalCount } = await fetchPaginatedProducts(
                    currentPage,
                    catalogItems.itemsPerPage
                );

                setCatalogItems({
                    items: products,
                    totalItems: totalCount,
                    currentPage,
                    totalPages: Math.ceil(totalCount / catalogItems.itemsPerPage),
                    itemsPerPage: catalogItems.itemsPerPage,
                });

                // const uniqueVendors = Array.from(new Set(products.map(item => item.supplier)));
                // setVendors(['Todos', ...uniqueVendors]);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        fetchItems();
    }, [currentPage, currentCategory, searchTerm, selectedVendor, priceRange]);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true); // Start loading
            try {
                const response = await fetch(`${process.env.API_URL}/api/categories`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await response.json();
                const categoryNames = data.map((category: { id: number; name: string }) => category.name); // Extract names
                setCategories(["Todos", ...categoryNames]); // Add "Todos" as the default category
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false); // End loading
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/api/suppliers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch suppliers');
                }

                const data = await response.json();
                const supplierOptions = data.map((supplier: { id: number; name: string }) => ({
                    label: supplier.name,
                    value: supplier.id.toString(),
                }));
                setVendors(supplierOptions); // Update the vendors state
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);

    const addGiftToList = (item: CatalogItem) => {
        setSelectedGifts(prevGifts => [...prevGifts, item]);
        setCatalogItems(prevCatalog => ({
            ...prevCatalog,
            items: prevCatalog.items.filter(catalogItem => catalogItem.id !== item.id),
        }));
    };

    const removeGift = (id: string) => {
        const removedGift = selectedGifts.find(gift => gift.id === id);
        if (removedGift) {
            setSelectedGifts(prevGifts => prevGifts.filter(gift => gift.id !== id));
            setCatalogItems(prevCatalog => ({
                ...prevCatalog,
                items: [...prevCatalog.items, removedGift],
            }));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSave = (newStatus?: 'draft' | 'published') => {
        const updatedStatus = newStatus || status;
        onSave(selectedGifts, updatedStatus);
        setStatus(updatedStatus);
    };

    const handleItemClick = (item: CatalogItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const allCategories = ["Todos", "Muebles", "Herramientas", "Electrodomésticos"];

    const handleSaveAndNext = () => {
        handleSave();
        onNext();
    };

    const handleAddCustomProduct = (customProduct: CatalogItem) => {
        setSelectedGifts(prevGifts => [...prevGifts, customProduct]);
        setIsCustomProductModalOpen(false);
    };

    const getEventTypeLabel = (eventType: EventType): string => {
        switch (eventType) {
            case 0:
                return "Boda";
            case 1:
                return "Cumpleaños";
            case 2:
                return "Baby Shower";
            case 3:
                return "Otro";
            default:
                return "Desconocido";
        }
    };

    const fetchPaginatedProducts = async (page: number, pageSize: number) => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/Products/paginated?page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch paginated products');
            }

            const data = await response.json();
            return {
                products: data.items as CatalogItem[],
                totalCount: data.totalCount as number,
            };
        } catch (error) {
            console.error('Error fetching paginated products:', error);
            return { products: [], totalCount: 0 };
        }
    };

    return (
        <div className="bg-background">
            <div className="flex justify-between items-center mb-4">
                <Badge variant={status === "published" ? "secondary" : "outline"}>
                    {status === "published" ? "Publicado" : "Borrador"}
                </Badge>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">
                Selección de Regalos para {getEventTypeLabel(eventType as EventType) === "Otro" ? 
                customEventType : getEventTypeLabel(eventType as EventType)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Catálogo de Regalos</CardTitle>
                        <div className="relative flex items-center">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Buscar regalos..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-8 flex-1"
                            />
                            <div className="ml-2">
                                <Button
                                    variant={showAdvancedFilters ? "secondary" : "outline"} // Cambia el estilo según el estado
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className={`p-2 ${showAdvancedFilters ? "bg-primary text-white" : ""}`} // Estilos adicionales para el estado activo
                                    title="Filtro avanzado" // Tooltip para accesibilidad
                                >
                                    <Filter className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {showAdvancedFilters && (
                            <div
                                className="space-y-4 border rounded-md p-4 bg-gray-100 transition-all duration-300 ease-in-out transform scale-95 opacity-0 animate-fade-in"
                            >
                                {/* Filter by Category */}
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="category-select" className="text-sm font-medium">
                                        Filtrar por Categoría
                                    </label>
                                    <MultiSelect
                                        id="category-select"
                                        options={categories.map((category) => ({ label: category, value: category }))}
                                        selectedValues={selectedCategories}
                                        onSelectionChange={setSelectedCategories}
                                        placeholder="Seleccionar categorías"
                                    />
                                </div>

                                {/* Filter by Vendor */}
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="vendor-select" className="text-sm font-medium">
                                        Filtrar por Vendedor
                                    </label>
                                    <MultiSelect
                                        id="vendor-select"
                                        options={vendors}
                                        selectedValues={selectedVendors}
                                        onSelectionChange={setSelectedVendors}
                                        placeholder="Seleccionar vendedores"
                                    />
                                </div>

                                {/* Filter by Price Range */}
                                <div className="space-y-2">
                                    <label htmlFor="price-range" className="text-sm font-medium">
                                        Rango de Precios: Bs {(priceRange[0] * 6.96).toFixed(2)} - Bs {(priceRange[1] * 6.96).toFixed(2)}
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                            className="w-20"
                                        />
                                        <div className="flex-1 px-2">
                                            <Slider
                                                min={0}
                                                max={1000}
                                                step={10}
                                                value={priceRange}
                                                onValueChange={setPriceRange}
                                                className="relative flex items-center select-none touch-none w-full"
                                            />
                                        </div>
                                        <Input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-20"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Productos */}
                        {loading ? (
                            <div className="flex justify-center items-center h-[400px]">
                                <p>Cargando productos...</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                {catalogItems.items && catalogItems.items.length > 0 ? (
                                    catalogItems.items.map((item, index) => (
                                        <div key={item.id}>
                                            <Card className="bg-card cursor-pointer">
                                                <CardContent className="flex items-center p-4">
                                                    <div
                                                        className="flex items-center flex-grow cursor-pointer"
                                                        onClick={() => handleItemClick(item)}
                                                    >
                                                        <Image
                                                            src={item.imageUrl || "/assets/images/gift.svg"}
                                                            alt={item.name || "Imagen del producto"}
                                                            width={50}
                                                            height={50}
                                                            className="rounded-md mr-4"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold">{item.name}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Bs {(item.price).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Abrir menú</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => addGiftToList(item)}>
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Agregar a Lista de Regalos
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay productos disponibles.</p>
                                )}
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Artículos Seleccionados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            {selectedGifts.map((item, index) => (
                                <div key={item.id}>
                                    <Card className="bg-card">
                                        <CardContent className="flex items-center justify-between py-4">
                                            <div className="flex items-center space-x-4">
                                                <Gift className="h-6 w-4 text-primary" />
                                                <div>
                                                    <h3 className="font-semibold">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Bs {(item.price).toFixed(2)}</p>
                                                    {item.referenceUrl && (
                                                        <a
                                                            href={item.referenceUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-500 hover:underline"
                                                        >
                                                            Ver referencia
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity || 1}
                                                    onChange={(e) => {
                                                        const newQuantity = parseInt(e.target.value);
                                                        if (newQuantity > 0) {
                                                            setSelectedGifts(prevGifts =>
                                                                prevGifts.map(gift =>
                                                                    gift.id === item.id ? { ...gift, quantity: newQuantity } : gift
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="w-16 text-center"
                                                />
                                                <Button variant="destructive" size="icon" onClick={() => removeGift(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </ScrollArea>
                        <Alert className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Resumen de la Lista de Regalos</AlertTitle>
                            <AlertDescription>
                                Valor Total de Regalos: <span className={totalGiftValue > suggestedTotalAmount ? "text-red-500" : "text-green-500"}>Bs {(totalGiftValue).toFixed(2)}</span><br />
                                Monto Total Sugerido: Bs {(suggestedTotalAmount).toFixed(2)} (basado en {guestCount} invitados a Bs {(minContribution).toFixed(2)} cada uno)
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => setIsCustomProductModalOpen(true)}
                            className="mt-4 w-full"
                        >
                            Agregar Producto Personalizado
                        </Button> {/* Added button to open custom product modal */}
                    </CardContent>
                </Card>
            </div>
            {selectedItem && (
                <ItemDetailsModal
                    item={selectedItem}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            <CustomProductModal // Added CustomProductModal component
                isOpen={isCustomProductModalOpen}
                onClose={() => setIsCustomProductModalOpen(false)}
                onAddProduct={handleAddCustomProduct}
            />
            <div className="mt-8 flex justify-between">
                <Button onClick={onBack} variant="outline">Atrás</Button>
                <Button onClick={handleSaveAndNext}>Siguiente</Button>
            </div>
        </div>
    )
}

