import { useState, useEffect } from "react";
import { findAllRate } from "../services/peliculaService";


const UserHomeView = () => {

    const [peliculas, setPelicula] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPeliculas = async () => {
            try {
                setLoading(true);
                const data = await findAllRate();

                let peliculasList = [];

                if (data.content) {
                    peliculasList = data.content;
                } else if (Array.isArray(data)) {
                    peliculasList = data;
                }

                const dataFormateada = peliculasList.map(p => ({
                    ...p,
                    categorias: Array.isArray(p.categorias)
                        ? p.categorias.join(", ")
                        : p.categorias || ""
                }));

                setPelicula(dataFormateada);
            } catch (error) {
                console.error("Error fetching peliculas:", error);
            } finally {
                setLoading(false);
            }
        };

        getPeliculas();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-4 lg:px-5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        🎬 Películas Mejor Calificadas
                    </h1>
                    <p className="text-lg text-gray-500">Explora nuestra selección de películas favoritas</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {peliculas.map((item) => (
                            <div key={item.id || item.nombre} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                                <div className="relative pt-[140%] bg-gray-200">
                                    {item.imagenUrl ? (
                                        <img
                                            src={item.imagenUrl}
                                            alt={item.nombre}
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-lg">Sin imagen</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {item.anioEstreno}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1" title={item.nombre}>
                                            {item.nombre}
                                        </h3>
                                        <p className="text-sm text-indigo-600 font-medium mt-1 mb-2 line-clamp-1">
                                            {item.categorias}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                                        {item.synopsis}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserHomeView;
