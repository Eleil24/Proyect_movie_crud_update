import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readPelicula, deletePelicula } from "../services/peliculaService";
import { getAllCategorias } from "../services/categoriaService";
import TableData from "../components/TableData";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";

const HomeView = ({ userAuth }) => {

    const [peliculas, setPelicula] = useState([]);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

    const [filters, setFilters] = useState({
        nombre: "",
        categoria: "",
        anioEstreno: ""
    });

    const [searchTrigger, setSearchTrigger] = useState(0);

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 1,
        totalElements: 0
    });

    const navigate = useNavigate();

    const headerData = [
        { name: "nombre", label: "Nombre pelicula" },
        { name: "synopsis", label: "Synopsis de la pelicula" },
        { name: "anioEstreno", label: "Año de estreno" },
        { name: "categorias", label: "Categoria" },
        {
            name: "imagenUrl",
            label: "Imagen",
            render: (item) => (
                item.imagenUrl ? (
                    <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        className="w-16 h-24 object-cover rounded-md shadow-sm hover:scale-150 transition-transform duration-200"
                    />
                ) : (
                    <div className="w-16 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs text-center p-1">
                        Sin imagen
                    </div>
                )
            )
        },
        { name: "createAt", label: "Fecha de Registro" },
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
                const idToDelete = info.id || info.nombre;
                await deletePelicula(idToDelete);

                await Swal.fire({
                    title: '¡Eliminada!',
                    text: `${info.nombre} fue eliminada exitosamente`,
                    icon: 'success',
                    timer: 2000
                });

                setSearchTrigger(prev => prev + 1);

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
                    onClick={() => { navigate(`/updatePelicula/${info.id || info.idPelicula}`) }}
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
        const fetchCategorias = async () => {
            try {
                const data = await getAllCategorias();
                setCategoriasDisponibles(data);
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        const getPeliculas = async () => {
            try {
                const params = {
                    page: pagination.page,
                    size: pagination.size,
                    nombre: filters.nombre,
                    anioEstreno: filters.anioEstreno,
                    categoria: filters.categoria
                };

                const data = await readPelicula(params);
                // console.log("Full API Response:", data);

                let peliculasList = [];
                let totalPages = 1;
                let totalElements = 0;
                let hasMore = false;

                if (data.content) {
                    peliculasList = data.content;
                    totalPages = data.totalPages;
                    totalElements = data.totalElements;
                } else if (Array.isArray(data)) {
                    peliculasList = data;
                    hasMore = data.length === pagination.size;
                    totalPages = hasMore ? pagination.page + 1 : pagination.page;
                    totalElements = -1;
                }

                const dataFormateada = peliculasList.map(p => ({
                    ...p,
                    categorias: Array.isArray(p.categorias)
                        ? p.categorias.join(", ")
                        : p.categorias || ""
                }));

                setPelicula(dataFormateada);
                setPagination(prev => ({
                    ...prev,
                    totalPages,
                    totalElements,
                    hasMore: hasMore
                }));

            } catch (error) {
                console.error("Error fetching peliculas:", error);
            }
        };

        getPeliculas();
    }, [pagination.page, searchTrigger]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        setSearchTrigger(prev => prev + 1);
    };

    const handlePageChange = (newPage) => {
        console.log(`Requested Page Change: ${pagination.page} -> ${newPage}`);
        if (newPage >= 1) {
            if (pagination.totalElements !== -1 && newPage > pagination.totalPages) return;
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleClearFilters = () => {
        setFilters({
            nombre: "",
            categoria: "",
            anioEstreno: ""
        });
        setPagination(prev => ({ ...prev, page: 1 }));
        setSearchTrigger(prev => prev + 1);
    };

    return (

        <div className="min-h-screen bg-gray-50">
            <div className="w-full mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        🎬 Lista de Películas
                    </h1>

                    {/* Filtros */}
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Nombre</span>
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Buscar por nombre..."
                                className="input input-bordered input-sm w-full"
                                value={filters.nombre}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Año</span>
                            </label>
                            <input
                                type="number"
                                name="anioEstreno"
                                placeholder="Ej: 2024"
                                className="input input-bordered input-sm w-full"
                                value={filters.anioEstreno}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Categoría</span>
                            </label>
                            <select
                                name="categoria"
                                className="select select-bordered select-sm w-full"
                                value={filters.categoria}
                                onChange={handleFilterChange}
                            >
                                <option value="">Todas</option>
                                {categoriasDisponibles.map(cat => (
                                    <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control flex flex-row gap-2">
                            <button type="submit" className="btn btn-primary btn-sm flex-1 text-white font-bold">
                                🔍 Filtrar
                            </button>
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="btn btn-outline btn-secondary btn-sm flex-1 font-bold"
                            >
                                🧹 Limpiar
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md">
                    <TableData
                        data={peliculas}
                        headers={headerData}
                        actions={actions}
                    />

                    {/* Paginación */}
                    <div className="flex justify-center items-center p-4 bg-gray-50 border-t border-gray-100">
                        <div className="join">
                            <button
                                className="join-item btn btn-sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                            >
                                « Anterior
                            </button>
                            <button className="join-item btn btn-sm bg-base-200 pointer-events-none">
                                Página {pagination.page}
                            </button>
                            <button
                                className="join-item btn btn-sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.totalElements !== -1 ? pagination.page === pagination.totalPages : !pagination.hasMore}
                            >
                                Siguiente »
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default HomeView;