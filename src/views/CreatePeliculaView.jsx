import React from 'react'
import { useState } from 'react';
import Input from '../components/Input';
import { createPelicula } from '../services/peliculaService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreatePeliculaView = () => {

    const [pelicula, setPelicula] = useState({
        "nombre": "",
        "anioEstreno": 0,
        "synopsis": "",
        "categorias": ""
    });

    const navigate = useNavigate();

    const inputsInfo = [
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "anioEstreno", label: "Año de Estreno", type: "number" },
        { name: "synopsis", label: "Synopsis", type: "text" },
        { name: "categorias", label: "Categorias", type: "text", isArray: true }
    ];


    const handleInput = (ev) => {
        const value = ev.target.value;
        const name = ev.target.name;
        setPelicula({ ...pelicula, [name]: value });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {

            const peliculaToSend = {
                ...pelicula,
                categorias: pelicula.categorias
                    .split(',')
                    .map(cat => cat.trim())
                    .filter(cat => cat !== "")
            };

            console.log("Datos a enviar:", peliculaToSend);
            await createPelicula(peliculaToSend);
            console.log("Se creó exitosamente!");

            await Swal.fire({
                icon: "success",
                title: "Pelicula creado!",
                text: `${pelicula.nombre} se creó exitosamente`,
                theme: "dark"
            });
        
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-semibold pb-3">Crear Pelicula</h1>
            <form onSubmit={handleSubmit}>
                {inputsInfo.map((item, index) => (
                    <Input
                        key={index}
                        name={item.name}
                        label={item.label}
                        type={item.type}
                        handleInput={handleInput}
                        value={pelicula}
                    />
                ))}
                <button className="btn btn-primary" type="submit">
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default CreatePeliculaView