import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GuestInfoCollection({
    guestCount,
    minContribution,
    onSubmit,
    onBack,
    onGuestCountChange,
    onMinContributionChange,
}: {
    guestCount: number;
    minContribution: number;
    onSubmit: (count: number, minContrib: number) => void;
    onBack: () => void;
    onGuestCountChange: (count: number) => void;
    onMinContributionChange: (minContrib: number) => void;
}) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(guestCount, minContribution);
    };

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
                            onChange={(e) => onGuestCountChange(Number(e.target.value))}
                            placeholder="Ingrese el número de invitados"
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
                            onChange={(e) => onMinContributionChange(Number(e.target.value))}
                            placeholder="Ingrese la contribución mínima"
                            required
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

