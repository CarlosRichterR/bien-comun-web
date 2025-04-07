import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CatalogItem } from "../../utils/catalog-data"
import { categories } from "../../utils/catalog-data"
import { UploadCloud } from 'lucide-react'

interface CustomProductModalProps {
    isOpen: boolean
    onClose: () => void
    onAddProduct: (product: CatalogItem) => void
}

export function CustomProductModal({ isOpen, onClose, onAddProduct }: CustomProductModalProps) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [referenceUrl, setReferenceUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newProduct: CatalogItem = {
            id: `custom-${Date.now()}`,
            name,
            price: parseFloat(price) / 6.96, // Convert to USD for consistency
            category,
            imageUrl: imageUrl || '/placeholder.svg?height=100&width=100',
            supplier: 'Personalizado',
            referenceUrl: referenceUrl || undefined,
        }
        onAddProduct(newProduct)
        onClose()
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImageUrl(URL.createObjectURL(file))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Producto Personalizado</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Precio (Bs)
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="col-span-3"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Categoría
                            </Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageUpload" className="text-right">
                                Imagen
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Label
                                    htmlFor="imageUpload"
                                    className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                                >
                                    {imageUrl ? (
                                        <img src={imageUrl || "/placeholder.svg"} alt="Uploaded" className="max-h-full" />
                                    ) : (
                                        <span className="flex items-center space-x-2">
                                            <UploadCloud className="w-6 h-6 text-gray-600" />
                                            <span className="font-medium text-gray-600">
                                                Haga clic para subir una imagen
                                            </span>
                                        </span>
                                    )}
                                </Label>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="referenceUrl" className="text-right">
                                URL de Referencia
                            </Label>
                            <Input
                                id="referenceUrl"
                                value={referenceUrl}
                                onChange={(e) => setReferenceUrl(e.target.value)}
                                className="col-span-3"
                                placeholder="https://ejemplo.com/producto"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">Agregar Producto</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

