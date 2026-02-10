import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import Swal from "sweetalert2";
import { parseJwt } from "../utils/jwtUtils";

const Navbar = () => {

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userAuth");
        window.location.href = "/";
      }
    });
  };

  const userAuth = JSON.parse(localStorage.getItem('userAuth') || '{}');
  const token = userAuth.token;
  let role = null;

  if (token) {
    if (typeof token === 'string') {
      const decoded = parseJwt(token);
      if (decoded) {
        role = decoded.role || decoded.roles || decoded.authorities;
      }
    } else if (typeof token === 'object') {
      role = token.role || token.roles || token.authorities;
    }

    if (Array.isArray(role)) {
      role = role[0]?.authority || role[0];
    }
  }

  const isAdmin = role === 'ADMIN' || (typeof role === 'string' && role.includes('ADMIN'));

  return (
    <div className="navbar bg-linear-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
      <div className="flex-1">
        <div className="flex items-center px-4">
          <Film className="mr-2" size={28} />
          <span className="text-xl font-bold">PelisMax</span>
        </div>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          {isAdmin && (
            <>
              <li>
                <Link
                  to="/"
                  className="btn btn-ghost hover:bg-purple-800 font-medium"
                >
                  Lista de Películas
                </Link>
              </li>
              <li>
                <Link
                  to="/crearPelicula"
                  className="btn btn-ghost hover:bg-purple-800 font-medium"
                >
                  Crear Película
                </Link>
              </li>
              <li>
                <Link
                  to="/usuarios"
                  className="btn btn-ghost hover:bg-purple-800 font-medium"
                >
                  Usuarios
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              onClick={handleLogout}
              className="btn btn-ghost hover:bg-purple-800 font-medium"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

