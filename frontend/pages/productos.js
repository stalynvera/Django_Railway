import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext";

export default function Productos() {
  const { carrito, agregarAlCarrito } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal para imagen ampliada
  const [productoImagenModal, setProductoImagenModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [indiceImagenSeleccionada, setIndiceImagenSeleccionada] = useState(0);

  // Modal para elegir precio/cantidad (agregar al carrito)
  const [productoOpcionesModal, setProductoOpcionesModal] = useState(null);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    api.get("http://192.168.11.20:8000/api/productos/")
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

  // Abrir modal de imagen ampliada, con índice de imagen seleccionado
  const abrirModalImagen = (producto, index = 0) => {
    setProductoImagenModal(producto);
    setSelectedImage(producto.imagenes[index]?.imagen);
    setIndiceImagenSeleccionada(index);
  };

  // Cerrar modal imagen
  const cerrarModalImagen = () => {
    setProductoImagenModal(null);
    setSelectedImage(null);
    setIndiceImagenSeleccionada(0);
  };

  // Abrir modal para elegir cantidad/precio (agregar al carrito)
  const abrirModalOpciones = (producto) => {
    setProductoOpcionesModal(producto);
  };

  // Cerrar modal opciones
  const cerrarModalOpciones = () => {
    setProductoOpcionesModal(null);
  };

  // Agregar producto con cantidad y precio seleccionado
  const seleccionarOpcion = (cantidad, precioUnitario) => {
    agregarAlCarrito({
      ...productoOpcionesModal,
      cantidad,
      precio: precioUnitario, // precio por unidad
    });
    setMensaje(`${productoOpcionesModal.nombre} (${cantidad} unidades) agregado al carrito`);
    setTimeout(() => setMensaje(""), 3000);
    cerrarModalOpciones();
  };

  // Cambiar imagen en modal con flechas
  const cambiarImagen = (direccion) => {
    if (!productoImagenModal?.imagenes) return;

    let nuevoIndice;
    if (direccion === "prev") {
      nuevoIndice = indiceImagenSeleccionada === 0 ? productoImagenModal.imagenes.length - 1 : indiceImagenSeleccionada - 1;
    } else {
      nuevoIndice = indiceImagenSeleccionada === productoImagenModal.imagenes.length - 1 ? 0 : indiceImagenSeleccionada + 1;
    }

    setIndiceImagenSeleccionada(nuevoIndice);
    setSelectedImage(productoImagenModal.imagenes[nuevoIndice].imagen);
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
      {/* Barra navegación */}
      <div className="fixed top-0 left-0 right-0 bg-[#B1C41B] text-white p-4 flex justify-between items-center z-10 shadow-lg">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center gap-2"
        >
          ← Regresar
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

      {/* Mensaje confirmación */}
      {mensaje && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-[#B1C41B] text-white px-6 py-3 rounded-lg shadow-lg z-20 animate-bounce">
          {mensaje}
        </div>
      )}

      {/* Contenido principal */}
      <div className="pt-24 pb-10 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#B1C41B] mb-8 drop-shadow-md">
          Nuestros Productos
        </h1>

        {/* Grid productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div key={producto.id} className="bg-white/90 rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div
                  className="h-48 overflow-hidden cursor-pointer relative"
                  onClick={() => abrirModalImagen(producto, 0)}
                >
                  <img
                    src={producto.imagenes[0]?.imagen || producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/80 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      Click para ampliar
                    </span>
                  </div>
                </div>

                {/* Miniaturas (si tiene imágenes extras) */}
                {producto.imagenes && producto.imagenes.length > 1 && (
                  <div className="flex justify-center gap-2 mt-2 px-2">
                    {producto.imagenes.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.imagen}
                        alt={`Miniatura ${idx + 1}`}
                        onClick={() => abrirModalImagen(producto, idx)}
                        className="h-10 w-10 object-cover rounded cursor-pointer border hover:border-[#B1C41B]"
                      />
                    ))}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{producto.nombre}</h2>
                    <p className="text-[#B1C41B] font-bold">${producto.precio_base}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>

                  <button
                    onClick={() => abrirModalOpciones(producto)}
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

      {/* Modal para seleccionar precio/cantidad */}
      {productoOpcionesModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={cerrarModalOpciones}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={cerrarModalOpciones}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 font-bold text-xl"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4">{productoOpcionesModal.nombre}</h3>

            {/* Opción precio base */}
            <div
              className="mb-4 border rounded p-3 cursor-pointer hover:bg-green-100"
              onClick={() => seleccionarOpcion(1, Number(productoOpcionesModal.precio_base))}
            >
              <p>
                Precio por unidad: <strong>${productoOpcionesModal.precio_base ? Number(productoOpcionesModal.precio_base).toFixed(2) : "0.00"}</strong> &nbsp;
                <button className="text-green-700 font-semibold underline">Seleccionar</button>
              </p>
            </div>

            {/* Opciones de precios por cantidad (si tiene) */}
            {productoOpcionesModal.precios_por_cantidad && productoOpcionesModal.precios_por_cantidad.length > 0 && (
              <>
                <p className="mb-2 font-semibold">Precios por cantidad:</p>
                {productoOpcionesModal.precios_por_cantidad.map((opc, i) => (
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
      {selectedImage && productoImagenModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-30 p-4"
          onClick={cerrarModalImagen}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={cerrarModalImagen}
              className="absolute -top-10 right-0 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300 z-40"
            >
              ×
            </button>

            {/* Flecha izquierda */}
            {productoImagenModal.imagenes.length > 1 && (
              <button
                onClick={() => cambiarImagen("prev")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition cursor-pointer"
                aria-label="Imagen anterior"
              >
                ‹
              </button>
            )}

            {/* Imagen ampliada */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={selectedImage}
                alt={`Imagen ${indiceImagenSeleccionada + 1} de ${productoImagenModal.imagenes.length}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>

            {/* Flecha derecha */}
            {productoImagenModal.imagenes.length > 1 && (
              <button
                onClick={() => cambiarImagen("next")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition cursor-pointer"
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            )}

            {/* Miniaturas dentro del modal */}
            <div className="flex justify-center gap-2 mt-4 px-2">
              {productoImagenModal.imagenes.map((img, idx) => (
                <img
                  key={idx}
                  src={img.imagen}
                  alt={`Miniatura modal ${idx + 1}`}
                  onClick={() => {
                    setIndiceImagenSeleccionada(idx);
                    setSelectedImage(img.imagen);
                  }}
                  className={`h-12 w-12 object-cover rounded cursor-pointer border ${
                    idx === indiceImagenSeleccionada ? "border-[#B1C41B]" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
