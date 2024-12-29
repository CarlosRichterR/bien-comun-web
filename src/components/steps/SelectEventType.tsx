'use client';

import { useEffect, useState } from "react";

interface SelectEventTypeProps {
    onSelect: (isSelected: boolean) => void;
}

export const SelectEventType: React.FC<SelectEventTypeProps> = ({ onSelect }) => {
    const [eventType, setEventType] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEventType(e.target.value);
    };

    useEffect(() => {
        onSelect(eventType !== '');
    }, [eventType, onSelect]);

    return (
        <div>
            <label htmlFor="eventType">Tipo de Evento:</label>
            <select
                id="eventType"
                name="eventType"
                value={eventType}
                onChange={handleChange}
                style={{ marginLeft: '10px' }}
            >
                <option value="" disabled>
                    -- Selecciona una opción --
                </option>
                <option value="matrimonio">Matrimonio</option>
                <option value="baby_shower">Baby Shower</option>
                <option value="cumpleaños">Cumpleaños</option>
                <option value="otro">Otro</option>
            </select>
        </div>
    );
};