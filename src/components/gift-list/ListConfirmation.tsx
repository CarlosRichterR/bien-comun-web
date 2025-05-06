import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Send, Edit2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogDescription } from "@/components/ui/dialog"
import { ConfirmationData } from '@/types/models/ConfirmationData'

interface ListConfirmationProps {
    onSubmit: (confirmationData: ConfirmationData) => void;
    onBack: () => void;
    initialData: ConfirmationData;
    minContribution: number; // Nuevo prop separado
    onMinContributionChange: (value: number) => void;
    onChange: (updatedData: ConfirmationData) => void;
    isPublishable: boolean; // Nuevo prop
    missingFields?: string[]; // Nueva prop opcional
}

export function ListConfirmation({
    onSubmit,
    onBack,
    initialData,
    minContribution, // Recibe el prop
    onMinContributionChange,
    onChange,
    isPublishable, // Recibe el prop
    missingFields = [] // Por defecto vacío
}: ListConfirmationProps) {
    const [confirmationData, setConfirmationData] = useState<ConfirmationData>(initialData);

    const [isEditingMinContribution, setIsEditingMinContribution] = useState(false);
    const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
    const [canCheckTerms, setCanCheckTerms] = useState(false);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [showWarnings, setShowWarnings] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const updateField = <K extends keyof ConfirmationData>(field: K, value: ConfirmationData[K]) => {
        setConfirmationData(prev => {
            const updated = { ...prev, [field]: value };
            // onChange(updated);
            return updated;
        });
    };

     // Llama a onChange cada vez que listDetails cambie
        useEffect(() => {
            onChange(confirmationData);
        }, [confirmationData, onChange]);

    const handleScroll = () => {
        if (scrollAreaRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                setHasScrolledToBottom(true);
            } else {
                setHasScrolledToBottom(false);
            }
        }
    };

    const handleDisabledClick = (e: React.MouseEvent) => {
        if (!isPublishable) {
            e.preventDefault();
            setShowWarnings(true);
        }
    };

    const termsAndConditions = `
  <h2 style="font-size: 1.5em; font-weight: bold; margin-bottom: 1em;">Términos y Condiciones de Uso</h2>
  <p style="font-style: italic; margin-bottom: 1em;">Última actualización: [Fecha]</p>

  <h3 style="font-size: 1.2em; font-weight: bold; margin-top: 1em;">1. Descripción del Servicio</h3>
  <p>Nuestra aplicación permite a los usuarios crear <strong>listas de regalos</strong> para eventos especiales como bodas, baby showers y celebraciones similares. Los participantes pueden contribuir económicamente de forma segura y transparente a través de nuestra plataforma.</p>

  <h3 style="font-size: 1.2em; font-weight: bold; margin-top: 1em;">2. Obligaciones del Usuario</h3>
  <ul style="list-style-type: disc; margin-left: 2em;">
    <li>El usuario debe proporcionar información veraz al registrarse y al crear listas de regalos.</li>
    <li>Está <em>estrictamente prohibido</em> utilizar la aplicación para actividades fraudulentas o ilícitas.</li>
    <li>Los ítems personalizados agregados a las listas deben respetar las leyes y no incluir contenido ofensivo, discriminatorio o inapropiado.</li>
  </ul>

  <h3 style="font-size: 1.2em; font-weight: bold; margin-top: 1em;">3. Proceso de Publicación y Aprobación</h3>
  <p>Todas las publicaciones, incluidas las listas de regalos, serán revisadas y aprobadas por nuestro equipo de moderadores antes de hacerse públicas.</p>
  <p>En el caso de listas que incluyan ítems personalizados, la revisión puede tardar hasta <strong>24-48 horas</strong>. Nos reservamos el derecho de rechazar o solicitar cambios en los ítems que no cumplan con nuestras políticas.</p>
  <p>Una vez aprobada la lista, será publicada y visible para los invitados.</p>

  <h3 style="font-size: 1.2em; font-weight: bold; margin-top: 1em;">4. Política de Reembolsos</h3>
  <p>Las contribuciones realizadas son definitivas y no son reembolsables, salvo en casos de error técnico o fuerza mayor, los cuales serán evaluados por nuestro equipo.</p>

  <h3 style="font-size: 1.2em; font-weight: bold; margin-top: 1em;">5. Privacidad y Seguridad</h3>
  <p>Toda la información personal se maneja conforme a nuestra Política de Privacidad, que garantiza la protección de los datos de los usuarios.</p>

  <h3 style="font-size: 1.2em; font-weight: bold; margin-top: 1em;">6. Modificaciones a los Términos</h3>
  <p>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a través de la aplicación con al menos 15 días de anticipación.</p>

  <h3 style="font-size: 1.2em; font-weight: bold; margin-top: 1em;">7. Aceptación de los Términos</h3>
  <p>Al usar la aplicación, el usuario acepta plenamente estos Términos y Condiciones, incluyendo el proceso de revisión y aprobación de las publicaciones.</p>
  `

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Confirmar Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        value={confirmationData.email}
                        onChange={e => updateField("email", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Número de Teléfono</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={confirmationData.phone}
                        onChange={e => updateField("phone", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Contribución Mínima</Label>
                    <RadioGroup
                        value={confirmationData.useMinContribution ? "yes" : "no"}
                        onValueChange={(value) => updateField("useMinContribution", value === "yes")}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center">
                            <RadioGroupItem value="yes" id="yes" />
                            <Label
                                htmlFor="yes"
                                className={`flex items-center space-x-2 cursor-pointer transition-colors ${
                                    confirmationData.useMinContribution ? "text-primary font-semibold" : "text-muted-foreground"
                                }`}
                            >
                                <span>Sí, usar</span>
                                {isEditingMinContribution ? (
                                    <Input
                                        type="number"
                                        min="0"
                                        step="10.0"
                                        value={minContribution}
                                        onChange={(e) => {
                                            const newValue = parseFloat(e.target.value) || 0;
                                            onMinContributionChange(newValue);
                                        }}
                                        onBlur={() => setIsEditingMinContribution(false)}
                                        className="w-32 inline-block"
                                        autoFocus
                                    />
                                ) : (
                                    <span>${minContribution.toFixed(2)}</span>
                                )}
                            </Label>
                            {!isEditingMinContribution && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditingMinContribution(true)}
                                    className="p-0"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center mt-2">
                            <RadioGroupItem value="no" id="no" />
                            <Label
                                htmlFor="no"
                                className={`ml-2 cursor-pointer transition-colors ${
                                    !confirmationData.useMinContribution ? "text-primary font-semibold" : "text-muted-foreground"
                                }`}
                            >
                                No establecer mínimo
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={confirmationData.termsAccepted}
                        onCheckedChange={(checked) => {
                            if (canCheckTerms) {
                                updateField("termsAccepted", checked as boolean);
                            }
                        }}
                        disabled={!canCheckTerms}
                    />
                    <Label htmlFor="terms" className="text-sm">
                        Acepto los{" "}
                        <Dialog open={isTermsDialogOpen} onOpenChange={setIsTermsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="link" className="p-0 h-auto font-normal">
                                    términos y condiciones
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Términos y Condiciones</DialogTitle>
                                    <DialogDescription>
                                        Por favor, lea atentamente los siguientes términos y condiciones.
                                    </DialogDescription>
                                </DialogHeader>
                                <div
                                    ref={scrollAreaRef}
                                    className="h-[50vh] overflow-y-auto"
                                    onScroll={handleScroll}
                                >
                                    <div
                                        className="p-4 text-sm"
                                        dangerouslySetInnerHTML={{ __html: termsAndConditions }}
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        onClick={() => {
                                            setIsTermsDialogOpen(false);
                                            setCanCheckTerms(true);
                                            updateField("termsAccepted", true);
                                        }}
                                        disabled={!hasScrolledToBottom}
                                    >
                                        {hasScrolledToBottom ? "Aceptar y Cerrar" : "Desplácese hasta el final"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Label>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 items-stretch">
                <div className="flex justify-between w-full">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Atrás
                    </Button>
                    <div className="relative">
                        {!isPublishable && (
                            <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}
                                onClick={handleDisabledClick}
                                aria-hidden="true"
                            />
                        )}
                        <Button
                            type="button"
                            disabled={!isPublishable}
                            tabIndex={isPublishable ? 0 : -1}
                            onClick={() => isPublishable && onSubmit(confirmationData)}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Publicar
                        </Button>
                    </div>
                </div>
                {showWarnings && !isPublishable && missingFields.length > 0 && (
                    <ul className="mt-2 text-red-600 text-sm list-disc list-inside animate-pulse">
                        {missingFields.map((msg, idx) => (
                            <li key={idx}>{msg}</li>
                        ))}
                    </ul>
                )}
            </CardFooter>
        </Card>
    );
}

