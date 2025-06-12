"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Eye, QrCode, Bell, BarChart, Trash, ArrowUpRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { QRCodeSVG } from 'qrcode.react'
import { mockProgressReportData } from "../utils/mockData";
import { fetchGiftLists, GiftList } from "@/services/listService"
import { deleteGiftList } from "@/services/listService"
import { getEventTypeLabel } from "@/lib/getEventTypeLabel";

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

    useEffect(() => {
        fetchGiftLists()
            .then(data => setLists(data))
            .catch(() => setLists([]))
    }, [])

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

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Inicio</h2>
                <Button onClick={onCreateNewList} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nueva Lista
                </Button>
            </header>

            <section>
                <h3 className="text-xl font-semibold mb-4">Tus Listas de Regalos</h3>
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
                                <p className="mb-1 font-medium">{list.productCount} artículos</p>
                                <p className="text-sm text-gray-600">Tipo de Evento: {getEventTypeLabel(Number(list.eventType))}</p>
                            </CardContent>
                            <CardFooter className="flex flex-wrap gap-2 justify-between">
                                {list.listStatus !== "publish" && (
                                    <Button variant="outline" onClick={() => onEditList(list.id, list.listStatus === "publish" ? "published" : "draft")}> 
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => onViewList(list.id)}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver
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
        </div>
    )
}

