import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from 'qrcode.react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from 'lucide-react'

interface ContributionModalProps {
    isOpen: boolean
    onClose: () => void
    itemName: string
    itemPrice: number
    contributedAmount: number
    minContribution: number
    onContribute: (amount: number, contactInfo: string) => void
}

export function ContributionModal({
    isOpen,
    onClose,
    itemName,
    itemPrice,
    contributedAmount,
    minContribution,
    onContribute
}: ContributionModalProps) {
    const [step, setStep] = useState<'amount' | 'contact' | 'qr'>('amount')
    const [contributionAmount, setContributionAmount] = useState('')
    const [contactType, setContactType] = useState<'email' | 'phone'>('email')
    const [contactInfo, setContactInfo] = useState('')
    const [error, setError] = useState<string | null>(null)

    const remainingAmount = itemPrice - contributedAmount
    const fullContribution = remainingAmount    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return re.test(String(email).toLowerCase())
    }

    const validatePhoneNumber = (phone: string) => {
        const re = /^[67]\d{7}$/
        return re.test(phone)
    }

    const handleNextStep = () => {
        if (step === 'amount') {
            setError(null)
            setStep('contact')
        } else if (step === 'contact') {
            if (contactType === 'email' && !validateEmail(contactInfo)) {
                setError('Por favor, ingrese un correo electrónico válido.')
            } else if (contactType === 'phone' && !validatePhoneNumber(contactInfo)) {
                setError('Por favor, ingrese un número de teléfono válido (8 dígitos, comenzando con 6 o 7).')
            } else {
                setError(null)
                setStep('qr')
            }
        }
    }

    const handlePreviousStep = () => {
        if (step === 'contact') {
            setStep('amount')
        } else if (step === 'qr') {
            setStep('contact')
        }
    }

    const handleConfirmPayment = () => {
        const amount = parseFloat(contributionAmount)
        onContribute(amount, contactInfo)
        resetModal()
        onClose()
    }

    const resetModal = () => {
        setStep('amount')
        setContributionAmount('')
        setContactType('email')
        setContactInfo('')
        setError(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetModal()
                onClose()
            }
        }}>
            <DialogContent>

                {step === 'amount' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Contribuir a {itemName}</DialogTitle>                            <DialogDescription>
                                Este artículo cuesta Bs {itemPrice.toFixed(2)}. Ya se ha contribuido Bs {contributedAmount.toFixed(2)}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">                            <Button onClick={() => setContributionAmount(fullContribution.toFixed(2))}>
                                Contribuir el monto completo (Bs {fullContribution.toFixed(2)})
                            </Button>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contribution" className="text-right">
                                    Monto
                                </Label>
                                <Input
                                    id="contribution"
                                    type="number"
                                    value={contributionAmount}
                                    onChange={(e) => setContributionAmount(e.target.value)}
                                    placeholder={`Mínimo Bs ${minContribution.toFixed(2)}`}
                                    className="col-span-3"
                                    min={minContribution}
                                    max={remainingAmount}
                                    step="0.01"
                                />
                            </div>
                        </div>                        <p className="text-sm text-muted-foreground mb-4">
                            Monto de contribución seleccionado: Bs {parseFloat(contributionAmount || '0').toFixed(2)}
                        </p>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter>
                            <Button onClick={onClose} variant="outline">Cancelar</Button>
                            <Button
                                onClick={handleNextStep}
                                disabled={!contributionAmount}
                            >
                                Siguiente
                            </Button>
                        </DialogFooter>
                    </>
                )}
                {step === 'contact' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Información de Contacto</DialogTitle>
                            <DialogDescription>
                                Por favor, proporcione su información de contacto para el comprobante de la contribución.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-w-md mx-auto">                            <p className="text-sm text-muted-foreground">
                                Monto de contribución seleccionado: Bs {parseFloat(contributionAmount || '0').toFixed(2)}
                            </p>
                            <RadioGroup value={contactType} onValueChange={(value: 'email' | 'phone') => setContactType(value)} className="grid gap-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="email" id="email" />
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="phone" id="phone" />
                                    <Label htmlFor="phone">Número de Teléfono</Label>
                                </div>
                            </RadioGroup>

                            {contactType === 'email' ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="email-input">Correo Electrónico</Label>
                                    <Input
                                        id="email-input"
                                        type="email"
                                        placeholder="Ingrese su correo electrónico"
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                        required
                                        aria-label="Correo Electrónico"
                                        aria-required="true"
                                    />
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    <Label htmlFor="phone-input">Número de Teléfono</Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                            +591
                                        </span>
                                        <Input
                                            id="phone-input"
                                            type="tel"
                                            placeholder="Ingrese su número de teléfono"
                                            value={contactInfo}
                                            onChange={(e) => setContactInfo(e.target.value)}
                                            required
                                            className="rounded-l-none"
                                            aria-label="Número de Teléfono"
                                            aria-required="true"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter>
                            <Button onClick={handlePreviousStep} variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Atrás
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                disabled={!contactInfo}
                            >
                                Siguiente
                            </Button>
                        </DialogFooter>
                    </>
                )}
                {step === 'qr' && (
                    <div className="flex flex-col items-center gap-4">
                        <QRCodeSVG value={`https://example.com/pay/${itemName}/${contributionAmount}`} size={200} />
                        <p>Escanee el código QR para realizar el pago de Bs {parseFloat(contributionAmount || '0').toFixed(2)}</p>
                        <DialogFooter className="w-full">
                            <Button onClick={handlePreviousStep} variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Atrás
                            </Button>
                            <Button onClick={handleConfirmPayment}>Confirmar Pago</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

