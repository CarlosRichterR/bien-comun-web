import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface GuestInfoCollectionProps {
    onSubmit: (guestCount: number, minContribution: number) => void;
    onBack: () => void;
    onNext: () => void;
}

export function GuestInfoCollection({ onSubmit, onBack, onNext }: GuestInfoCollectionProps) {
    const [guestCount, setGuestCount] = useState<number>(0)
    const [minContribution, setMinContribution] = useState<number>(10)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (guestCount > 0 && minContribution >= 0) {
            onSubmit(guestCount, minContribution)
            onNext()
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Información de Invitados</CardTitle>
                <CardDescription>Por favor, proporcione detalles sobre sus invitados y la contribución mínima.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="guestCount">Número de Invitados</Label>
                        <Input
                            id="guestCount"
                            type="number"
                            min="1"
                            value={guestCount || ''}
                            onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="minContribution">Contribución Mínima ($)</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Monto mínimo que se puede aportar para contribuir con el regalo.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input
                            id="minContribution"
                            type="number"
                            min="0"
                            step="0.01"
                            value={minContribution || ''}
                            onChange={(e) => setMinContribution(parseFloat(e.target.value) || 0)}
                            required
                        />
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

