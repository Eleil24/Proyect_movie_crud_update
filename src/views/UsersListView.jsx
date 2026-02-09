import React, { useState, useEffect } from 'react';
import TableData from '../components/TableData';
import { findAllUsuarios, deleteUsuario } from '../services/usuarioService';
import Swal from 'sweetalert2';
import { Trash } from "lucide-react";
import CreateUserModal from '../components/CreateUserModal';

const UsersListView = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);



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

            <CreateUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchUsuarios}
            />
        </div>
    );
}

export default UsersListView;
