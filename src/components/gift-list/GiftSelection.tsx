"use client"

import { useState, useEffect } from "react"
import { Gift, Trash2, Search, AlertCircle, MoreVertical, Plus } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
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


interface GiftSelectionProps {
    eventType: EventType | null;
    customEventType?: string;
    listId: number | null;
    initialStatus?: 'draft' | 'published';
    onSave: (items: CatalogItem[], status: 'draft' | 'published') => void;
    guestCount: number;
    contributionPerGuest: number;
    minContribution: number; // Added minContribution prop
    onBack: () => void;
    onNext: () => void;
}

export function GiftSelection({
    eventType,
    customEventType,
    listId,
    initialStatus = 'draft',
    onSave,
    guestCount,
    contributionPerGuest,
    minContribution, // Added minContribution parameter
    onBack,
    onNext
}: GiftSelectionProps) {
    const [selectedGifts, setSelectedGifts] = useState<CatalogItem[]>([])
    const [catalogItems, setCatalogItems] = useState<PaginatedResponse>({ items: [], totalItems: 0, currentPage: 1, totalPages: 1, itemsPerPage: 6 })
    const [currentCategory, setCurrentCategory] = useState("Todos")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [status, setStatus] = useState<'draft' | 'published'>(initialStatus)
    const [vendors, setVendors] = useState<string[]>([])
    const [selectedVendor, setSelectedVendor] = useState<string>('Todos')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCustomProductModalOpen, setIsCustomProductModalOpen] = useState(false) // Added state for custom product modal

    const totalGiftValue = selectedGifts.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    const suggestedTotalAmount = guestCount * minContribution // Updated suggestedTotalAmount calculation

    useEffect(() => {
        const fetchItems = () => {
            const response = fetchCatalogItems(
                currentPage,
                6,
                currentCategory === "Todos" ? undefined : currentCategory,
                searchTerm,
                selectedVendor === 'Todos' ? undefined : selectedVendor,
                priceRange
            );
            setCatalogItems(response);

            const uniqueVendors = Array.from(new Set(response.items.map(item => item.vendor)));
            setVendors(['Todos', ...uniqueVendors]);
        };

        fetchItems();
    }, [currentCategory, searchTerm, currentPage, selectedVendor, priceRange]);

    useEffect(() => {
        if (listId) {
            // TODO: Implement API call to fetch list items
            // For now, we'll use mock data
            const mockListItems: CatalogItem[] = [
                { id: "item-1", name: "Licuadora", price: 49.99, category: "Cocina", imageUrl: "/placeholder.svg?height=100&width=100", vendor: "ElectroHogar" },
                { id: "item-2", name: "Tostadora", price: 29.99, category: "Cocina", imageUrl: "/placeholder.svg?height=100&width=100", vendor: "ElectroHogar" },
            ];
            setSelectedGifts(mockListItems);
        }
    }, [listId]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result

        if (!destination) return

        if (source.droppableId === destination.droppableId) {
            // Reordering within the same list
            const items = source.droppableId === 'Catálogo' ? [...catalogItems.items] : [...selectedGifts]
            const [reorderedItem] = items.splice(source.index, 1)
            items.splice(destination.index, 0, reorderedItem)

            if (source.droppableId === 'Catálogo') {
                setCatalogItems(prevCatalog => ({
                    ...prevCatalog,
                    items: items
                }))
            } else {
                setSelectedGifts(items)
            }
        } else {
            // Moving between lists
            const sourceItems = source.droppableId === 'Catálogo' ? [...catalogItems.items] : [...selectedGifts]
            const destItems = destination.droppableId === 'Catálogo' ? [...catalogItems.items] : [...selectedGifts]
            const [movedItem] = sourceItems.splice(source.index, 1)
            destItems.splice(destination.index, 0, movedItem)

            if (source.droppableId === 'Catálogo') {
                setCatalogItems(prevCatalog => ({
                    ...prevCatalog,
                    items: sourceItems
                }))
                setSelectedGifts(destItems)
            } else {
                setSelectedGifts(sourceItems)
                setCatalogItems(prevCatalog => ({
                    ...prevCatalog,
                    items: destItems
                }))
            }
        }
    }

    const addGiftToList = (item: CatalogItem) => {
        setSelectedGifts(prevGifts => [...prevGifts, item])
        setCatalogItems(prevCatalog => ({
            ...prevCatalog,
            items: prevCatalog.items.filter(catalogItem => catalogItem.id !== item.id)
        }))
    }

    const removeGift = (id: string) => {
        const removedGift = selectedGifts.find(gift => gift.id === id)
        if (removedGift) {
            setSelectedGifts(prevGifts => prevGifts.filter(gift => gift.id !== id))
            setCatalogItems(prevCatalog => ({
                ...prevCatalog,
                items: [...prevCatalog.items, removedGift]
            }))
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSave = (newStatus?: 'draft' | 'published') => {
        const updatedStatus = newStatus || status;
        onSave(selectedGifts, updatedStatus);
        setStatus(updatedStatus);
    }

    const handleItemClick = (item: CatalogItem) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const allCategories = ["Todos", ...categories]

    const handleSaveAndNext = () => {
        handleSave();
        onNext();
    };

    const handleAddCustomProduct = (customProduct: CatalogItem) => { // Added function to handle adding a custom product
        setSelectedGifts(prevGifts => [...prevGifts, customProduct])
        setIsCustomProductModalOpen(false)
    }

    return (
        <div className="bg-background">
            <div className="flex justify-between items-center mb-4">
                <Badge variant={status === "published" ? "secondary" : "outline"}>
                    {status === "published" ? "Publicado" : "Borrador"}
                </Badge>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">
                Selección de Regalos para {eventType === "Otro" ? customEventType : eventType}
            </h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Catálogo de Regalos</CardTitle>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Buscar regalos..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-8"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 mb-4">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="vendor-select" className="text-sm font-medium">
                                        Filtrar por Vendedor
                                    </label>
                                    <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                                        <SelectTrigger id="vendor-select" className="w-[180px]">
                                            <SelectValue placeholder="Seleccionar vendedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vendors.map((vendor) => (
                                                <SelectItem key={vendor} value={vendor}>
                                                    {vendor}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
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
                            <Tabs value={currentCategory} onValueChange={setCurrentCategory}>
                                <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-6">
                                    {allCategories.map((category) => (
                                        <TabsTrigger key={category} value={category}>
                                            {category}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                <TabsContent value={currentCategory} className="mt-4">
                                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                        <Droppable droppableId="Catálogo">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                                    {catalogItems.items.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <Card className="bg-card cursor-pointer">
                                                                        <CardContent className="flex items-center p-4">
                                                                            <div className="flex items-center flex-grow cursor-pointer" onClick={() => handleItemClick(item)}>
                                                                                <Image
                                                                                    src={item.imageUrl || "/placeholder.svg"}
                                                                                    alt={item.name}
                                                                                    width={50}
                                                                                    height={50}
                                                                                    className="rounded-md mr-4"
                                                                                />
                                                                                <div>
                                                                                    <h3 className="font-semibold">{item.name}</h3>
                                                                                    <p className="text-sm text-muted-foreground">Bs {(item.price * 6.96).toFixed(2)}</p>
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
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: catalogItems.totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() => handlePageChange(page)}
                                                isActive={currentPage === page}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === catalogItems.totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Regalos Seleccionados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                <Droppable droppableId="selected-gifts">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                            {selectedGifts.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Card className="bg-card">
                                                                <CardContent className="flex items-center justify-between py-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <Gift className="h-6 w-4 text-primary" />
                                                                        <div>
                                                                            <h3 className="font-semibold">{item.name}</h3>
                                                                            <p className="text-sm text-muted-foreground">Bs {(item.price * 6.96).toFixed(2)}</p>
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
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </ScrollArea>
                            <Alert className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Resumen de la Lista de Regalos</AlertTitle>
                                <AlertDescription>
                                    Valor Total de Regalos: <span className={totalGiftValue > suggestedTotalAmount ? "text-red-500" : "text-green-500"}>Bs {(totalGiftValue * 6.96).toFixed(2)}</span><br />
                                    Monto Total Sugerido: Bs {(suggestedTotalAmount * 6.96).toFixed(2)} (basado en {guestCount} invitados a Bs {(minContribution * 6.96).toFixed(2)} cada uno)
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
            </DragDropContext>
            <div className="mt-8 flex justify-between">
                <Button onClick={onBack} variant="outline">Atrás</Button>
                <Button onClick={handleSaveAndNext}>Siguiente</Button>
            </div>
        </div>
    )
}

