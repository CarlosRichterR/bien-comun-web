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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Save, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EventTypeDTO } from "@/types/models/EventTypeDTO"
import { EventType } from "@/types/enums/EventType"
import { ListDetailsData } from '@/types/models/ListDetails'
import { ConfirmationData } from '@/types/models/ConfirmationData'
import { getEventTypeLabel } from '@/lib/getEventTypeLabel'

type Step = "event-selection" | "guest-info" | "gift-selection" | "list-details" | "list-confirmation"
type ListStatus = "draft" | "publish"

interface GiftListCreationProcessProps {
    onComplete: (listData: any) => void;
    onExit: () => void;
    onBack: () => void;
    initialData?: {
        eventTypeDTO: EventTypeDTO;
        guestCount: number;
        minContribution: number;
        selectedGifts: CatalogItem[];
        listDetails: ListDetailsData;
        confirmationData: ConfirmationData;
        listStatus: ListStatus;
        listId?: string | number; // <-- Add listId for editing
    };
}

export function GiftListCreationProcess({ onComplete, onExit, onBack, initialData }: GiftListCreationProcessProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<Step>("event-selection")
    const [eventTypeDTO, setEventTypeDTO] = useState<EventTypeDTO>(() => initialData?.eventTypeDTO || { type: EventType.Wedding, customType: undefined })
    const [guestCount, setGuestCount] = useState<number>(() => initialData?.guestCount ?? 0)
    const [minContribution, setMinContribution] = useState<number>(() => initialData?.minContribution ?? 200)
    const [selectedGifts, setSelectedGifts] = useState<CatalogItem[]>(() => initialData?.selectedGifts || [])
    const [listDetails, setListDetails] = useState<ListDetailsData>(() => initialData?.listDetails || {
        eventDate: null,
        campaignStartDate: null,
        campaignEndDate: null,
        campaignEndTime: "",
        location: [-17.3936, -66.157],
        address: "",
    })
    const [isAddressModified, setIsAddressModified] = useState(false);
    const [confirmationData, setConfirmationData] = useState<ConfirmationData>(() => initialData?.confirmationData || {
        email: "",
        phone: "",
        useMinContribution: true,
        termsAccepted: false,
    })
    const [listStatus, setListStatus] = useState<ListStatus>(() => initialData?.listStatus || "draft")
    const [showExitDialog, setShowExitDialog] = useState(false);

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
            listDetails,
            products: selectedGifts.map((gift) => ({
                productId: gift.id,
                quantity: gift.quantity || 1, // Default to 1 if quantity is not defined
            })),
            confirmationData,
        };

        try {
            let response;
            if (initialData?.listId) {
                // Editing existing list (save as draft)
                response = await fetch(`${process.env.API_URL}/api/List/${initialData.listId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(draftData),
                });
            } else {
                // Creating new draft
                response = await fetch(`${process.env.API_URL}/api/List`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(draftData),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save draft');
            }
            onExit();
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }

    const handleEventTypeSelected = (type: EventType, custom?: string) => {
        setEventTypeDTO({ type, customType: custom });
    }
    
    const handleListDetailsChange = (updatedDetails: ListDetailsData) => {
        setListDetails(updatedDetails);
        console.log("List details updated:", updatedDetails);
    };

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

    const handleListConfirmation = (data: ConfirmationData) => {
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

    const handleConfirmationChange = (updatedData: ConfirmationData) => {
        setConfirmationData(updatedData);
    };

    const handlePublish = async (confirmationData: ConfirmationData) => {
        const publishData = {
            eventTypeDTO: {
                eventType: eventTypeDTO.type as number,
                customEventType: eventTypeDTO.customType,
            },
            guestCount,
            minContribution,
            listStatus: 'publish' as ListStatus,
            listDetails,
            products: selectedGifts.map((gift) => ({
                productId: gift.id,
                quantity: gift.quantity || 1,
            })),
            confirmationData: {
                ...confirmationData
            }
        };

        try {
            let response;
            if (initialData?.listId) {
                // Editing existing list
                response = await fetch(`${process.env.API_URL}/api/List/${initialData.listId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(publishData),
                });
            } else {
                // Creating new list
                response = await fetch(`${process.env.API_URL}/api/List`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(publishData),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to publish list');
            }
            onExit(); // Navegar al dashboard
        } catch (error) {
            console.error('Error publishing list:', error);
        }
    };

    const loadDraft = () => {
        setEventTypeDTO({
            type: EventType.Wedding,
            customType: undefined,
        });
    }

    useEffect(() => {
        if (!initialData) {
            loadDraft()
        }
    }, [initialData])

    useEffect(() => {
        setListDetails(prev => ({
            ...prev,
            listName: `Mi lista de ${getEventTypeLabel(eventTypeDTO.type) === "Otro" ? eventTypeDTO.customType : getEventTypeLabel(eventTypeDTO.type)}`
        }));
    }, [eventTypeDTO.type, eventTypeDTO.customType]);

    // Genera mensajes de advertencia para los campos faltantes
    const getMissingFields = () => {
        const messages: string[] = [];
        // if (eventTypeDTO.type !== undefined && eventTypeDTO.type !== null) messages.push('Selecciona el tipo de evento.');
        // if (eventTypeDTO.type === EventType.Other && !eventTypeDTO.customType) messages.push('Especifica el nombre del evento personalizado.');
        if (guestCount <= 0) messages.push('Agrega el número de invitados.');
        if (selectedGifts.length === 0) messages.push('Selecciona al menos un regalo.');
        if (!listDetails.listName) messages.push('El nombre de la lista es obligatorio.');
        if (!listDetails.eventDate || new Date(listDetails.eventDate) <= new Date()) messages.push('Selecciona una fecha de evento válida.');
        // Removidas las validaciones de fecha y hora de inicio de campaña
        if (!listDetails.campaignEndDate) messages.push('Selecciona la fecha de fin de la campaña.');
        if (!listDetails.campaignEndTime) messages.push('Selecciona la hora de fin de la campaña.');
        if (!Array.isArray(listDetails.location) || listDetails.location.length !== 2) messages.push('Selecciona una ubicación en el mapa.');
        if (!listDetails.address) messages.push('La dirección es obligatoria.');
        if (!confirmationData.email) messages.push('El correo electrónico es obligatorio.');
        if (!confirmationData.phone) messages.push('El número de teléfono es obligatorio.');
        if (!confirmationData.termsAccepted) messages.push('Debes aceptar los términos y condiciones.');
        return messages;
    };

    // Validación global para habilitar publicación
    const isPublishable = (
        eventTypeDTO.type !== undefined && eventTypeDTO.type !== null &&
        (eventTypeDTO.type !== EventType.Other || (eventTypeDTO.type === EventType.Other && !!eventTypeDTO.customType)) &&
        guestCount > 0 &&
        selectedGifts.length > 0 &&
        !!listDetails.listName &&
        !!listDetails.eventDate && new Date(listDetails.eventDate) > new Date() &&
        // Eliminadas validaciones de campaignStartDate y campaignStartTime
        !!listDetails.campaignEndDate &&
        !!listDetails.campaignEndTime &&
        Array.isArray(listDetails.location) && listDetails.location.length === 2 &&
        !!listDetails.address &&
        !!confirmationData.email &&
        !!confirmationData.phone &&
        confirmationData.termsAccepted
    );

    return (
        <div className="w-full max-w-4xl mx-auto relative pt-10">
            {/* Exit confirmation dialog */}
            <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
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
            <div className="mb-8 flex items-start justify-between">
                {/* Stepper (barra de progreso y pasos) */}
                <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2 mb-4">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        {steps.map((step, index) => (
                            <button
                                key={step}
                                type="button"
                                className={`flex flex-col items-center focus:outline-none ${index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'}`}
                                onClick={() => setCurrentStep(step)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                aria-current={currentStep === step ? 'step' : undefined}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    {index + 1}
                                </div>
                                <span className="text-xs mt-1">{stepLabels[step]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Botón X alineado a la derecha, más separado y más arriba */}
                <Button
                    type="button"
                    variant="ghost"
                    className="ml-10 mt-[-20px] w-10 h-10 p-0 flex items-center justify-center transition-all duration-200 hover:bg-muted rounded-full"
                    onClick={() => setShowExitDialog(true)}
                    aria-label="Salir y guardar borrador"
                >
                    <X className="w-6 h-6" />
                </Button>
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
                            initialDetails={listDetails}
                            onSubmit={handleListDetailsSubmitted}
                            onBack={handleBack}
                            onNext={handleNext}
                            onChange={handleListDetailsChange}
                            isAddressModified={isAddressModified} // Pasar la bandera
                            setIsAddressModified={setIsAddressModified}
                        />
                    )}
                    {currentStep === "list-confirmation" && (
                        <ListConfirmation
                            onSubmit={handlePublish}
                            onBack={handleBack}
                            initialData={confirmationData}
                            minContribution={minContribution}
                            onMinContributionChange={handleMinContributionUpdate}
                            onChange={handleConfirmationChange}
                            isPublishable={isPublishable}
                            missingFields={getMissingFields()}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-center">
                <Button
                    variant="outline"
                    className="shadow-md hover:shadow-lg transition-shadow duration-300"
                    onClick={() => setShowExitDialog(true)}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Salir y Guardar Borrador
                </Button>
            </div>
        </div>
    )
}

