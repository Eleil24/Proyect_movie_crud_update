import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readPelicula, deletePelicula, getAllRatings, deleteRatingAdmin } from "../services/peliculaService";
import { getAllCategorias } from "../services/categoriaService";
import TableData from "../components/TableData";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";

const HomeView = ({ userAuth, initialViewMode = 'movies' }) => {

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

    const [viewMode, setViewMode] = useState(initialViewMode); // 'movies' or 'ratings'
    const [ratings, setRatings] = useState([]);
    const [loadingRatings, setLoadingRatings] = useState(false);

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

    useEffect(() => {
        if (initialViewMode) {
            handleViewChange(initialViewMode);
        }
    }, [initialViewMode]);

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

    const handleViewChange = async (mode) => {
        setViewMode(mode);
        if (mode === 'ratings' && ratings.length === 0) {
            try {
                setLoadingRatings(true);
                const data = await getAllRatings();
                // console.log("Ratings Data Fetched:", data);
                setRatings(data);
            } catch (error) {
                console.error("Error fetching ratings:", error);
            } finally {
                setLoadingRatings(false);
            }
        }
    };

    const handleDeleteRating = async (rating) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Eliminar calificación de "${rating.nombrePelicula}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const idPelicula = rating.idPeli || rating.idPelicula;
                const correo = rating.correoUsuario;

                const responseData = await deleteRatingAdmin(idPelicula, correo);
                // console.log("Delete Response Data:", responseData);

                setRatings(prevRatings => prevRatings.filter(r => r.idCalificacion !== rating.idCalificacion));
                await Swal.fire(
                    '¡Eliminado!',
                    'La calificación ha sido eliminada.',
                    'success'
                );
            } catch (error) {
                console.error("Error deleting rating:", error);
                await Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar la calificación.',
                    'error'
                );
            }
        }
    };

    const [ratingFilters, setRatingFilters] = useState({
        usuario: "",
        pelicula: "",
        rating: ""
    });

    const handleRatingFilterChange = (e) => {
        const { name, value } = e.target;
        setRatingFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredRatings = ratings.filter(rating => {
        const matchUser = rating.correoUsuario.toLowerCase().includes(ratingFilters.usuario.toLowerCase());
        const matchMovie = rating.nombrePelicula.toLowerCase().includes(ratingFilters.pelicula.toLowerCase());
        const matchRating = ratingFilters.rating === "" || rating.rating.toString() === ratingFilters.rating;
        return matchUser && matchMovie && matchRating;
    });

    return (

        <div className="min-h-screen bg-gray-50">
            <div className="w-full mx-auto p-4">
                <div className={`bg-white rounded-lg shadow-2x1 p-6 mb-6 ${viewMode === 'ratings' ? 'max-w-5xl mx-auto' : ''}`}>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        {viewMode === 'movies' ? 'Lista de Películas' : 'Lista de Calificaciones'}
                    </h1>

                    {viewMode === 'movies' ? (
                        <>
                            {/* Filtros Películas */}
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
                        </>
                    ) : (
                        <>
                            {/* Filtros Calificaciones */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Pelicula</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pelicula"
                                        placeholder="Filtrar por película..."
                                        className="input input-bordered input-sm w-full"
                                        value={ratingFilters.pelicula}
                                        onChange={handleRatingFilterChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Usuario</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="usuario"
                                        placeholder="Filtrar por usuario..."
                                        className="input input-bordered input-sm w-full"
                                        value={ratingFilters.usuario}
                                        onChange={handleRatingFilterChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Calificación</span>
                                    </label>
                                    <select
                                        name="rating"
                                        className="select select-bordered select-sm w-full"
                                        value={ratingFilters.rating}
                                        onChange={handleRatingFilterChange}
                                    >
                                        <option value="">Todas</option>
                                        <option value="5">5 Estrellas</option>
                                        <option value="4">4 Estrellas</option>
                                        <option value="3">3 Estrellas</option>
                                        <option value="2">2 Estrellas</option>
                                        <option value="1">1 Estrella</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className={`bg-white rounded-lg shadow-md ${viewMode === 'ratings' ? 'max-w-5xl mx-auto' : ''}`}>
                    {viewMode === 'movies' ? (
                        <>
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
                        </>
                    ) : (
                        <div className="p-4">
                            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pelicula</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Calificación</th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Gestión</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRatings.map((rating) => (
                                            <tr key={rating.idCalificacion} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{rating.idCalificacion}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rating.nombrePelicula}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rating.correoUsuario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <span className="text-yellow-400 mr-1 text-lg">★</span>
                                                        <span className="font-bold">{rating.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                                    <button
                                                        onClick={() => handleDeleteRating(rating)}
                                                        className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                                                        title="Eliminar calificación"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredRatings.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No se encontraron calificaciones con estos filtros</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default HomeView;