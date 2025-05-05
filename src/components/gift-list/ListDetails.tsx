"use client";

import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
import { ListDetailsData } from "@/types/models/ListDetails";

interface ListDetailsProps {
    initialDetails: ListDetailsData;
    onSubmit: (listDetails: ListDetailsData) => void;
    onBack: () => void;
    onNext: () => void;
    onChange: (updatedDetails: ListDetailsData) => void;
    isAddressModified: boolean; // Nueva prop
    setIsAddressModified: (value: boolean) => void;
}

export function ListDetails({ initialDetails, onSubmit, onBack, onNext, onChange, isAddressModified, setIsAddressModified }: ListDetailsProps) {
    const [listDetails, setListDetails] = useState<ListDetailsData>(initialDetails);

    const updateField = <K extends keyof ListDetailsData>(field: K, value: ListDetailsData[K]) => {
        setListDetails((prev) => ({ ...prev, [field]: value }));

        // Si el campo modificado es "address", activa la bandera en el padre
        if (field === "address") {
            setIsAddressModified(true);
        }
    };

    // Función para realizar geocodificación inversa
    const fetchAddress = async (lat: number, lng: number) => {
        try {
            // No sobrescribir si el usuario modificó manualmente el campo
            if (isAddressModified) return;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.display_name) {
                updateField("address", data.display_name); // Actualizar la dirección literal
            } else {
                updateField("address", "Dirección no encontrada");
            }
        } catch (error) {
            console.error("Error al obtener la dirección:", error);
            updateField("address", "Error al obtener la dirección");
        }
    };

    // Llama a onChange cada vez que listDetails cambie
    useEffect(() => {
        onChange(listDetails);
    }, [listDetails, onChange]);

    useEffect(() => {
        // Configurar el mapa
        const map = L.map("map").setView(listDetails.location!, 13); // Coordenadas iniciales y zoom

        // Agregar capa base de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Agregar marcador inicial
        const marker = L.marker(listDetails.location!, { draggable: true }).addTo(map);

        // Obtener la dirección inicial
        fetchAddress(listDetails.location![0], listDetails.location![1]);

        // Actualizar la ubicación al hacer clic en el mapa
        map.on("click", (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            updateField("location", [lat, lng]);
            marker.setLatLng([lat, lng]); // Mover el marcador a la nueva ubicación
            fetchAddress(lat, lng); // Obtener la dirección literal
        });

        // Actualizar la ubicación al arrastrar el marcador
        marker.on("dragend", () => {
            const { lat, lng } = marker.getLatLng();
            updateField("location", [lat, lng]);
            fetchAddress(lat, lng); // Obtener la dirección literal
        });

        // Limpiar el mapa al desmontar el componente
        return () => {
            map.remove();
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(listDetails);
        onNext();
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
                            value={listDetails.listName}
                            onChange={(e) => updateField("listName", e.target.value)}
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
                                        !listDetails.eventDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {listDetails.eventDate
                                        ? format(listDetails.eventDate, "PPP", { locale: es })
                                        : <span>Seleccione una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                style={{ zIndex: 1000, position: "relative" }} // Ajuste del z-index
                            >
                                <Calendar
                                    mode="single"
                                    selected={listDetails.eventDate}
                                    onSelect={(date) => updateField("eventDate", date!)}
                                    initialFocus
                                    disabled={(date) => date < new Date()} // Deshabilitar fechas pasadas
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
                                            !listDetails.campaignEndDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {listDetails.campaignEndDate
                                            ? format(listDetails.campaignEndDate, "PPP", { locale: es })
                                            : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    style={{ zIndex: 1000, position: "relative" }} // Ajuste del z-index
                                >
                                    <Calendar
                                        mode="single"
                                        selected={listDetails.campaignEndDate}
                                        onSelect={(date) => updateField("campaignEndDate", date!)}
                                        initialFocus
                                        disabled={(date) => date < new Date()} // Deshabilitar fechas pasadas
                                    />
                                </PopoverContent>
                            </Popover>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="time"
                                    value={listDetails.campaignEndTime}
                                    onChange={(e) => updateField("campaignEndTime", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Mapa</Label>
                        <div id="map" style={{ height: "300px", width: "100%", zIndex: 0, position: "relative" }}></div>
                        <p className="text-sm text-muted-foreground">
                            Coordenadas seleccionadas: {listDetails.location![0].toFixed(6)}, {listDetails.location![1].toFixed(6)}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <textarea
                            id="address"
                            value={listDetails.address}
                            onChange={(e) => {
                                updateField("address", e.target.value); // Actualiza el campo y activa el flag
                            }}
                            placeholder="La dirección aparecerá aquí"
                            className="w-full p-2 border rounded-md text-sm text-muted-foreground resize-none"
                            rows={3}
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

