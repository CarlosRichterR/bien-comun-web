import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
    id: number
    message: string
    date: string
    isRead: boolean
}

interface InboxProps {
    notifications: Notification[]
}

const mockNotifications: Notification[] = [
    { id: 1, message: "Juan ha contribuido $50 a tu lista 'Boda'", date: "2023-06-15", isRead: false },
    { id: 2, message: "María ha contribuido $30 a tu lista 'Baby Shower'", date: "2023-06-14", isRead: false },
    { id: 3, message: "Carlos ha contribuido $25 a tu lista 'Cumpleaños'", date: "2023-06-13", isRead: true },
    { id: 4, message: "Ana ha contribuido $40 a tu lista 'Boda'", date: "2023-06-12", isRead: true },
]

export function Inbox({ notifications }: InboxProps) {
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications)

    const markAsRead = (id: number) => {
        setLocalNotifications(localNotifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        ))
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Notificaciones</CardTitle>
                <CardDescription>Revisa las contribuciones recientes a tus listas de regalos</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    {localNotifications.map((notification) => (
                        <Card key={notification.id} className="mb-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {notification.isRead ? notification.message : <strong>{notification.message}</strong>}
                                </CardTitle>
                                {!notification.isRead && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        Marcar como leído
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">{notification.date}</p>
                            </CardContent>
                        </Card>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

