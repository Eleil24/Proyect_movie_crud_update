import React, { useState } from 'react';
import Input from './Input';
import { createUsuario } from '../services/usuarioService';
import Swal from 'sweetalert2';

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {

    const [newUser, setNewUser] = useState({
        "correo": "",
        "password": "",
        "role": ""
    });

    const handleInput = (ev) => {
        const value = ev.target.value;
        const name = ev.target.name;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            await createUsuario(newUser);

            await Swal.fire({
                icon: "success",
                title: "Usuario creado!",
                text: `${newUser.correo} se creó exitosamente`,
                theme: "dark"
            });

            setNewUser({ correo: "", password: "", role: "" });
            onSuccess();
            onClose();

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el usuario",
            });
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-2xl font-semibold mb-4 text-center">Crear Usuario</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="correo"
                        label="Correo Electrónico"
                        type="email"
                        handleInput={handleInput}
                        value={newUser}
                    />

                    <Input
                        name="password"
                        label="Contraseña"
                        type="password"
                        handleInput={handleInput}
                        value={newUser}
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
                            value={newUser.role}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="pt-4 flex gap-2">
                        <button
                            className="btn btn-primary flex-1 shadow-md"
                            type="submit"
                        >
                            Guardar
                        </button>
                        <button
                            className="btn btn-outline flex-1"
                            type="button"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
