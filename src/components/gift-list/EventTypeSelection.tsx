import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Home } from 'lucide-react'

export enum EventType {
    Wedding = 0,
    Birthday,
    BabyShower,
    Other
}

interface EventTypeSelectionProps {
    eventType: EventType;
    onEventTypeSelected: (eventType: EventType, customEventType?: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export function EventTypeSelection({ eventType, onEventTypeSelected, onNext, onBack }: EventTypeSelectionProps) {
    const [selectedType, setSelectedType] = useState<EventType>(eventType);
    const [customEventType, setCustomEventType] = useState("");

    useEffect(() => {
        setSelectedType(eventType);
    }, [eventType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedType === EventType.Other && !customEventType.trim()) {
            return; // Don't submit if "Otro" is selected but no custom type is entered
        }
        onEventTypeSelected(selectedType, selectedType === EventType.Other ? customEventType : undefined);
        onNext();
    };

    const handleGoToDashboard = () => {
        onBack();
    };

    const handleCustomEventTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomEventType(value);
        onEventTypeSelected(selectedType, value); // Llama a onEventTypeSelected con el valor actualizado
    };

    const handleEventTypeChange = (value: string) => {
        const eventType = parseInt(value) as EventType;
        setSelectedType(eventType);
        onEventTypeSelected(eventType, eventType === EventType.Other ? customEventType : undefined); // Llama a onEventTypeSelected
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-card">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Selecciona el Tipo de Evento</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <RadioGroup
                        value={selectedType.toString()}
                        onValueChange={handleEventTypeChange}
                        className="space-y-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={EventType.Wedding.toString()} id="boda" />
                            <Label htmlFor="boda">Boda</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={EventType.Birthday.toString()} id="cumpleanos" />
                            <Label htmlFor="cumpleanos">Cumpleaños</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={EventType.BabyShower.toString()} id="babyShower" />
                            <Label htmlFor="babyShower">Baby Shower</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={EventType.Other.toString()} id="otro" />
                            <Label htmlFor="otro">Otro</Label>
                        </div>
                    </RadioGroup>
                    {selectedType === EventType.Other && (
                        <div className="mt-4">
                            <Label htmlFor="customEventType">Especifica el Tipo de Evento</Label>
                            <Input
                                id="customEventType"
                                value={customEventType}
                                onChange={handleCustomEventTypeChange}
                                placeholder="Ingresa el tipo de evento personalizado"
                                className="mt-1"
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleGoToDashboard}>
                        <Home className="mr-2 h-4 w-4" />
                        Ir al Inicio
                    </Button>
                    <Button type="submit">Siguiente</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

