import React, { useState, useEffect } from 'react';
import TableData from '../components/TableData';
import Input from '../components/Input';
import { findAllUsuarios, createUsuario, deleteUsuario } from '../services/usuarioService';
import Swal from 'sweetalert2';
import { Trash } from "lucide-react";

const UsersListView = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado del formulario (tomado de CreateUserView)
    const [newUser, setNewUser] = useState({
        "correo": "",
        "password": "",
        "role": ""
    });

    const headerData = [
        { name: "correo", label: "Correo" },
        { name: "role", label: "Rol" },
    ];

    const handleDelete = async (info) => {
        const confirm = await Swal.fire({
            title: `¿Eliminar usuario?`,
            text: `Se eliminará a ${info.correo}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const idToDelete = info.usuarioId || info.id;
                if (!idToDelete) {
                    throw new Error("ID de usuario no encontrado");
                }

                await deleteUsuario(idToDelete);

                await Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El usuario ha sido eliminado.',
                    icon: 'success'
                });

                fetchUsuarios();
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar el usuario',
                    icon: 'error'
                });
            }
        }
    };

    const actions = [
        {
            content: (info) => (
                <button
                    className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDelete(info)}
                    title="Eliminar Usuario"
                >
                    <Trash size={16} />
                </button>
            )
        }
    ];

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const data = await findAllUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar los usuarios",
            });
        } finally {
            setLoading(false);
        }
    };

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

            // Cerrar modal y recargar lista
            setIsModalOpen(false);
            setNewUser({ correo: "", password: "", role: "" }); // Reset form
            fetchUsuarios();

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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        👥 Gestión de Usuarios
                    </h1>
                    <button
                        className="btn btn-primary text-white font-bold shadow-md hover:shadow-lg transition-all"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Nuevo Usuario
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md">
                    {loading ? (
                        <div className="text-center p-10">Cargando usuarios...</div>
                    ) : (
                        <TableData
                            data={usuarios}
                            headers={headerData}
                            actions={actions}
                        />
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setIsModalOpen(false)}
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
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersListView;
