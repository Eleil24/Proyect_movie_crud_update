import React, { useState } from 'react';
import Input from '../components/Input';
import { createUsuario } from '../services/usuarioService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateUserView = () => {

    const [usuario, setUsuario] = useState({
        "correo": "",
        "password": "",
        "role": ""
    });

    const navigate = useNavigate();

    const handleInput = (ev) => {
        const value = ev.target.value;
        const name = ev.target.name;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            console.log("Datos a enviar:", usuario);
            await createUsuario(usuario);
            console.log("Se creó exitosamente!");

            await Swal.fire({
                icon: "success",
                title: "Usuario creado!",
                text: `${usuario.correo} se creó exitosamente`,
                theme: "dark"
            });

            navigate('/')
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el usuario",
            });
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-semibold pb-3 text-center">Crear Usuario</h1>
            <form onSubmit={handleSubmit} className="space-y-6">

                <Input
                    name="correo"
                    label="Correo Electrónico"
                    type="email"
                    handleInput={handleInput}
                    value={usuario}
                />

                <Input
                    name="password"
                    label="Contraseña"
                    type="password"
                    handleInput={handleInput}
                    value={usuario}
                />

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold">Rol</span>
                    </label>
                    <input
                        type="text"
                        name="role"
                        placeholder="Ej: USER, ADMIN"
                        className="input input-bordered input-primary w-full"
                        value={usuario.role}
                        onChange={handleInput}
                    />
                </div>

                <div className="pt-4">
                    <button className="btn btn-primary w-full shadow-md hover:shadow-lg transition-all" type="submit">
                        Guardar Usuario
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateUserView;
