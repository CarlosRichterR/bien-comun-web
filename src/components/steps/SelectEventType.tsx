'use client';

import { useEffect, useState } from "react";
import theme from "@/styles/theme"; // Importamos el tema
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
        <div
            style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: theme.spacing(3),
                backgroundColor: theme.colors.cardBackground,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            <h1
                style={{
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: "1.5rem",
                    fontWeight: theme.typography.fontWeightBold,
                    marginBottom: theme.spacing(2),
                }}
            >
                Selecciona el Tipo de Evento
            </h1>

            <label
                htmlFor="eventType"
                style={{
                    display: "block",
                    textAlign: "left",
                    marginBottom: theme.spacing(1),
                    fontFamily: theme.typography.fontFamily,
                    color: theme.colors.textPrimary,
                    fontSize: "1rem",
                }}
            >
                Tipo de Evento:
            </label>

            <select
                id="eventType"
                value={eventType}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: theme.spacing(1),
                    fontSize: "1rem",
                    border: `1px solid ${theme.colors.textSecondary}`,
                    borderRadius: "4px",
                    marginBottom: theme.spacing(2),
                    fontFamily: theme.typography.fontFamily,
                }}
            >
                <option value="">Selecciona un tipo</option>
                <option value="wedding">Matrimonio</option>
                <option value="birthday">Cumpleaños</option>
                <option value="baby-shower">Baby Shower</option>
            </select>
        </div>
    );
};