import { EventType } from "@/types/enums/EventType";

export interface EventTypeDTO {
    type: EventType;
    customType?: string;
}