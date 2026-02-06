import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readPelicula, deletePelicula } from "../services/peliculaService";
import TableData from "../components/TableData";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";

const HomeView = ({ userAuth }) => {

    const [peliculas, setPelicula] = useState([]);

    const navigate = useNavigate();

    const headerData = [
        { name: "nombre", label: "Nombre pelicula" },
        { name: "synopsis", label: "Synopsis de la pelicula" },
        { name: "anioEstreno", label: "Año de estreno" },
        { name: "categorias", label: "Categoria" },
        { name: "createAt", label: "Fecha de Registrio" },
        { name: "usuarioPelicula", label: "Usuario" },
    ]

    const handleDelete = async (info) => {
        const confirm = await Swal.fire({
            title: `¿Deseas eliminar "${info.nombre}"?`,
            text: 'Esta acción es irreversible',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, eliminar",
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (confirm.isConfirmed) {
            try {
                await deletePelicula(info.nombre);

                await Swal.fire({
                    title: '¡Eliminada!',
                    text: `${info.nombre} fue eliminada exitosamente`,
                    icon: 'success',
                    timer: 2000
                });

                const filteredPeliculas = peliculas.filter((peli) => {
                    return peli.nombre !== info.nombre;
                });
                setPelicula(filteredPeliculas);

            } catch (error) {
                console.log(error);
                await Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar la película',
                    icon: 'error'
                });
            }
        }
    };

    const actions = [
        {
            content: (info) => (
                <button
                    className="btn btn-sm bg-yellow-500 text-white"
                    onClick={() => { navigate(`/updatepelicula/${encodeURIComponent(info.nombre)}`) }}
                >
                    <Pencil />
                </button>
            )
        },
        {
            content: (info) => (
                <button
                    className="btn btn-sm bg-red-600 text-white"
                    onClick={() => { handleDelete(info) }}
                >
                    <Trash />
                </button>
            )
        }
    ]

    useEffect(() => {
        const getPeliculas = async () => {
            try {
                const data = await readPelicula();

                const dataFormateada = data.map(p => ({
                    ...p,
                    categorias: Array.isArray(p.categorias)
                        ? p.categorias.join(", ")
                        : p.categorias || ""
                }));

                setPelicula(dataFormateada);
            } catch (error) {
                console.error("Error fetching peliculas:", error);
            }
        };

        getPeliculas();
    }, []);

    return (

        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🎬 Lista de Películas
                    </h1>
                </div>

                <TableData
                    data={peliculas}
                    headers={headerData}
                    actions={actions}
                />
            </div>
        </div>
    )
}


export default HomeView;