import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginView from "./views/LoginView";
import HomeView from "./views/HomeView";
import CreatePeliculaView from "./views/CreatePeliculaView";
import Navbar from "./components/Navbar";
import UpdatePeliculaView from "./views/UpdatePeliculaView";
import './services/axiosConfig';

import { Toaster } from "react-hot-toast";

function App() {
  const [userAuth, setUserAuth] = useState(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('userAuth');
    if (savedAuth) {
      setUserAuth(JSON.parse(savedAuth));
    }
  }, []);

  if (!userAuth) {
    <Toaster position="top-right" /> 
    return <LoginView onLoginSuccess={setUserAuth} />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" /> 
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView userAuth={userAuth} />} />
        <Route path="/crearPelicula" element={<CreatePeliculaView />} />
        <Route path="/updatePelicula/:nombre" element={<UpdatePeliculaView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


