import axios from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_API_URI_USUARIO;

const createUsuario = async (newUsuario) => {

    const response = await axios.post(`${BASE_URL}/save`, newUsuario);
    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Error al crear el usuario");
    }
    return response.data;
}

const findAllUsuarios = async () => {
    const response = await axios.get(`${BASE_URL}/findAll`);
    if (response.status !== 200) {
        throw new Error("Error al obtener los usuarios");
    }
    return response.data;
}

const deleteUsuario = async (id) => {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    if (response.status !== 200) {
        throw new Error("Error al eliminar el usuario");
    }
    return response.data;
}

export { createUsuario, findAllUsuarios, deleteUsuario };
