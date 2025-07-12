import { useEffect, useState } from "react";
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext";
import { ShoppingCart, ArrowLeft, Home } from "lucide-react";

export default function Productos() {
  const { carrito, agregarAlCarrito } = useCarrito();

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [categoriaNombre, setCategoriaNombre] = useState("");

  // Para el modal de seleccionar cantidad y precio
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Cargar categorías al iniciar
  useEffect(() => {
    api.get("http://192.168.11.20:8000/api/categorias/")
      .then(response => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener categorías:", error);
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
      });
  }, []);

  // Cargar productos cuando cambia la categoría seleccionada
  useEffect(() => {
    if (!selectedCategoria) {
      setProductos([]);
      setCategoriaNombre("");
      return;
    }

    setLoading(true);
    api.get(`http://192.168.11.20:8000/api/productos/?categoria=${selectedCategoria}`)
      .then(response => {
        setProductos(response.data);
        if (categorias.length > 0) {
          const categoria = categorias.find(c => c.id === selectedCategoria);
          setCategoriaNombre(categoria ? categoria.nombre : "");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      });
  }, [selectedCategoria, categorias]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Abrir modal para seleccionar cantidad y precio
  const abrirModalOpciones = (producto) => {
    setProductoSeleccionado(producto);
  };

  // Seleccionar opción de cantidad y precio y agregar al carrito
  const seleccionarOpcion = (cantidad, precio) => {
    agregarAlCarrito({
      ...productoSeleccionado,
      cantidad,
      precio,
    });
    setMensaje(`"${productoSeleccionado.nombre}" (${cantidad} unidad(es)) agregado al carrito`);
    setTimeout(() => setMensaje(""), 3000);
    setProductoSeleccionado(null);
  };

  const handleSelectCategoria = (categoriaId, categoriaNombre) => {
    setSelectedCategoria(categoriaId);
    setCategoriaNombre(categoriaNombre);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/images/fondo.png)' }}>
      <div className="bg-white/90 p-8 rounded-xl shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B1C41B] mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-800">Cargando contenido...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/images/fondo.png)' }}>
      <div className="bg-white/90 p-8 rounded-xl shadow-lg text-center max-w-md">
        <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#B1C41B] text-white rounded-lg hover:bg-[#9a9e12] transition duration-300"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center pb-20" 
      style={{ backgroundImage: 'url(/images/fondo.png)' }}
    >
      {/* Barra de navegación superior */}
      <nav className="fixed top-0 left-0 right-0 bg-[#B1C41B] text-white p-4 flex justify-between items-center z-10 shadow-lg">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center gap-2"
          >
            <Home size={20} />
            Inicio
          </button>
          
          <button
            onClick={() => window.location.href = "/carrito"}
            className="relative p-3 bg-[#8B9424] rounded-lg hover:bg-[#7a821f] transition duration-300"
          >
            <ShoppingCart size={24} />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {carrito.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mensaje de confirmación */}
      {mensaje && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-[#B1C41B] text-white px-6 py-3 rounded-lg shadow-lg z-20 animate-bounce">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {mensaje}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Sección de categorías */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#B1C41B] mb-8 relative">
            <span className="relative inline-block">
              Nuestras Categorías
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#B1C41B]/50 transform -translate-y-1"></span>
            </span>
          </h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categorias.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No hay categorías disponibles</p>
              </div>
            ) : (
              categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  className={`p-4 rounded-xl shadow-md transition-all duration-300 text-center ${selectedCategoria === categoria.id ? 'bg-[#B1C41B] text-white' : 'bg-white/90 hover:bg-[#B1C41B]/20'}`}
                  onClick={() => handleSelectCategoria(categoria.id, categoria.nombre)}
                >
                  <h3 className="font-medium text-black">{categoria.nombre}</h3>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Sección de productos cuando se selecciona una categoría */}
        {selectedCategoria && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#B1C41B]">
                Productos: <span className="text-gray-800">{categoriaNombre}</span>
              </h2>
              <button 
                onClick={() => setSelectedCategoria(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Ver todas las categorías
              </button>
            </div>

            {productos.length === 0 ? (
              <div className="bg-white/90 p-8 rounded-xl shadow-lg text-center">
                <p className="text-gray-800 mb-4">No hay productos disponibles en esta categoría.</p>
                <button 
                  onClick={() => setSelectedCategoria(null)}
                  className="px-4 py-2 bg-[#B1C41B] text-white rounded-lg hover:bg-[#9a9e12] transition duration-300"
                >
                  Volver a categorías
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productos.map((producto) => (
                  <div 
                    key={producto.id} 
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                  >
                    <div 
                      className="h-48 overflow-hidden cursor-pointer relative"
                      onClick={() => handleImageClick(producto.imagen)}
                    >
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/80 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          Click para ampliar
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{producto.nombre}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[#B1C41B] font-bold text-lg">${producto.precio_base}</span>
                        <button 
                          onClick={() => abrirModalOpciones(producto)}
                          className="px-4 py-2 bg-[#B1C41B] text-white rounded-lg hover:bg-[#9a9e12] transition duration-300 flex items-center gap-2 text-sm"
                        >
                          <ShoppingCart size={16} />
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Modal para seleccionar precio/cantidad */}
      {productoSeleccionado && (
<div
  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  onClick={() => setProductoSeleccionado(null)}
>
  <div
    className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative text-gray-900"
    onClick={e => e.stopPropagation()}
  >
    <button
      onClick={() => setProductoSeleccionado(null)}
      className="absolute top-2 right-2 text-gray-600 hover:text-red-600 font-bold text-xl"
    >
      ×
    </button>

    <h3 className="text-xl font-semibold mb-4">{productoSeleccionado.nombre}</h3>

            <h3 className="text-xl font-semibold mb-4">{productoSeleccionado.nombre}</h3>

            {/* Precio base (1 unidad) */}
            <div 
              className="mb-4 border rounded p-3 cursor-pointer hover:bg-green-100" 
              onClick={() => seleccionarOpcion(1, Number(productoSeleccionado.precio_base))}
            >
              <p>
                Precio por unidad: <strong>${productoSeleccionado.precio_base ? Number(productoSeleccionado.precio_base).toFixed(2) : "0.00"}</strong> &nbsp;
                <button className="text-green-700 font-semibold underline">Seleccionar</button>
              </p>
            </div>

            {/* Opciones de precios por cantidad si existen */}
            {productoSeleccionado.precios_por_cantidad && productoSeleccionado.precios_por_cantidad.length > 0 && (
              <>
                <p className="mb-2 font-semibold">Precios por cantidad:</p>
                {productoSeleccionado.precios_por_cantidad.map((opc, i) => (
                  <div
                    key={i}
                    className="mb-3 border rounded p-3 cursor-pointer hover:bg-green-100"
                    onClick={() => seleccionarOpcion(opc.cantidad_minima, Number(opc.precio))}
                  >
                    <p>
                      {opc.cantidad_minima} unidades por <strong>${Number(opc.precio).toFixed(2)}</strong> &nbsp;
                      <button className="text-green-700 font-semibold underline">Seleccionar</button>
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-40 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Producto ampliado"
            className="max-h-full max-w-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
