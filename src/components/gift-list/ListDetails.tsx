"use client";

import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Importar estilos de Leaflet
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
    location: [number, number]; // Coordenadas seleccionadas
    address: string; // Dirección literal
}

export function ListDetails({ eventType, onSubmit, onBack, onNext }: ListDetailsProps) {
    const [listName, setListName] = useState(`Mi Lista de ${eventType}`);
    const [location, setLocation] = useState<[number, number]>([-17.3936, -66.157]); // Coordenadas iniciales (Cochabamba, Bolivia)
    const [address, setAddress] = useState<string>(""); // Dirección literal
    const [eventDate, setEventDate] = useState<Date>(new Date());
    const [campaignEndDate, setCampaignEndDate] = useState<Date>(new Date());
    const [campaignEndTime, setCampaignEndTime] = useState<string>("18:00");

    // Función para realizar geocodificación inversa
    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name); // Actualizar la dirección literal
            } else {
                setAddress("Dirección no encontrada");
            }
        } catch (error) {
            console.error("Error al obtener la dirección:", error);
            setAddress("Error al obtener la dirección");
        }
    };

    useEffect(() => {
        // Configurar el mapa
        const map = L.map("map").setView(location, 13); // Coordenadas iniciales y zoom

        // Agregar capa base de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Agregar marcador inicial
        const marker = L.marker(location, { draggable: true }).addTo(map);

        // Obtener la dirección inicial
        fetchAddress(location[0], location[1]);

        // Actualizar la ubicación al hacer clic en el mapa
        map.on("click", (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            setLocation([lat, lng]);
            marker.setLatLng([lat, lng]); // Mover el marcador a la nueva ubicación
            fetchAddress(lat, lng); // Obtener la dirección literal
        });

        // Actualizar la ubicación al arrastrar el marcador
        marker.on("dragend", () => {
            const { lat, lng } = marker.getLatLng();
            setLocation([lat, lng]);
            fetchAddress(lat, lng); // Obtener la dirección literal
        });

        // Limpiar el mapa al desmontar el componente
        return () => {
            map.remove();
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (listName && location && address) {
            onSubmit({
                listName,
                eventDate,
                campaignStartDate: new Date(),
                campaignStartTime: "09:00",
                campaignEndDate,
                campaignEndTime,
                location,
                address,
            });
            onNext();
        }
    };

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
                                    {eventDate
                                        ? format(eventDate, "PPP", { locale: es })
                                        : <span>Seleccione una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                style={{ zIndex: 1000, position: "relative" }} // Ajuste del z-index
                            >
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
                        <Label>Fecha de Expiración de la Lista</Label>
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
                                        {campaignEndDate
                                            ? format(campaignEndDate, "PPP", { locale: es })
                                            : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    style={{ zIndex: 1000, position: "relative" }} // Ajuste del z-index
                                >
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
                        <Label>Mapa</Label>
                        <div id="map" style={{ height: "300px", width: "100%" }}></div>
                        <p className="text-sm text-muted-foreground">
                            Coordenadas seleccionadas: {location[0].toFixed(6)}, {location[1].toFixed(6)}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} // Permitir que el usuario edite la dirección
                            placeholder="La dirección aparecerá aquí"
                            className="w-full p-2 border rounded-md text-sm text-muted-foreground resize-none" // Estilos para el textarea
                            rows={3} // Número de líneas visibles
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Atrás
                    </Button>
                    <Button type="submit">Siguiente</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

