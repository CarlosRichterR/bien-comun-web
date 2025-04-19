"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EventTypeSelection } from "./EventTypeSelection"
import { GuestInfoCollection } from "./GuestInfoCollection"
import { GiftSelection } from "./GiftSelection"
import { ListDetails } from "./ListDetails"
import { ListConfirmation } from "./ListConfirmation"
import { Button } from "@/components/ui/button"
import { CatalogItem } from "../../utils/catalog-data"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EventTypeDTO } from "@/types/models/EventTypeDTO"
import { EventType } from "@/types/enums/EventType"

type Step = "event-selection" | "guest-info" | "gift-selection" | "list-details" | "list-confirmation"
type ListStatus = "draft" | "publish"

interface GiftListCreationProcessProps {
    onComplete: (listData: any) => void;
    onExit: () => void;
    onBack: () => void;
}

export function GiftListCreationProcess({ onComplete, onExit, onBack }: GiftListCreationProcessProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<Step>("event-selection")
    const [eventTypeDTO, setEventTypeDTO] = useState<EventTypeDTO>({
        type: EventType.Wedding,
        customType: undefined,
    });
    const [guestCount, setGuestCount] = useState<number>(0)
    const [contributionPerGuest, setContributionPerGuest] = useState<number>(0)
    const [minContribution, setMinContribution] = useState<number>(200)
    const [selectedGifts, setSelectedGifts] = useState<CatalogItem[]>([])
    const [listDetails, setListDetails] = useState<any>(null)
    const [confirmationData, setConfirmationData] = useState<any>(null)
    const [userEmail, setUserEmail] = useState<string>(""); // Added state for user email
    const [userPhone, setUserPhone] = useState<string>(""); // Added state for user phone
    const [listStatus, setListStatus] = useState<ListStatus>("draft"); // Added state for list status

    const steps: Step[] = ["event-selection", "guest-info", "gift-selection", "list-details", "list-confirmation"]
    const currentStepIndex = steps.indexOf(currentStep)

    const stepLabels: Record<Step, string> = {
        "event-selection": "Tipo de Evento",
        "guest-info": "Información de Invitados",
        "gift-selection": "Selección de Regalos",
        "list-details": "Detalles de la Lista",
        "list-confirmation": "Confirmación"
    }

    const handleNext = () => {
        const nextIndex = currentStepIndex + 1
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex])
        }
    }

    const handleBack = () => {
        const prevIndex = currentStepIndex - 1
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex])
        }
    }

    const handleGuestInfoUpdate = (count: number) => {
        setGuestCount(count);
    };

    const handleMinContributionUpdate = (minContrib: number) => {
        setMinContribution(minContrib);
    };

    const handleSelectedGiftsChange = (gifts: CatalogItem[]) => {
        setSelectedGifts(gifts);
    };

    const handleExit = async () => {
        // Save as draft logic here
        const draftData = {
            eventTypeDTO: {
                eventType: eventTypeDTO.type as number,
                customEventType: eventTypeDTO.customType,
            },
            guestCount,
            minContribution,
            listStatus,
            products: selectedGifts.map((gift) => ({
                productId: gift.id,
                quantity: gift.quantity || 1, // Default to 1 if quantity is not defined
            })),
        };

        try {
            const response = await fetch(`${process.env.API_URL}/api/List`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(draftData),
            });

            if (!response.ok) {
                throw new Error('Failed to save draft');
            }

            // const result = await response.json();
            // console.log('Draft saved successfully:', result);
            // localStorage.setItem('giftListDraft', JSON.stringify(draftData));
            onExit();
        } catch (error) {
            console.error('Error saving draft:', error);
            // Handle error (e.g., show a notification to the user)
        }
    }

    const handleEventTypeSelected = (type: EventType, custom?: string) => {
        setEventTypeDTO({ type, customType: custom });
    }

    const handleGuestInfoSubmitted = (count: number, minContrib: number) => {
        setGuestCount(count)
        setMinContribution(minContrib)
        handleNext()
    }

    const handleGiftSelectionSave = (gifts: CatalogItem[]) => {
        setSelectedGifts(gifts)
        handleNext()
    }

    const handleListDetailsSubmitted = (details: any) => {
        setListDetails(details)
        handleNext()
    }

    const handleListConfirmation = (data: any) => {
        setConfirmationData(data)
        onComplete({
            eventTypeDTO,
            guestCount,
            minContribution,
            selectedGifts,
            listDetails,
            confirmationData: data
        })
    }

    const loadDraft = () => {
        setEventTypeDTO({
            type: EventType.Wedding,
            customType: undefined,
        });
    }

    useEffect(() => {
        loadDraft()
    }, [])

    return (
        <div className="w-full max-w-4xl mx-auto relative">
            <div className="mb-8">
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    {steps.map((step, index) => (
                        <div key={step} className={`flex flex-col items-center ${index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {index + 1}
                            </div>
                            <span className="text-xs mt-1">{stepLabels[step]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep === "event-selection" && (
                        <EventTypeSelection
                            eventTypeDTO={eventTypeDTO} // Pasar el objeto EventTypeDTO como prop
                            onEventTypeSelected={handleEventTypeSelected}
                            onNext={handleNext}
                            onBack={onBack}
                        />
                    )}
                    {currentStep === "guest-info" && (
                        <GuestInfoCollection
                            guestCount={guestCount} // Pasar guestCount como prop
                            minContribution={minContribution} // Pasar minContribution como prop
                            onSubmit={handleGuestInfoSubmitted} // Manejar el envío de datos
                            onBack={handleBack} // Manejar el retroceso
                            onGuestCountChange={handleGuestInfoUpdate} // Actualizar guestCount
                            onMinContributionChange={handleMinContributionUpdate} // Actualizar minContribution
                        />
                    )}
                    {currentStep === "gift-selection" && (
                        <GiftSelection
                            eventType={eventTypeDTO.type}
                            customEventType={eventTypeDTO.customType}
                            listId={null}
                            initialStatus="draft"
                            onSave={handleGiftSelectionSave}
                            guestCount={guestCount}
                            minContribution={minContribution}
                            onBack={handleBack}
                            onNext={handleNext}
                            onSelectedGiftsChange={handleSelectedGiftsChange}
                            selectedGiftsFather={selectedGifts || []} // Pasar la función como prop
                        />
                    )}
                    {currentStep === "list-details" && (
                        <ListDetails
                            eventType={eventTypeDTO.type || eventTypeDTO.customType || ""}
                            onSubmit={handleListDetailsSubmitted}
                            onBack={handleBack}
                            onNext={handleNext}
                        />
                    )}
                    {currentStep === "list-confirmation" && (
                        <ListConfirmation
                            onSubmit={handleListConfirmation}
                            onBack={handleBack}
                            initialEmail={userEmail}
                            initialPhone={userPhone}
                            initialMinContribution={minContribution}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-center">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Salir y Guardar Borrador
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que quieres salir?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tu progreso se guardará como borrador. Puedes continuar más tarde desde donde lo dejaste.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleExit}>Salir y Guardar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

