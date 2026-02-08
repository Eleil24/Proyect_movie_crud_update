import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URI_CATEGORIAS;

const getAllCategorias = async () => {
    try {
        const response = await axios.get(BASE_URL);
        if (response.status !== 200) {
            throw new Error("Error al obtener las categorías");
        }
        return response.data;
    } catch (error) {
        console.error("Error en getAllCategorias:", error);
        throw error;
    }
}

export { getAllCategorias };
