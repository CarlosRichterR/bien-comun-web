"use client"

import { useState, useEffect, useRef } from "react"
import { Gift, Trash2, Search, AlertCircle, MoreVertical, Plus, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Slider } from "../ui-custom/Slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { CatalogItem, PaginatedResponse } from "../../utils/catalog-data"
import { ItemDetailsModal } from './ItemDetailsModal'
import { CustomProductModal } from './CustomProductModal'
import { MultiSelect } from "../ui-custom/multi-select"; 
import { getEventTypeLabel } from "@/lib/getEventTypeLabel"
import { EventType } from "@/types/enums/EventType"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    onSelectedGiftsChange?: (selectedGifts: CatalogItem[]) => void;
    selectedGiftsFather: CatalogItem[];
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
    onSelectedGiftsChange,
    selectedGiftsFather
}: GiftSelectionProps) {
    // --- Estados ---
    const [selectedGifts, setSelectedGifts] = useState<CatalogItem[]>(selectedGiftsFather || []);
    const [catalogItems, setCatalogItems] = useState<PaginatedResponse>({
        items: [],
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 8,
    });
    const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCustomProductModalOpen, setIsCustomProductModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);
    const [modalMode, setModalMode] = useState<'catalog' | 'selected'>('catalog');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // --- Efectos ---
    useEffect(() => {
        if (typeof onSelectedGiftsChange === "function") {
            onSelectedGiftsChange(selectedGifts);
        }
    }, [selectedGifts, onSelectedGiftsChange]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
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
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [currentPage, catalogItems.itemsPerPage]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/api/suppliers`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error('Failed to fetch suppliers');
                const data = await response.json();
                setVendors(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/api/categories`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data: { id: number; name: string }[] = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // --- Funciones auxiliares ---
    const fetchPaginatedProducts = async (page: number, pageSize: number) => {
        try {
            const response = await fetch(
                `${process.env.API_URL}/api/Products/paginated?page=${page}&pageSize=${pageSize}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (!response.ok) throw new Error('Failed to fetch paginated products');
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

    // Nueva función: búsqueda avanzada con POST
    const searchProducts = async (
        page: number,
        pageSize: number,
        searchTerm: string,
        brand?: string,
        supplierId?: number,
        model?: string,
        categoryIds?: number[],
        priceRange?: [number, number],
        supplierIds?: number[],
        isAdvancedSearch?: boolean
    ) => {
        try {
            const response = await fetch(
                `${process.env.API_URL}/api/products/search`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page,
                        pageSize,
                        search: searchTerm,
                        brand,
                        supplierId,
                        model,
                        categoryIds,
                        priceRange,
                        supplierIds,
                        isAdvancedSearch: !!isAdvancedSearch
                    }),
                }
            );
            if (!response.ok) throw new Error('Failed to search products');
            const data = await response.json();
            return {
                products: data.items as CatalogItem[],
                totalCount: data.totalCount as number,
            };
        } catch (error) {
            console.error('Error searching products:', error);
            return { products: [], totalCount: 0 };
        }
    };

    // --- Nueva función para aplicar filtros avanzados ---
    const handleApplyFilters = async () => {
        setLoading(true);
        const supplierIds = selectedVendors.map(Number);
        const categoryIds = selectedCategories.map(Number);
        // Si el usuario no tocó el filtro de precio, enviar null en vez de [0,0]
        const isPriceRangeTouched = priceRange[0] !== 0 || priceRange[1] !== 0;
        const priceRangeToSend = isPriceRangeTouched ? priceRange : null;
        // Cuando se aplican filtros avanzados, ignorar el searchTerm
        const result = await searchProducts(
            1,
            catalogItems.itemsPerPage,
            "", // searchTerm vacío
            undefined, // brand
            undefined, // supplierId (usamos supplierIds array)
            undefined, // model
            categoryIds.length > 0 ? categoryIds : undefined,
            priceRangeToSend,
            supplierIds.length > 0 ? supplierIds : undefined,
            true // isAdvancedSearch
        );
        setCatalogItems({
            items: result.products,
            totalItems: result.totalCount,
            currentPage: 1,
            totalPages: Math.ceil(result.totalCount / catalogItems.itemsPerPage),
            itemsPerPage: catalogItems.itemsPerPage,
        });
        setCurrentPage(1);
        setLoading(false);
    };

    const addGiftToList = (item: CatalogItem) => {
        setSelectedGifts(prevGifts => [...prevGifts, { ...item, quantity: 1 }]);
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
                items: prevCatalog.items.some(item => item.id === removedGift.id)
                    ? prevCatalog.items
                    : [...prevCatalog.items, removedGift],
            }));
        }
    };

    // Modifica handleSearch para usar debounce
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(async () => {
            if (value.trim().length > 0) {
                setLoading(true);
                const { products, totalCount } = await searchProducts(
                    1,
                    catalogItems.itemsPerPage,
                    value
                );
                setCatalogItems({
                    items: products,
                    totalItems: totalCount,
                    currentPage: 1,
                    totalPages: Math.ceil(totalCount / catalogItems.itemsPerPage),
                    itemsPerPage: catalogItems.itemsPerPage,
                });
                setLoading(false);
            } else {
                setLoading(true);
                const { products, totalCount } = await fetchPaginatedProducts(1, catalogItems.itemsPerPage);
                setCatalogItems({
                    items: products,
                    totalItems: totalCount,
                    currentPage: 1,
                    totalPages: Math.ceil(totalCount / catalogItems.itemsPerPage),
                    itemsPerPage: catalogItems.itemsPerPage,
                });
                setLoading(false);
            }
        }, 1000); // 1s debounce
    };

    const handleSave = (newStatus?: 'draft' | 'published') => {
        const updatedStatus = newStatus || status;
        onSave(selectedGifts, updatedStatus);
        setStatus(updatedStatus);
    };

    const handleItemClick = (item: CatalogItem) => {
        setSelectedItem(item);
        setModalMode('catalog');
        setIsModalOpen(true);
    };

    const handleSelectedGiftClick = (item: CatalogItem) => {
        setSelectedItem(item);
        setModalMode('selected');
        setIsModalOpen(true);
    };

    const handleSaveAndNext = () => {
        handleSave();
        onNext();
    };

    const handleAddCustomProduct = (customProduct: CatalogItem) => {
        setSelectedGifts(prevGifts => [...prevGifts, customProduct]);
        setIsCustomProductModalOpen(false);
    };

    // --- Cálculos derivados ---
    const totalGiftValue = Array.isArray(selectedGifts)
        ? selectedGifts.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
        : 0;
    const suggestedTotalAmount = guestCount * minContribution;

    // --- Render ---
    const eventTypeLabel = getEventTypeLabel(eventType as EventType);
    const showCustomType = eventTypeLabel === "Otro" ? customEventType : eventTypeLabel;

    const totalPages = catalogItems.totalPages;

    const formatBs = (value: number) =>
        value.toLocaleString('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).replace('BOB', 'Bs');

    return (
        <div className="bg-background">
            <div className="flex justify-between items-center mb-4">
                <Badge variant={status === "published" ? "secondary" : "outline"}>
                    {status === "published" ? "Publicado" : "Borrador"}
                </Badge>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">
                Selección de Regalos para {showCustomType}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Catálogo de Regalos</CardTitle>
                        <div className="relative flex items-center">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Buscar regalos..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className={`pl-8 pr-8 w-full rounded-lg border ${searchTerm ? 'border-primary/60 ring-1 ring-primary/30' : ''} focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all duration-150`}
                                    disabled={showAdvancedFilters}
                                    style={{ boxShadow: searchTerm ? '0 0 0 2px #a5b4fc33' : undefined }}
                                />
                                {searchTerm && searchTerm.length > 0 && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none bg-white rounded-full p-0.5 shadow-sm border border-gray-200 hover:border-primary transition-colors duration-150"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setCurrentPage(1);
                                            setLoading(true);
                                            fetchPaginatedProducts(1, catalogItems.itemsPerPage).then(({ products, totalCount }) => {
                                                setCatalogItems({
                                                    items: products,
                                                    totalItems: totalCount,
                                                    currentPage: 1,
                                                    totalPages: Math.ceil(totalCount / catalogItems.itemsPerPage),
                                                    itemsPerPage: catalogItems.itemsPerPage,
                                                });
                                                setLoading(false);
                                            });
                                        }}
                                        aria-label="Limpiar búsqueda"
                                        tabIndex={0}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" fill="#f3f4f6" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6" stroke="#64748b" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="ml-2">
                                <Button
                                    variant={showAdvancedFilters ? "secondary" : "outline"}
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className={`p-2 ${showAdvancedFilters ? "bg-primary text-white" : ""}`}
                                    title="Filtro avanzado"
                                >
                                    <Filter className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {showAdvancedFilters && (
                            <AdvancedFilters
                                categories={categories}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={(values) => {
                                    setSelectedCategories(values);
                                }}
                                vendors={vendors}
                                selectedVendors={selectedVendors}
                                setSelectedVendors={setSelectedVendors}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                onApplyFilters={handleApplyFilters}
                                onClearFilters={() => {
                                    setSelectedCategories([]);
                                    setSelectedVendors([]);
                                    setPriceRange([0, 0]);
                                    setShowAdvancedFilters(false);
                                    // Query inicial (sin filtros)
                                    setLoading(true);
                                    fetchPaginatedProducts(1, catalogItems.itemsPerPage).then(({ products, totalCount }) => {
                                        setCatalogItems({
                                            items: products,
                                            totalItems: totalCount,
                                            currentPage: 1,
                                            totalPages: Math.ceil(totalCount / catalogItems.itemsPerPage),
                                            itemsPerPage: catalogItems.itemsPerPage,
                                        });
                                        setCurrentPage(1);
                                        setLoading(false);
                                    });
                                }}
                            />
                        )}
                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-[260px]">
                                <svg className="animate-spin h-10 w-10 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <p className="text-primary font-medium">Cargando productos...</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[340px] w-full rounded-md border p-4">
                                {catalogItems.items && catalogItems.items.length > 0 ? (
                                    catalogItems.items.map((item) => (
                                        <CatalogItemCard
                                            key={item.id}
                                            item={item}
                                            onItemClick={handleItemClick}
                                            onAddGift={addGiftToList}
                                            isAdded={selectedGifts.some(gift => gift.id === item.id)}
                                        />
                                    ))
                                ) : (
                                    <p>No hay productos disponibles.</p>
                                )}
                            </ScrollArea>
                        )}
                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={currentPage === i + 1 ? "secondary" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Artículos Seleccionados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[260px] w-full rounded-md border p-4">
                            {Array.isArray(selectedGifts) && selectedGifts.map((item) => (
                                <SelectedGiftCard
                                    key={item.id}
                                    item={item}
                                    onRemove={removeGift}
                                    onQuantityChange={(newQuantity) => {
                                        if (newQuantity > 0) {
                                            setSelectedGifts(prevGifts =>
                                                prevGifts.map(gift =>
                                                    gift.id === item.id ? { ...gift, quantity: newQuantity } : gift
                                                )
                                            );
                                        }
                                    }}
                                    onShowDetails={handleSelectedGiftClick}
                                />
                            ))}
                        </ScrollArea>
                        <Alert className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Resumen de la Lista de Regalos</AlertTitle>
                            <AlertDescription>
                                Valor Total de Regalos: <span className={totalGiftValue > suggestedTotalAmount ? "text-red-500" : "text-green-500"}>{formatBs(totalGiftValue)}</span><br />
                                Monto Total Sugerido: {formatBs(suggestedTotalAmount)} (basado en {guestCount} invitados a {formatBs(minContribution)} cada uno)
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => setIsCustomProductModalOpen(true)}
                            className="mt-4 w-full"
                        >
                            Agregar Producto Personalizado
                        </Button>
                    </CardContent>
                </Card>
            </div>
            {selectedItem && (
                <ItemDetailsModal
                    item={selectedItem}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddGift={modalMode === 'catalog' ? (item) => {
                        addGiftToList({ ...item, quantity: 1 });
                        setIsModalOpen(false);
                    } : undefined}
                    onRemoveGift={modalMode === 'selected' ? (id) => {
                        removeGift(id);
                        setIsModalOpen(false);
                    } : undefined}
                    mode={modalMode}
                />
            )}
            <CustomProductModal
                isOpen={isCustomProductModalOpen}
                onClose={() => setIsCustomProductModalOpen(false)}
                onAddProduct={handleAddCustomProduct}
            />
            <div className="mt-8 flex justify-between">
                <Button onClick={onBack} variant="outline">Atrás</Button>
                <Button onClick={handleSaveAndNext}>Siguiente</Button>
            </div>
        </div>
    );
}

// --- Componentes auxiliares extraídos ---

interface AdvancedFiltersProps {
    categories: { id: number; name: string }[];
    selectedCategories: string[];
    setSelectedCategories: (values: string[]) => void;
    vendors: { id: number; name: string }[];
    selectedVendors: string[];
    setSelectedVendors: (values: string[]) => void;
    priceRange: [number, number];
    setPriceRange: (values: [number, number]) => void;
    onApplyFilters: () => void;
}

function AdvancedFilters({
    categories,
    selectedCategories,
    setSelectedCategories,
    vendors,
    selectedVendors,
    setSelectedVendors,
    priceRange,
    setPriceRange,
    onApplyFilters,
    onClearFilters
}: AdvancedFiltersProps & { onClearFilters?: () => void }) {
    // Detecta si algún filtro fue tocado
    const filtersTouched =
        selectedCategories.length > 0 ||
        selectedVendors.length > 0 ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 0;

    return (
        <div className="space-y-4 border rounded-md p-4 bg-gray-100 transition-all duration-300 ease-in-out transform scale-95 opacity-0 animate-fade-in">
            <div className="flex flex-col space-y-2">
                <label htmlFor="category-select" className="text-sm font-medium">
                    Filtrar por Categoría
                </label>
                <MultiSelect
                    id="category-select"
                    options={categories.map((category) => ({ label: category.name, value: category.id.toString() }))}
                    selectedValues={selectedCategories}
                    onSelectionChange={setSelectedCategories}
                    placeholder="Seleccionar categorías"
                />
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="vendor-select" className="text-sm font-medium">
                    Filtrar por Vendedor
                </label>
                <MultiSelect
                    id="vendor-select"
                    options={vendors.map((vendor) => ({ label: vendor.name, value: vendor.id.toString() }))}
                    selectedValues={selectedVendors}
                    onSelectionChange={setSelectedVendors}
                    placeholder="Seleccionar vendedores"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="price-range" className="text-sm font-medium">
                    Rango de Precios: Bs {priceRange[0].toFixed(2)} - Bs {priceRange[1].toFixed(2)}
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
            <div className="flex justify-center pt-2 gap-2">
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                            <span>
                                <Button
                                    onClick={onApplyFilters}
                                    className="w-full md:w-auto max-w-xs flex items-center justify-center gap-2"
                                    disabled={!filtersTouched}
                                >
                                    <Filter className="h-5 w-5" />
                                    Aplicar filtros
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {!filtersTouched && (
                            <TooltipContent side="top" align="center">
                                Aplica al menos un filtro para habilitar este botón
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
                <Button
                    variant="outline"
                    onClick={() => {
                        setSelectedCategories([]);
                        setSelectedVendors([]);
                        setPriceRange([0, 0]);
                        if (typeof onClearFilters === 'function') {
                            onClearFilters();
                        }
                    }}
                >
                    Limpiar filtros
                </Button>
            </div>
        </div>
    );
}

interface CatalogItemCardProps {
    item: CatalogItem;
    onItemClick: (item: CatalogItem) => void;
    onAddGift: (item: CatalogItem) => void;
    isAdded: boolean;
}

function CatalogItemCard({ item, onItemClick, onAddGift, isAdded }: CatalogItemCardProps) {
    const [imgSrc, setImgSrc] = useState(item.thumbnailUrl || "/assets/images/gift.svg");

    return (
        <Card className="bg-card cursor-pointer">
            <CardContent className="flex items-center p-4">
                <div
                    className="flex items-center flex-grow cursor-pointer"
                    onClick={() => onItemClick(item)}
                >
                    <Image
                        src={imgSrc}
                        alt={item.name || "Imagen del producto"}
                        width={50}
                        height={50}
                        className="rounded-md mr-4"
                        onError={() => setImgSrc("/assets/images/gift.svg")}
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
                        {isAdded ? (
                            <DropdownMenuItem disabled className="text-green-600 cursor-default">
                                ✓ Ya agregado a la lista
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => onAddGift(item)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar a Lista de Regalos
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
        </Card>
    );
}

interface SelectedGiftCardProps {
    item: CatalogItem;
    onRemove: (id: string) => void;
    onQuantityChange: (quantity: number) => void;
}

function SelectedGiftCard({ item, onRemove, onQuantityChange, onShowDetails }: SelectedGiftCardProps & { onShowDetails: (item: CatalogItem) => void }) {
    const [imgSrc, setImgSrc] = useState(item.thumbnailUrl || "/assets/images/gift.svg");
    return (
        <Card className="bg-card cursor-pointer" onClick={() => onShowDetails(item)}>
            <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                    <Image
                        src={imgSrc}
                        alt={item.name || "Imagen del producto"}
                        width={40}
                        height={40}
                        className="rounded-md"
                        onError={() => setImgSrc("/assets/images/gift.svg")}
                    />
                    <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Bs {(item.price).toFixed(2)}</p>
                        {item.referenceUrl && (
                            <a
                                href={item.referenceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline"
                                onClick={e => e.stopPropagation()}
                            >
                                Ver referencia
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                    <Input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                        className="w-16 text-center"
                    />
                    <Button variant="destructive" size="icon" onClick={() => onRemove(item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

