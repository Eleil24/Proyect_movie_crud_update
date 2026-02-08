import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { readPeliculaById, updatePelicula } from "../services/peliculaService";
import { getAllCategorias } from "../services/categoriaService";
import Input from "../components/Input";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UpdatePeliculaView = () => {

  const [pelicula, setPelicula] = useState({
    "nombre": "",
    "anioEstreno": 0,
    "synopsis": "",
    "categorias": [],
    "imagenUrl": ""
  });

  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  const { id } = useParams();

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
      // Validar categorias
      const categoriasToSend = Array.isArray(pelicula.categorias)
        ? pelicula.categorias
        : typeof pelicula.categorias === 'string'
          ? pelicula.categorias.split(',').map(c => c.trim()).filter(c => c)
          : [];

      const peliculaToSend = {
        nombre: pelicula.nombre,
        anioEstreno: pelicula.anioEstreno,
        synopsis: pelicula.synopsis,
        imagenUrl: pelicula.imagenUrl,
        categorias: categoriasToSend
      };

      console.log("Enviando actualización:", peliculaToSend);

      const result = await updatePelicula(id, peliculaToSend);
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
        text: "No se pudo actualizar la película. Verifique los datos.",
        icon: "error"
      });
    }
  }


  useEffect(() => {
    if (id) {
      const getPelicula = async () => {
        try {
          const peliculaData = await readPeliculaById(id);
          console.log("Película obtenida:", peliculaData);

          if (peliculaData) {
            const dataToUse = Array.isArray(peliculaData) ? peliculaData[0] : peliculaData;

            let categoriasArray = [];
            if (Array.isArray(dataToUse.categorias)) {
              categoriasArray = dataToUse.categorias;
            } else if (typeof dataToUse.categorias === 'string') {
              categoriasArray = dataToUse.categorias.split(',').map(c => c.trim()).filter(c => c !== "");
            }

            const peliculaState = {
              ...dataToUse,
              nombre: dataToUse.nombre || "",
              anioEstreno: dataToUse.anioEstreno || 0,
              synopsis: dataToUse.synopsis || "",
              categorias: categoriasArray,
              imagenUrl: dataToUse.imagenUrl || ""
            };
            setPelicula(peliculaState);
          }
        } catch (error) {
          console.log("Error al obtener película:", error);
        }
      }
      getPelicula();
    }
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-semibold pb-3">
        Actualizar Pelicula
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <button className="btn btn-primary" type="submit">
          Guardar Cambios
        </button>
      </form>

    </div>
  );
}

export default UpdatePeliculaView