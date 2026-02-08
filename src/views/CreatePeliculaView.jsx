import React, { useState, useEffect } from 'react'
import Input from '../components/Input';
import { createPelicula } from '../services/peliculaService';
import { getAllCategorias } from '../services/categoriaService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreatePeliculaView = () => {

    const [pelicula, setPelicula] = useState({
        "nombre": "",
        "anioEstreno": 0,
        "synopsis": "",
        "categorias": [], // Ahora es un array
        "imagenUrl": ""
    });

    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const navigate = useNavigate();

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

    const inputsInfo = [
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "anioEstreno", label: "Año de Estreno", type: "number" },
        { name: "synopsis", label: "Synopsis", type: "text" },
    ];

    const handleInput = (ev) => {
        const value = ev.target.value;
        const name = ev.target.name;
        setPelicula({ ...pelicula, [name]: value });
    };

    const handleCategoriaChange = (nombreCategoria) => {
        const currentCategorias = [...pelicula.categorias];
        if (currentCategorias.includes(nombreCategoria)) {
            // Si ya está, lo sacamos
            setPelicula({
                ...pelicula,
                categorias: currentCategorias.filter(c => c !== nombreCategoria)
            });
        } else {
            // Si no está, lo agregamos
            setPelicula({
                ...pelicula,
                categorias: [...currentCategorias, nombreCategoria]
            });
        }
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            console.log("Datos a enviar:", pelicula);
            await createPelicula(pelicula);
            console.log("Se creó exitosamente!");

            await Swal.fire({
                icon: "success",
                title: "Pelicula creada!",
                text: `${pelicula.nombre} se creó exitosamente`,
                theme: "dark"
            });

            navigate('/')
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear la película",
            });
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-semibold pb-3">Crear Pelicula</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos de Nombre y Año en dos columnas */}
                    <Input
                        name="nombre"
                        label="Nombre"
                        type="text"
                        handleInput={handleInput}
                        value={pelicula}
                    />
                    <Input
                        name="anioEstreno"
                        label="Año de Estreno"
                        type="number"
                        handleInput={handleInput}
                        value={pelicula}
                    />
                </div>

                <Input
                    name="imagenUrl"
                    label="URL de la Imagen"
                    type="text"
                    handleInput={handleInput}
                    value={pelicula}
                />

                {/* Synopsis en ancho completo */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold">Synopsis</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered textarea-primary w-full h-24 text-base"
                        placeholder="Escribe una breve descripción de la película..."
                        name="synopsis"
                        value={pelicula.synopsis}
                        onChange={handleInput}
                    ></textarea>
                </div>

                {/* Sección de Categorías con Tags */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold">Categorías</span>
                    </label>

                    <div className="flex gap-2 mb-2">
                        <select
                            className="select select-bordered select-primary w-full"
                            onChange={(e) => {
                                if (e.target.value) {
                                    handleCategoriaChange(e.target.value);
                                    e.target.value = ""; // Reset del select
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Selecciona una categoría...</option>
                            {categoriasDisponibles
                                .filter(cat => !pelicula.categorias.includes(cat.nombre))
                                .map((cat) => (
                                    <option key={cat.id} value={cat.nombre}>
                                        {cat.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[50px] p-3 border border-base-300 rounded-lg bg-base-50 items-center">
                        {pelicula.categorias.length === 0 ? (
                            <span className="text-gray-400 text-sm italic">No hay categorías seleccionadas</span>
                        ) : (
                            pelicula.categorias.map((cat, index) => (
                                <div key={index} className="badge badge-primary gap-2 py-3 px-4">
                                    {cat}
                                    <button
                                        type="button"
                                        onClick={() => handleCategoriaChange(cat)}
                                        className="btn btn-xs btn-circle btn-ghost text-white opacity-70 hover:opacity-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    {pelicula.categorias.length === 0 && (
                        <span className="text-error text-xs mt-1 ml-1">Selecciona al menos una categoría</span>
                    )}
                </div>

                <div className="pt-4">
                    <button className="btn btn-primary w-full shadow-md hover:shadow-lg transition-all" type="submit">
                        Guardar Película
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePeliculaView