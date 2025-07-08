import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext";

export default function Productos() {
  const { carrito, agregarAlCarrito } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    api.get("http://192.168.100.7:8000/api/productos/")
      .then(response => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      });
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    setMensaje(`${producto.nombre} agregado al carrito`);
    setTimeout(() => setMensaje(""), 3000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/images/fondo.png)' }}>
      <div className="bg-white/90 p-8 rounded-xl shadow-lg">
        <p className="text-xl font-semibold text-gray-800">Cargando productos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/images/fondo.png)' }}>
      <div className="bg-white/90 p-8 rounded-xl shadow-lg">
        <p className="text-xl font-semibold text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-[#B1C41B] text-white rounded hover:bg-[#9a9e12]"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center text-gray-900 pb-20" 
      style={{ backgroundImage: 'url(/images/fondo.png)' }}
    >
      {/* Barra de navegación superior fija */}
      <div className="fixed top-0 left-0 right-0 bg-[#B1C41B] text-white p-4 flex justify-between items-center z-10 shadow-lg">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Regresar
        </button>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Inicio
          </button>
          
          <button
            onClick={() => window.location.href = "/carrito"}
            className="relative p-2 bg-[#8B9424] rounded-lg hover:bg-[#7a821f] transition duration-300"
          >
            <ShoppingCart size={24} />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {carrito.length}
              </span>
            )}
          </button>
        </div>
      </div>

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
        <h1 className="text-4xl font-extrabold text-center text-[#B1C41B] mb-8 drop-shadow-md">
          Nuestros Productos
        </h1>

        {/* Grid de productos responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
              >
                {/* Imagen del producto */}
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

                {/* Detalles del producto */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{producto.nombre}</h2>
                    <p className="text-[#B1C41B] font-bold">${producto.precio}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                  
                  <button 
                    onClick={() => handleAgregarAlCarrito(producto)}
                    className="w-full py-2 bg-[#B1C41B] text-white rounded-lg hover:bg-[#9a9e12] transition duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white/90 p-8 rounded-xl shadow-lg text-center">
              <p className="text-gray-800 text-lg">Actualmente no hay productos disponibles.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#B1C41B] text-white rounded hover:bg-[#9a9e12]"
              >
                Recargar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-30 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }} 
              className="absolute -top-10 right-0 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300 z-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={selectedImage} 
                alt="Imagen ampliada" 
                className="w-full h-auto max-h-[80vh] object-contain" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}