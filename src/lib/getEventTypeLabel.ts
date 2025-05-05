import { EventType } from "@/types/enums/EventType";

export const getEventTypeLabel = (eventType: EventType): string => {
    switch (eventType) {
        case 0:
            return "Boda";
        case 1:
            return "Cumpleaños";
        case 2:
            return "Baby Shower";
        case 3:
            return "Otro";
        default:
            return "Desconocido";
    }
};
