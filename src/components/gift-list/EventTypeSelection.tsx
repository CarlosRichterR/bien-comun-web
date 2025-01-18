import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Home } from 'lucide-react'

export type EventType = "Boda" | "Cumpleaños" | "Baby Shower" | "Otro"

interface EventTypeSelectionProps {
    onEventTypeSelected: (eventType: EventType, customEventType?: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export function EventTypeSelection({ onEventTypeSelected, onNext, onBack }: EventTypeSelectionProps) {
    const [selectedType, setSelectedType] = useState<EventType>("Boda")
    const [customEventType, setCustomEventType] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedType === "Otro" && !customEventType.trim()) {
            return // Don't submit if "Otro" is selected but no custom type is entered
        }
        onEventTypeSelected(selectedType, selectedType === "Otro" ? customEventType : undefined)
        onNext()
    }

    const handleGoToDashboard = () => {
        onBack();
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-card">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Selecciona el Tipo de Evento</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <RadioGroup
                        value={selectedType}
                        onValueChange={(value) => setSelectedType(value as EventType)}
                        className="space-y-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Boda" id="boda" />
                            <Label htmlFor="boda">Boda</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cumpleaños" id="cumpleanos" />
                            <Label htmlFor="cumpleanos">Cumpleaños</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Baby Shower" id="babyShower" />
                            <Label htmlFor="babyShower">Baby Shower</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Otro" id="otro" />
                            <Label htmlFor="otro">Otro</Label>
                        </div>
                    </RadioGroup>
                    {selectedType === "Otro" && (
                        <div className="mt-4">
                            <Label htmlFor="customEventType">Especifica el Tipo de Evento</Label>
                            <Input
                                id="customEventType"
                                value={customEventType}
                                onChange={(e) => setCustomEventType(e.target.value)}
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
    )
}

