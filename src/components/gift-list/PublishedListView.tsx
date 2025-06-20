"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Heart } from 'lucide-react'
import Image from 'next/image'
import { ContributionModal } from './ContributionModal'
import { Progress } from "@/components/ui/progress"
import { CatalogItem } from "../../utils/catalog-data"

interface PublishedListViewProps {
    listName: string
    eventType: string
    eventDate: string
    giftItems: CatalogItem[]
    minContribution: number
    onBack: () => void
    startDate: string;
    endDate: string;
    totalCollected: number;
    contributions?: { ProductId: number; TotalContributed: number }[];
}

const mockItems: CatalogItem[] = [
    { id: "1", name: "Refrigerador", price: 1500, category: "Electrodomésticos", imageUrl: "/placeholder.svg?height=200&width=200", supplier: "ElectroHogar", contributedAmount: 1000 },
    { id: "2", name: "Lavadora", price: 1000, category: "Electrodomésticos", imageUrl: "/placeholder.svg?height=200&width=200", supplier: "ElectroHogar", contributedAmount: 800 },
    { id: "3", name: "Microondas", price: 500, category: "Electrodomésticos", imageUrl: "/placeholder.svg?height=200&width=200", supplier: "ElectroHogar", contributedAmount: 500 },
    { id: "4", name: "Juego de Comedor", price: 1200, category: "Muebles", imageUrl: "/placeholder.svg?height=200&width=200", supplier: "MuebleríaElegante", contributedAmount: 700 },
    { id: "5", name: "Televisor", price: 800, category: "Electrónica", imageUrl: "/placeholder.svg?height=200&width=200", supplier: "TechStore", contributedAmount: 500 },
];

export function PublishedListView({
    listName,
    eventType,
    eventDate,
    giftItems = [],
    minContribution,
    onBack,
    startDate,
    endDate,
    totalCollected,
    contributions = [],
}: PublishedListViewProps) {
    const [items, setItems] = useState(giftItems.length > 0 ? giftItems : mockItems)
    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)

    const handleContribute = (id: string) => {
        const item = items.find(item => item.id === id)
        if (item) {
            setSelectedItem(item)
        }
    }

    const handleContributionSubmit = (amount: number, contactInfo: string) => {
        if (selectedItem) {
            setItems(items.map(item =>
                item.id === selectedItem.id
                    ? { ...item, contributedAmount: (item.contributedAmount || 0) + amount }
                    : item
            ))
            // Here you would typically send the contribution and contact info to your backend
            console.log(`Contribution of ${amount} received for ${selectedItem.name}. Contact: ${contactInfo}`);
        }
        setSelectedItem(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement RSVP submission
        console.log('RSVP enviado:', { guestName, guestEmail })
        // Reset form
        setGuestName('')
        setGuestEmail('')
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <button
                onClick={onBack}
                className="mb-4 text-blue-500 hover:underline"
            >
                ← Volver al Inicio
            </button>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">{listName}</CardTitle>
                    <CardDescription className="text-center">
                        {eventType} el {eventDate}
                    </CardDescription>
                    <CardDescription className="text-center mt-2">
                        Fecha de inicio: {startDate} | Fecha de finalización: {endDate}
                    </CardDescription>                    <CardDescription className="text-center mt-2">
                        Total recaudado: Bs {totalCollected.toFixed(2)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length > 0 ? (                        <div className="grid gap-6 md:grid-cols-2">
                            {items.map((item) => {
                                const contrib = contributions.find(c => c.ProductId === Number(item.id));
                                const contributedAmount = contrib ? contrib.TotalContributed : (item.contributedAmount || 0);
                                return (
                                    <ProductCard
                                        key={item.id}
                                        item={item}
                                        contributedAmount={contributedAmount}
                                        onContribute={handleContribute}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">No hay artículos en esta lista de regalos.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>RSVP</CardTitle>
                    <CardDescription>¡Háganos saber si asistirá!</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full mt-4">
                            Enviar RSVP
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {selectedItem && (
                <ContributionModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    itemName={selectedItem?.name || ''}
                    itemPrice={selectedItem?.price || 0}
                    contributedAmount={selectedItem?.contributedAmount || 0}
                    minContribution={minContribution}
                    onContribute={handleContributionSubmit}
                />
            )}        </div>
    )
}

// Componente auxiliar para manejar las imágenes con fallback
interface ProductCardProps {
    item: CatalogItem;
    contributedAmount: number;
    onContribute: (id: string) => void;
}

function ProductCard({ item, contributedAmount, onContribute }: ProductCardProps) {
    const [imgSrc, setImgSrc] = useState(item.imageUrl || item.thumbnailUrl || "/assets/images/gift.svg");

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <Image
                    src={imgSrc}
                    alt={item.name || "Imagen del producto"}
                    width={200}
                    height={200}
                    className="rounded-md mx-auto"
                    onError={() => setImgSrc("/assets/images/gift.svg")}
                />
            </CardHeader>
            <CardContent>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Bs {item.price.toFixed(2)}</p>
                <div className="mt-2">
                    <Progress value={(contributedAmount / item.price) * 100} className="h-2" />
                    <p className="text-sm text-green-600 mt-1">
                        Bs {contributedAmount.toFixed(2)} de Bs {item.price.toFixed(2)} contribuido
                    </p>
                </div>
            </CardContent>
            <CardFooter className="mt-auto">
                <Button
                    className="w-full"
                    variant={contributedAmount >= item.price ? "secondary" : "default"}
                    onClick={() => onContribute(item.id)}
                    disabled={contributedAmount >= item.price}
                >
                    {contributedAmount >= item.price ? (
                        <>
                            <Heart className="mr-2 h-4 w-4 fill-current" />
                            Completamente Financiado
                        </>
                    ) : (
                        <>
                            <Gift className="mr-2 h-4 w-4" />
                            Contribuir
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

