import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginView from "./views/LoginView";
import HomeView from "./views/HomeView";
import UserHomeView from "./views/UserHomeView";
import CreatePeliculaView from "./views/CreatePeliculaView";
import Navbar from "./components/Navbar";
import UpdatePeliculaView from "./views/UpdatePeliculaView";
import UsersListView from "./views/UsersListView";
import './services/axiosConfig';
import { parseJwt } from "./utils/jwtUtils";

import { Toaster } from "react-hot-toast";

function App() {
  const [userAuth, setUserAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('userAuth');
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      setUserAuth(auth);

      if (auth.token) {
        let role = null;
        if (typeof auth.token === 'string') {
          const decoded = parseJwt(auth.token);
          role = decoded?.role || decoded?.roles || decoded?.authorities;
        } else if (typeof auth.token === 'object') {
          role = auth.token.role || auth.token.roles || auth.token.authorities;
        }

        if (Array.isArray(role)) {
          role = role[0]?.authority || role[0];
        }
        setUserRole(role);
      }
    }
  }, []);

  const handleLoginSuccess = (auth) => {
    setUserAuth(auth);
    if (auth.token) {
      let role = null;
      if (typeof auth.token === 'string') {
        const decoded = parseJwt(auth.token);
        role = decoded?.role || decoded?.roles || decoded?.authorities;
      } else if (typeof auth.token === 'object') {
        role = auth.token.role || auth.token.roles || auth.token.authorities;
      }

      if (Array.isArray(role)) {
        role = role[0]?.authority || role[0];
      }
      setUserRole(role);
    }
  };

  if (!userAuth) {
    return (
      <>
        <Toaster position="top-right" />
        <LoginView onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  const isAdmin = userRole === 'ADMIN' || (typeof userRole === 'string' && userRole.toUpperCase().includes('ADMIN'));

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={isAdmin ? <HomeView userAuth={userAuth} initialViewMode="movies" /> : <UserHomeView />} />
        <Route path="/calificaciones" element={isAdmin ? <HomeView userAuth={userAuth} initialViewMode="ratings" /> : <Navigate to="/" replace />} />

        {isAdmin && (
          <>
            <Route path="/crearPelicula" element={<CreatePeliculaView />} />
            <Route path="/updatePelicula/:id" element={<UpdatePeliculaView />} />
            <Route path="/usuarios" element={<UsersListView />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


