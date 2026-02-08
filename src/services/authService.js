import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI_USUARIO;
export async function loginUser(correo, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo,
      password
    });

    return response.data;

  } catch (error) {
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
}
