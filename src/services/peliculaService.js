import axios from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_API_URI;

const readPelicula = async ({ page = 1, size = 10, nombre = "", anioEstreno = "", categoria = "" } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('size', size);
  params.append('direccion', 'ASC');

  if (nombre) params.append('nombre', nombre);
  if (anioEstreno) params.append('anioEstreno', anioEstreno);
  if (categoria) params.append('categoria', categoria);

  const response = await axios.get(`${BASE_URL}/find?${params.toString()}`);
  if (response.status !== 200) {
    throw new Error("Error al obtener las peliculas");
  }
  return response.data;
}

const readPeliculaByName = async (name) => {
  const response = await axios.get(`${BASE_URL}/find?nombre=${encodeURIComponent(name)}`);
  if (response.status !== 200) {
    throw new Error("Error al obtener los datos")
  }
  return Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
}

const readPeliculaById = async (id) => {
  const response = await axios.get(`${BASE_URL}/detail/${id}`);
  if (response.status !== 200) {
    throw new Error("Error al obtener los datos de la película");
  }
  return response.data;
}

const updatePelicula = async (id, peliculaEditada) => {
  const response = await axios.put(
    `${BASE_URL}/update/${id}`,
    peliculaEditada
  );
  if (response.status !== 200) {
    throw new Error("Error al actualizar los datos")
  }
  return response.data;
}

const createPelicula = async (newPelicula) => {
  const response = await axios.post(`${BASE_URL}/save`, newPelicula);
  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Error al crear la pelicula")
  }
  return response.data;
}

const deletePelicula = async (id) => {
  const response = await axios.delete(`${BASE_URL}/delete/${id}`);
  if (response.status !== 200) {
    throw new Error("Error al eliminar la película");
  }
  return response.data;
}

const findAllRate = async () => {
  const response = await axios.get(`${BASE_URL}/findAllRate`);
  if (response.status !== 200) {
    throw new Error("Error al obtener las peliculas mejor calificadas");
  }
  return response.data;
}

const RATE_URL = BASE_URL.replace("/pelicula", "/rate");

const saveRate = async ({ idPelicula, rate }) => {
  const response = await axios.post(`${RATE_URL}/save`, { idPelicula, rate });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Error al guardar la calificación");
  }
  return response.data;
}

const deleteRate = async (idPelicula) => {
  const response = await axios.delete(`${RATE_URL}/delete/${idPelicula}`);
  if (response.status !== 200) {
    throw new Error("Error al eliminar la calificación");
  }
  return response.data;
}

export { readPelicula, createPelicula, readPeliculaByName, readPeliculaById, updatePelicula, deletePelicula, findAllRate, saveRate, deleteRate };