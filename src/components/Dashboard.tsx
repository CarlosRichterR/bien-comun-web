"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Eye, QrCode, Bell, BarChart, Trash, ArrowUpRight, List, LayoutGrid } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { QRCodeSVG } from 'qrcode.react'
import { mockProgressReportData } from "../utils/mockData";
import { fetchGiftLists, GiftList } from "@/services/listService"
import { deleteGiftList } from "@/services/listService"
import { getEventTypeLabel } from "@/lib/getEventTypeLabel";
import { GiftListCreationProcess } from "./gift-list/GiftListCreationProcess"; // Importa el componente aquí
import { useRouter } from 'next/navigation';

// Removed unused mockLists and EventType import

interface DashboardProps {
    onCreateNewList: () => void;
    onEditList: (listId: number, status: 'draft' | 'published') => void;
    onViewList: (listId: number) => void;
    onViewNotifications: (listId: number) => void;
    onViewProgressReport: (listId: number, progressReportData: unknown) => void; // Updated prop type
}

export default function Dashboard({ onCreateNewList, onEditList, onViewList, onViewNotifications, onViewProgressReport }: DashboardProps) {
    const [lists, setLists] = useState<GiftList[]>([])
    const [selectedQRCode, setSelectedQRCode] = useState<{ id: number, name: string } | null>(null)
    const [listToDelete, setListToDelete] = useState<GiftList | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card') // New state for view mode
    const [editingList, setEditingList] = useState<GiftList | null>(null)
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const editId = searchParams?.get('id');

    useEffect(() => {
        fetchGiftLists()
            .then(data => setLists(data))
            .catch(() => setLists([]))
    }, [])

    useEffect(() => {
        async function loadEditingList() {
            if (editId && lists.length > 0) {
                try {
                    const { fetchGiftListWithProducts } = await import("@/services/fetchGiftListWithProducts");
                    const fullList = await fetchGiftListWithProducts(Number(editId));
                    setEditingList(fullList);
                } catch (e) {
                    setEditingList(null);
                }
            } else {
                setEditingList(null);
            }
        }
        loadEditingList();
    }, [editId, lists])

    const handleShowQRCode = (list: { id: number, name: string }) => {
        setSelectedQRCode(list)
    }

    const handleCloseQRCode = () => {
        setSelectedQRCode(null)
    }

    const handleDownloadQRCode = () => {
        if (selectedQRCode) {
            const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement
            if (canvas) {
                const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
                const downloadLink = document.createElement('a')
                downloadLink.href = pngUrl
                downloadLink.download = `qr-code-${selectedQRCode.name}.png`
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)
            }
        }
    }

    const handleEdit = (list: GiftList) => {
        // Usar onEditList para navegar a la ruta de edición
        onEditList(list.id);
    }

    return (
        <div className="p-8 relative">
            {/* Mostrar GiftListCreationProcess si editingList está presente */}
            {editingList ? (
                <GiftListCreationProcess
                    initialData={mapGiftListToInitialData(editingList)}
                    onComplete={() => { setEditingList(null); fetchGiftLists().then(setLists); router.push('/dashboard'); }}
                    onExit={() => { setEditingList(null); router.push('/dashboard'); }}
                    onBack={() => { setEditingList(null); router.push('/dashboard'); }}
                />
            ) : (
                <>
                    <header className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">Inicio</h2>
                        <Button onClick={onCreateNewList} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Nueva Lista
                        </Button>
                    </header>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Tus Listas de Regalos</h3>
                            <div className="flex gap-1">
                                <button
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none border ${viewMode === 'list' ? 'bg-primary text-primary-foreground border-primary shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                    onClick={() => setViewMode('list')}
                                    aria-label="Vista de Lista"
                                >
                                    <List className="h-4 w-4" /> Lista
                                </button>
                                <button
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none border ${viewMode === 'card' ? 'bg-primary text-primary-foreground border-primary shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                    onClick={() => setViewMode('card')}
                                    aria-label="Vista de Tarjetas"
                                >
                                    <LayoutGrid className="h-4 w-4" /> Tarjetas
                                </button>
                            </div>
                        </div>
                        {viewMode === 'card' ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {lists.map((list) => (
                                    <Card key={list.id} className="flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span className="text-lg font-bold leading-tight">{list.listName}</span>
                                                <Badge
                                                    className={
                                                        list.listStatus === "publish"
                                                            ? "bg-pink-300 text-white"
                                                            : "bg-gray-400 text-white"
                                                    }
                                                    variant="secondary"
                                                >
                                                    {list.listStatus === "publish" ? "Publicada" : "Borrador"}
                                                </Badge>
                                            </CardTitle>
                                            {/* Notification icon-only button below the status chip */}
                                            <div className="flex justify-end mt-2 gap-2">
                                                <div className="relative group">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0"
                                                        aria-label="Ir a la lista publicada"
                                                    >
                                                        <ArrowUpRight className="h-5 w-5" />
                                                    </Button>
                                                    <span className="absolute z-10 left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-white text-gray-900 border border-gray-200 shadow text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                                                        Ir a la lista publicada
                                                    </span>
                                                </div>
                                                <div className="relative group">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => onViewNotifications(list.id)}
                                                        aria-label="Ver notificaciones"
                                                    >
                                                        <Bell className="h-5 w-5" />
                                                    </Button>
                                                    <span className="absolute z-10 left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-white text-gray-900 border border-gray-200 shadow text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                                                        Ver notificaciones
                                                    </span>
                                                </div>
                                            </div>
                                            <CardDescription className="mt-1 text-gray-500">
                                                Creada el {list.eventDate ? String(list.eventDate).split("T")[0] : ""}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="mb-1 font-medium">
                                                {list.productCount} {list.productCount === 1 ? 'artículo' : 'artículos'}
                                            </p>
                                            <p className="text-sm text-gray-600">Tipo de Evento: {getEventTypeLabel(Number(list.eventType))}</p>
                                        </CardContent>
                                        <CardFooter className="flex flex-wrap gap-2 justify-between">
                                            <Button variant="outline" onClick={() => handleEdit(list)}> 
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </Button>
                                            {list.listStatus === "publish" && (
                                                <Button variant="outline" onClick={() => onViewProgressReport(list.id, mockProgressReportData)}>
                                                    <BarChart className="mr-2 h-4 w-4" />
                                                    Progreso
                                                </Button>
                                            )}
                                            <Button variant="outline" onClick={() => handleShowQRCode({ id: list.id, name: list.listName })}>
                                                <QrCode className="mr-2 h-4 w-4" />
                                                QR
                                            </Button>
                                            <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => setListToDelete(list)}>
                                                <Trash className="mr-2 h-4 w-4" />
                                                Borrar
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">Nombre</th>
                                            <th className="px-4 py-2 text-left">Estado</th>
                                            <th className="px-4 py-2 text-left">Fecha</th>
                                            <th className="px-4 py-2 text-left">Artículos</th>
                                            <th className="px-4 py-2 text-left">Tipo de Evento</th>
                                            <th className="px-4 py-2 text-left">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lists.map((list) => (
                                            <tr key={list.id} className="border-t">
                                                <td className="px-4 py-2 font-medium">{list.listName}</td>
                                                <td className="px-4 py-2">
                                                    <Badge
                                                        className={
                                                            list.listStatus === "publish"
                                                                ? "bg-pink-300 text-white"
                                                                : "bg-gray-400 text-white"
                                                        }
                                                        variant="secondary"
                                                    >
                                                        {list.listStatus === "publish" ? "Publicada" : "Borrador"}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-2">{list.eventDate ? String(list.eventDate).split("T")[0] : ""}</td>
                                                <td className="px-4 py-2">{list.productCount}</td>
                                                <td className="px-4 py-2">{getEventTypeLabel(Number(list.eventType))}</td>
                                                <td className="px-4 py-2 flex flex-wrap gap-1">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(list)}> 
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {list.listStatus === "publish" && (
                                                        <Button variant="outline" size="sm" onClick={() => onViewProgressReport(list.id, mockProgressReportData)}>
                                                            <BarChart className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" size="sm" onClick={() => handleShowQRCode({ id: list.id, name: list.listName })}>
                                                        <QrCode className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setListToDelete(list)}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => onViewNotifications(list.id)}>
                                                        <Bell className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <Dialog open={selectedQRCode !== null} onOpenChange={handleCloseQRCode}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Código QR para {selectedQRCode?.name}</DialogTitle>
                                <DialogDescription>
                                    Escanea este código QR para acceder a la lista de regalos.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center">
                                <QRCodeSVG
                                    id="qr-code-canvas"
                                    value={`https://example.com/gift-list/${selectedQRCode?.id}`}
                                    size={200}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleDownloadQRCode}>Descargar QR</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!listToDelete} onOpenChange={() => setListToDelete(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>¿Borrar lista?</DialogTitle>
                                <DialogDescription>
                                    ¿Estás seguro de que deseas borrar la lista &quot;{listToDelete?.listName}&quot;? Esta acción no se puede deshacer.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setListToDelete(null)} disabled={isDeleting}>Cancelar</Button>
                                <Button variant="destructive" onClick={async () => {
                                    if (!listToDelete) return;
                                    setIsDeleting(true);
                                    try {
                                        await deleteGiftList(listToDelete.id);
                                        setLists(lists => lists.filter(l => l.id !== listToDelete.id));
                                        setListToDelete(null);
                                    } catch {
                                        setIsDeleting(false);
                                    } finally {
                                        setIsDeleting(false);
                                    }
                                }} disabled={isDeleting}>
                                    {isDeleting ? 'Borrando...' : 'Borrar'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    )
}

// Función utilitaria para mapear GiftList a initialData para GiftListCreationProcess
function mapGiftListToInitialData(list: GiftList) {
    return {
        eventTypeDTO: {
            type: Number(list.eventType),
            customType: list.customEventType || undefined,
        },
        guestCount: list.guestCount,
        minContribution: list.minContribution,
        selectedGifts: list.products || [], // Ahora sí se asegura que estén los productos completos
        listDetails: {
            eventDate: list.eventDate || null,
            campaignStartDate: list.campaignStartDate || null,
            campaignStartTime: list.campaignStartTime || "",
            campaignEndDate: list.campaignEndDate || null,
            campaignEndTime: list.campaignEndTime || "",
            location: list.location || [-17.3936, -66.157],
            address: list.address || "",
            listName: list.listName || "",
        },
        confirmationData: {
            email: list.email || "",
            phone: list.phone || "",
            useMinContribution: list.useMinContribution ?? true,
            termsAccepted: list.termsAccepted ?? false,
        },
        listStatus: list.listStatus === "publish" ? "publish" : "draft",
        listId: list.id,
    }
}

