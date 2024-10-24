"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListPage() {
    const router = useRouter();
    const [listName, setListName] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventType, setEventType] = useState("Matrimonio"); // Default value
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!listName) {
            setErrorMessage("El nombre de la lista es obligatorio.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${process.env.API_URL}/api/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: listName,
                    description,
                    eventDate,
                    eventType,
                }),
            });

            if (response.ok) {
                router.push("/dashboard/view-lists"); // Redirige a las listas creadas
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Error al crear la lista.");
            }
        } catch (error) {
            setErrorMessage("Error al conectar con el servidor. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Crear Nueva Lista</h2>
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.field}>
                    <label htmlFor="listName" style={styles.label}>
                        Nombre de la Lista:
                    </label>
                    <input
                        id="listName"
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.field}>
                    <label htmlFor="description" style={styles.label}>
                        Descripción (opcional):
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={styles.textarea}
                    />
                </div>
                <div style={styles.field}>
                    <label htmlFor="eventDate" style={styles.label}>
                        Fecha del Evento:
                    </label>
                    <input
                        id="eventDate"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.field}>
                    <label htmlFor="eventType" style={styles.label}>
                        Tipo de Evento:
                    </label>
                    <select
                        id="eventType"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        style={styles.select}
                    >
                        <option value="Matrimonio">Matrimonio</option>
                        <option value="Cumpleaños">Cumpleaños</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Crear Lista"}
                </button>
            </form>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: "900px", // Aumentamos el ancho del contenedor
        minWidth: "700px",
        margin: "2rem auto",
        padding: "1.5rem",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        textAlign: "center",
    },
    title: {
        fontSize: "1.8rem",
        fontWeight: 700,
        marginBottom: "1rem",
    },
    error: {
        color: "red",
        marginBottom: "1rem",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem", // Espaciado uniforme entre campos
    },
    field: {
        textAlign: "left" ,
    },
    label: {
        display: "block",
        marginBottom: "0.5rem",
        fontSize: "1rem",
        fontWeight: 500,
    },
    input: {
        width: "90%",
        padding: "0.75rem 1rem", // Ajuste del padding
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1rem",
    },
    textarea: {
        width: "90%",
        padding: "0.75rem 1rem", // Ajuste del padding para consistencia
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1rem",
        minHeight: "80px",
    },
    select: {
        width: "90%",
        padding: "0.75rem 1rem", // Ajuste del padding para consistencia
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1rem",
    },
    button: {
        padding: "0.75rem 1rem", // Consistencia con los campos
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: "pointer",
        textAlign: "center" as "center",
    },
};


