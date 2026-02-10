import React, { useState, useEffect } from "react";
import { saveRate, deleteRate } from "../services/peliculaService";
import Swal from 'sweetalert2';

const MovieDetailModal = ({ isOpen, onClose, movie, onUpdateSuccess }) => {

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setRating(movie.calificacionUsuario || 0);
    }, [movie]);

    const handleRate = async () => {
        if (rating === 0) return;

        setIsSaving(true);
        try {
            await saveRate({ idPelicula: movie.id, rate: rating });

            setRating(rating);
            if (onUpdateSuccess) onUpdateSuccess(movie.id, rating);

            Swal.fire({
                icon: 'success',
                title: '¡Calificación guardada!',
                text: 'Tu calificación se ha registrado correctamente.',
                timer: 2000,
                showConfirmButton: false
            });

            onClose();
        } catch (error) {
            console.error("Error saving rating:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la calificación. Inténtalo de nuevo.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteRate = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres eliminar tu calificación para esta película?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        setIsSaving(true);
        try {
            await deleteRate(movie.id);
            setRating(0);
            if (onUpdateSuccess) onUpdateSuccess(movie.id, 0);

            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'Tu calificación ha sido eliminada.',
                timer: 2000,
                showConfirmButton: false
            });

            onClose();
        } catch (error) {
            console.error("Error deleting rating:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la calificación.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">

                {/* Image Section */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-900">
                    <img
                        src={movie.imagenUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
                        alt={movie.nombre}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-white hover:text-gray-300 md:hidden bg-black bg-opacity-50 rounded-full p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hidden md:block"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {movie.anioEstreno}
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {movie.categorias}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{movie.nombre}</h2>
                    </div>

                    <div className="flex-grow overflow-y-auto max-h-60 mb-6 pr-2 custom-scrollbar">
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {movie.synopsis}
                        </p>
                    </div>

                    {/* Rating Section */}
                    <div className="mt-auto border-t pt-6">
                        <h3 className="text-gray-900 font-semibold mb-3">Tu Calificación</h3>
                        <div className="flex items-center gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-10 w-10 ${star <= (hoverRating || rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                            }`}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={star <= (hoverRating || rating) ? 0 : 2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>
                            ))}
                            <span className="ml-3 text-2xl font-bold text-gray-700 w-8 text-center">
                                {hoverRating || rating || 0}
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleRate}
                                disabled={isSaving || rating === 0}
                                className={`flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors ${(isSaving || rating === 0) ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isSaving ? "Guardando..." : "Calificar"}
                            </button>

                            {/* Assuming if rating > 0 in initial logic we show delete, or we can just always show it and handle the logic inside */}
                            {rating > 0 && (
                                <button
                                    onClick={handleDeleteRate}
                                    disabled={isSaving}
                                    className="px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailModal;
