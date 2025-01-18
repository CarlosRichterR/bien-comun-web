"use client"

import { useState } from "react"
import { PlusCircle, Edit, Eye, QrCode, Bell, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { QRCodeSVG } from 'qrcode.react'
import { mockProgressReportData } from "../utils/mockData";

// Updated mock data to include status
const mockLists = [
    { id: 1, name: "Lista de Regalos de Boda", date: "2023-12-15", itemCount: 25, eventType: "Boda", status: "published" },
    { id: 2, name: "Regalos para Baby Shower", date: "2024-02-01", itemCount: 15, eventType: "Baby Shower", status: "draft" },
    { id: 3, name: "Lista de Deseos de Cumpleaños", date: "2024-03-10", itemCount: 10, eventType: "Cumpleaños", status: "published" },
]

interface DashboardProps {
    onCreateNewList: () => void;
    onEditList: (listId: number, status: 'draft' | 'published') => void;
    onViewList: (listId: number) => void;
    onViewNotifications: (listId: number) => void;
    onViewProgressReport: (listId: number, progressReportData: any) => void; // Updated prop type
}

export default function Dashboard({ onCreateNewList, onEditList, onViewList, onViewNotifications, onViewProgressReport }: DashboardProps) {
    const [lists, setLists] = useState(mockLists)
    const [selectedQRCode, setSelectedQRCode] = useState<{ id: number, name: string } | null>(null)

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
                let downloadLink = document.createElement('a')
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
                                    {list.name}
                                    <Badge variant={list.status === "published" ? "default" : "secondary"}>
                                        {list.status === "published" ? "Publicada" : "Borrador"}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>Creada el {list.date}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p>{list.itemCount} artículos</p>
                                <p>Tipo de Evento: {list.eventType}</p>
                            </CardContent>
                            <CardFooter className="flex flex-wrap gap-2 justify-between">
                                {list.status === "draft" && (
                                    <Button variant="secondary" onClick={() => onEditList(list.id, list.status)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        console.log('View button clicked for list:', list.id);
                                        onViewList(list.id);
                                    }}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver
                                </Button>
                                {list.status === "published" && (
                                    <Button variant="outline" onClick={() => onViewProgressReport(list.id, mockProgressReportData)}> {/* Updated onClick prop */}
                                        <BarChart className="mr-2 h-4 w-4" />
                                        Progreso
                                    </Button>
                                )}
                                <Button variant="outline" onClick={() => onViewNotifications(list.id)}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notificaciones
                                </Button>
                                <Button variant="outline" onClick={() => handleShowQRCode(list)}>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    QR
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
        </div>
    )
}

