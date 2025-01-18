import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CatalogItem } from "../../utils/catalog-data"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface ItemDetailsModalProps {
    item: CatalogItem;
    isOpen: boolean;
    onClose: () => void;
}

export function ItemDetailsModal({ item, isOpen, onClose }: ItemDetailsModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Mock multiple images for the carousel
    const images = [
        item.imageUrl,
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
    ]

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[500px] md:max-w-[550px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                    <DialogDescription>Detalles del producto</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    <div className="relative aspect-square max-h-[400px] w-full flex justify-center items-center">
                        <Image
                            src={images[currentImageIndex] || "/placeholder.svg"}
                            alt={item.name}
                            width={400}
                            height={400}
                            objectFit="contain"
                            className="rounded-lg"
                        />
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

                    </div>

                    <div className="grid gap-2">
                        <div className="flex justify-between">
                            <span className="font-bold">Precio:</span>
                            <span>Bs {(item.price * 6.96).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Categoría:</span>
                            <span>{item.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Marca:</span>
                            <span>{item.vendor}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Modelo:</span>
                            <span>Modelo XYZ</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">En stock:</span>
                            <span>10 unidades</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-bold">Descripción:</span>
                        <p className="mt-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

