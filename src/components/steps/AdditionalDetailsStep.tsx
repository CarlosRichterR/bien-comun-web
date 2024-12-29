export const AdditionalDetailsStep = () => {
    return (
        <div>
            <label htmlFor="title">Título de la Lista:</label>
            <input id="title" type="text" placeholder="Ejemplo: Lista de regalos de Ana" />
            <br />
            <label htmlFor="description">Descripción:</label>
            <textarea id="description" placeholder="Escribe una breve descripción..."></textarea>
        </div>
    );
};
