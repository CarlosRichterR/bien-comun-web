import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CatalogItem } from "../../utils/catalog-data"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface ItemDetailsModalProps {
    item: CatalogItem;
    isOpen: boolean;
    onClose: () => void;
    onAddGift?: (item: CatalogItem) => void;
    onRemoveGift?: (id: string) => void;
    mode?: 'catalog' | 'selected'; // Nuevo: para distinguir el flujo
}

export function ItemDetailsModal({ item, isOpen, onClose, onAddGift, onRemoveGift, mode = 'catalog' }: ItemDetailsModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Usar todas las imágenes de alta calidad si están disponibles
    const images = item.imageUrls && item.imageUrls.length > 0
        ? item.imageUrls
        : ["/assets/images/gift.svg"];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                    <DialogDescription>Detalles del producto</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 w-full">
                    {/* Columna izquierda: Carrusel de imágenes */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative aspect-square w-full max-w-[350px] flex justify-center items-center">
                            <Image
                                src={images[currentImageIndex]}
                                alt={item.name}
                                width={350}
                                height={350}
                                className="rounded-lg"
                                onError={(e) => (e.currentTarget as HTMLImageElement).src = "/assets/images/gift.svg"}
                            />
                            {images.length > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                                        onClick={prevImage}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Columna derecha: Información y botones */}
                    <div className="flex flex-col justify-between h-full">
                        <div className="grid gap-2">
                            <div>
                                <span className="font-bold">Descripción:</span>
                                <p className="mt-1">{item.description}</p>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Precio:</span>
                                <span>Bs {(item.price).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Categoría:</span>
                                <span>{item.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Marca:</span>
                                <span>{item.brand}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Proveedor:</span>
                                <span>{item.supplier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Modelo:</span>
                                <span>Modelo XYZ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">En stock:</span>
                                <span>10 unidades</span>
                            </div>
                            {item.referenceUrl && (
                                <div className="flex justify-between">
                                    <span className="font-bold">Referencia:</span>
                                    <a href={item.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver más</a>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center gap-4 mt-8">
                            <Button variant="outline" onClick={onClose}>Cerrar</Button>
                            {mode === 'catalog' && onAddGift && (
                                <Button variant="default" onClick={() => { onAddGift({ ...item, quantity: 1 }); onClose(); }}>Agregar a Lista de Regalos</Button>
                            )}
                            {mode === 'selected' && onRemoveGift && (
                                <Button variant="destructive" onClick={() => { onRemoveGift(item.id); onClose(); }}>Remover de lista</Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

