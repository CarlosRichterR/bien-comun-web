import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface ListDetailsProps {
    eventType: string;
    onSubmit: (listDetails: ListDetailsData) => void;
    onBack: () => void;
    onNext: () => void;
}

interface ListDetailsData {
    listName: string;
    eventDate: Date;
    campaignStartDate: Date;
    campaignStartTime: string;
    campaignEndDate: Date;
    campaignEndTime: string;
    location: [number, number] | null;
}

export function ListDetails({ eventType, onSubmit, onBack, onNext }: ListDetailsProps) {
    const [listName, setListName] = useState(`Mi Lista de ${eventType}`)
    const [eventDate, setEventDate] = useState<Date>(new Date())
    const [campaignStartDate, setCampaignStartDate] = useState<Date>(new Date())
    const [campaignStartTime, setCampaignStartTime] = useState('09:00')
    const [campaignEndDate, setCampaignEndDate] = useState<Date>(new Date())
    const [campaignEndTime, setCampaignEndTime] = useState('18:00')
    const [location, setLocation] = useState<[number, number] | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (listName && eventDate && campaignStartDate && campaignStartTime && campaignEndDate && campaignEndTime && location) {
            onSubmit({ listName, eventDate, campaignStartDate, campaignStartTime, campaignEndDate, campaignEndTime, location })
            onNext()
        }
    }

    function LocationPicker() {
        const map = useMapEvents({
            click(e) {
                setLocation([e.latlng.lat, e.latlng.lng])
            },
        })

        return location ? (
            <Marker
                position={location}
                icon={L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                })}
            />
        ) : null
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Detalles de la Lista</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="listName">Nombre de la Lista</Label>
                        <Input
                            id="listName"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            placeholder="Ingrese el nombre de la lista"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Fecha del Evento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !eventDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {eventDate ? format(eventDate, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={eventDate}
                                    onSelect={setEventDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha de expiración de la Lista</Label>
                        <div className="flex space-x-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !campaignEndDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {campaignEndDate ? format(campaignEndDate, "PPP", { locale: es }) : <span>Fecha de fin</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={campaignEndDate}
                                        onSelect={setCampaignEndDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="time"
                                    value={campaignEndTime}
                                    onChange={(e) => setCampaignEndTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <div className="h-64 rounded-md overflow-hidden">
                            <MapContainer center={[-16.5, -68.15]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationPicker />
                            </MapContainer>
                        </div>
                        {location && (
                            <p className="text-sm text-muted-foreground">
                                Ubicación seleccionada: {location[0].toFixed(6)}, {location[1].toFixed(6)}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>Atrás</Button>
                    <Button type="submit">Siguiente</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

