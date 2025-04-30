import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Send, Edit2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DialogDescription } from "@/components/ui/dialog"

interface ListConfirmationProps {
    onSubmit: (confirmationData: ConfirmationData) => void;
    onBack: () => void;
    initialEmail: string;
    initialPhone: string;
    initialMinContribution: number;
}

interface ConfirmationData {
    email: string;
    phone: string;
    useMinContribution: boolean;
    minContribution: number;
    termsAccepted: boolean;
}

export function ListConfirmation({ onSubmit, onBack, initialEmail, initialPhone, initialMinContribution }: ListConfirmationProps) {
    const [email, setEmail] = useState(initialEmail);
    const [phone, setPhone] = useState(initialPhone);
    const [useMinContribution, setUseMinContribution] = useState<boolean>(true);
    const [minContribution, setMinContribution] = useState<number>(initialMinContribution);
    const [isEditingMinContribution, setIsEditingMinContribution] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
    const [canCheckTerms, setCanCheckTerms] = useState(false); // New state to control checkbox

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            email,
            phone,
            useMinContribution,
            minContribution,
            termsAccepted
        });
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
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Número de Teléfono</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Contribución Mínima</Label>
                        <RadioGroup value={useMinContribution ? "yes" : "no"} onValueChange={(value) => setUseMinContribution(value === "yes")}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="yes" />
                                    <Label htmlFor="yes">
                                        Sí, usar ${isEditingMinContribution ? (
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={minContribution}
                                                onChange={(e) => setMinContribution(parseFloat(e.target.value) || 0)}
                                                onBlur={() => setIsEditingMinContribution(false)}
                                                className="w-20 inline-block"
                                                autoFocus
                                            />
                                        ) : (
                                            <span>{minContribution.toFixed(2)}</span>
                                        )}
                                    </Label>
                                </div>
                                {!isEditingMinContribution && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditingMinContribution(true)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no">No establecer mínimo</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => {
                                if (canCheckTerms) {
                                    setTermsAccepted(checked as boolean);
                                }
                            }}
                            disabled={!canCheckTerms} // Disable checkbox until modal is opened
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
                                    <div className="h-[50vh] overflow-y-auto">
                                        <div
                                            className="p-4 text-sm"
                                            dangerouslySetInnerHTML={{ __html: termsAndConditions }}
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            onClick={() => {
                                                setIsTermsDialogOpen(false);
                                                setCanCheckTerms(true); // Allow checkbox to be checked
                                            }}
                                        >
                                            Aceptar y Cerrar
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </Label>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Atrás
                    </Button>
                    <Button type="submit" disabled={!termsAccepted}>
                        <Send className="mr-2 h-4 w-4" />
                        Publicar
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

