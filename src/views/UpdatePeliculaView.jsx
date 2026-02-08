import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { readPeliculaByName, updatePelicula } from "../services/peliculaService";
import Input from "../components/Input";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UpdatePeliculaView = () => {

  const [pelicula, setPelicula] = useState({
    "nombre": "",
    "anioEstreno": 0,
    "synopsis": "",
    "categorias": ""
  });

  const { nombre } = useParams();

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
      // Convertir categorias a array antes de enviar
      const peliculaToSend = {
        nombre: pelicula.nombre,
        anioEstreno: pelicula.anioEstreno,
        synopsis: pelicula.synopsis,
        categorias: pelicula.categorias
          .split(',')
          .map(cat => cat.trim())
          .filter(cat => cat !== "")
      };

      console.log("Enviando actualización:", peliculaToSend);

      // Enviar el ID de la película y los datos nuevos
      // Asumimos que el ID viene en el objeto 'pelicula' cargado desde la API
      const idToUpdate = pelicula.id || pelicula.idPelicula || nombre;
      const result = await updatePelicula(idToUpdate, peliculaToSend);
      console.log("Resultado:", result);

      await Swal.fire({
        title: "Película Actualizada",
        text: `${pelicula.nombre} se editó exitosamente`,
        icon: "success"
      });
      navigate('/');
    } catch (error) {
      console.log("Error:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la película",
        icon: "error"
      });
    }
  }


  useEffect(() => {
    if (nombre) {
      const getPelicula = async () => {
        try {
          const nombreDecodificado = decodeURIComponent(nombre);
          const peliculaData = await readPeliculaByName(nombreDecodificado);
          console.log("Película obtenida:", peliculaData);

          const peliculaConCategoriasString = {
            ...peliculaData,
            categorias: Array.isArray(peliculaData.categorias)
              ? peliculaData.categorias.join(', ')
              : peliculaData.categorias
          };

          setPelicula(peliculaConCategoriasString);
        } catch (error) {
          console.log("Error al obtener película:", error);
        }
      }
      getPelicula();
    }
  }, [nombre]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold pb-3">
        Actualizar Pelicula
      </h1>
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

export default UpdatePeliculaView