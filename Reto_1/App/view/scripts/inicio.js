const EQU_INICIO_URL = "../../api/EquipamientoController.php";

const contadorEquipamientos = document.getElementById("contador-equipamientos");
const desgloseCategorias = document.getElementById("desglose-categorias");

const nombresCategorias = {
    PORTATIL: "Portátiles",
    SOBREMESA: "Sobremesa",
    PERIFERICO: "Periféricos",
    AUDIOVISUAL: "Audiovisual",
    OTROS: "Otros"
};

document.addEventListener("DOMContentLoaded", () => {
    cargarContadorInicio();
});

async function cargarContadorInicio() {
    if (contadorEquipamientos) {
        contadorEquipamientos.textContent = "Consultando equipamientos del centro..."

        try {
            const response = await fetch(EQU_INICIO_URL, {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
                headers: { Accept: "application/json" }
            });

            const result = await response.json();

            if (response.ok && result && result.success && Array.isArray(result.data)) {
                const equipos = result.data;
                // Mismo formato de resumen que en Equipamientos.html
                if (equipos.length === 0) {
                    contadorEquipamientos.textContent = "No hay equipamientos registrados.";
                } else {
                    contadorEquipamientos.textContent = `Todos los equipamientos del centro registrados: ${equipos.length}.`;
                }
            }
        } catch (error) {
            console.error("Error al cargar el contador en inicio:", error);
            contadorEquipamientos.textContent = "Error de conexión al consultar los equipamientos.";
        }
    }
}