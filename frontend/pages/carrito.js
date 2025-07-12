import { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useRouter } from "next/router";

export default function Carrito() {
  const { carrito, eliminarDelCarrito } = useCarrito();
  const [carritoState, setCarritoState] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [nombreCliente, setNombreCliente] = useState(""); 
  const [fechaEntrega, setFechaEntrega] = useState(""); 
  const [errorFecha, setErrorFecha] = useState(""); 

  // Modal de imagen ampliada con múltiples imágenes
  const [productoImagenModal, setProductoImagenModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [indiceImagenSeleccionada, setIndiceImagenSeleccionada] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setBackgroundImage('url(/images/fondo.png)');
    setCarritoState(carrito);

    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);
    const fechaMinima = hoy.toISOString().split("T")[0];
    setFechaEntrega(fechaMinima);
  }, [carrito]);

  const calcularTotal = () => {
    return carritoState.reduce((total, item) => total + item.precio, 0).toFixed(2);
  };

  const generarMensajeWhatsApp = () => {
    let mensaje = `*🛍️ Pedido de ${nombreCliente}*\n\n`; 
    mensaje += `📝 *Detalle de tu pedido:*\n\n`; 

    carritoState.forEach((item) => {
      mensaje += `🔸 *${item.nombre}* x${item.cantidad} unidades - *$${item.precio.toFixed(2)}*\n`;
    });

    mensaje += `\n💰 *Total: $${calcularTotal()}*\n\n`; 
    mensaje += `*--------------------------------------*\n`; 
    mensaje += `*Fecha de entrega: ${fechaEntrega}*\n\n`; 
    mensaje += `*Gracias por tu compra, ${nombreCliente}! 🎉*\n`; 
    mensaje += `*Si tienes alguna pregunta, no dudes en contactarnos.*\n`; 
    mensaje += `📞 *Teléfono de atención: [0959065186]*`; 

    return encodeURIComponent(mensaje);
  };

  const irAPagar = () => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0];
    if (fechaEntrega === fechaHoy) {
      setErrorFecha("Debes esperar al menos 1 día para la entrega. Elige una fecha posterior.");
      return;
    }

    if (carritoState.length === 0 || !nombreCliente || !fechaEntrega) return;
    const numeroAdmin = "593959065186"; 
    const url = `https://wa.me/${numeroAdmin}?text=${generarMensajeWhatsApp()}`;
    window.open(url, "_blank");

    carritoState.forEach((item) => eliminarDelCarrito(item.id));
    router.push("/"); 
  };

  const regresar = () => {
    window.history.back();
  };

  const handleFechaChange = (e) => {
    const fechaSeleccionada = e.target.value;
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);

    const fechaHoy = hoy.toISOString().split("T")[0];
    if (fechaSeleccionada === fechaHoy) {
      setErrorFecha("La fecha seleccionada no puede ser el mismo día. Debe ser al menos 1 día después.");
    } else {
      setErrorFecha(""); 
      setFechaEntrega(fechaSeleccionada); 
    }
  };

  // Abrir modal imagen ampliada con todas las imágenes del producto
  const abrirModalImagen = (producto, index = 0) => {
    setProductoImagenModal(producto);
    // Si tiene array de imágenes, toma la del índice, si no toma la imagen simple
    const img = producto.imagenes?.[index]?.imagen || producto.imagen;
    setSelectedImage(img);
    setIndiceImagenSeleccionada(index);
  };

  // Cerrar modal imagen
  const cerrarModalImagen = () => {
    setProductoImagenModal(null);
    setSelectedImage(null);
    setIndiceImagenSeleccionada(0);
  };

  // Cambiar imagen en modal con flechas
  const cambiarImagen = (direccion) => {
    if (!productoImagenModal) return;

    const imagenes = productoImagenModal.imagenes || [{ imagen: productoImagenModal.imagen }];

    let nuevoIndice;
    if (direccion === "prev") {
      nuevoIndice = indiceImagenSeleccionada === 0 ? imagenes.length - 1 : indiceImagenSeleccionada - 1;
    } else {
      nuevoIndice = indiceImagenSeleccionada === imagenes.length - 1 ? 0 : indiceImagenSeleccionada + 1;
    }

    setIndiceImagenSeleccionada(nuevoIndice);
    setSelectedImage(imagenes[nuevoIndice].imagen);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-gray-900" 
      style={{ backgroundImage: backgroundImage }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#B1C41B] mb-4 drop-shadow-lg">
            Carrito de Compras
          </h1>
          <div className="w-24 h-1 bg-[#B1C41B] mx-auto rounded-full"></div>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          {carritoState.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-700">Tu carrito está vacío</p>
              <button 
                onClick={regresar} 
                className="mt-6 px-6 py-3 bg-[#B1C41B] text-white rounded-lg hover:bg-[#9A9D16] transition duration-300 shadow-md"
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {carritoState.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4 h-48 cursor-pointer" onClick={() => abrirModalImagen(item, 0)}>
                      <img 
                        src={item.imagenes?.[0]?.imagen || item.imagen} 
                        alt={item.nombre} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-gray-800">{item.nombre}</h2>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.descripcion}</p>
                      <p className="text-lg font-bold text-[#B1C41B]">${Number(item.precio).toFixed(2)}</p>

                      <div className="flex justify-between items-center pt-3">
                        <span className="font-medium text-gray-700">Cantidad: {item.cantidad}</span>
                        <button 
                          onClick={() => eliminarDelCarrito(item.id)} 
                          className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulario y total (igual que antes) */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="nombreCliente" className="block text-lg font-semibold text-gray-800 mb-2">
                      Tu Nombre
                    </label>
                    <input 
                      type="text" 
                      id="nombreCliente"
                      value={nombreCliente} 
                      onChange={(e) => {
                        const nuevoValor = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚÑñ\s]/g, '');
                        setNombreCliente(nuevoValor);
                      }} 
                      className="w-full p-3 border-2 border-[#B1C41B] rounded-lg focus:ring-2 focus:ring-[#B1C41B] focus:border-transparent"
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="fechaEntrega" className="block text-lg font-semibold text-gray-800 mb-2">
                    Fecha de Entrega
                  </label>
                  <input 
                    type="date" 
                    id="fechaEntrega"
                    value={fechaEntrega} 
                    onChange={handleFechaChange} 
                    min={fechaEntrega} 
                    className="w-full p-3 border-2 border-[#B1C41B] rounded-lg focus:ring-2 focus:ring-[#B1C41B] focus:border-transparent"
                    required
                  />
                  {errorFecha && (
                    <p className="mt-2 text-red-500 text-sm animate-pulse">
                      {errorFecha}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Total: <span className="text-[#B1C41B]">${calcularTotal()}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {carritoState.length} {carritoState.length === 1 ? 'producto' : 'productos'} en tu carrito
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button 
                      onClick={regresar} 
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 shadow-md font-medium"
                    >
                      Seguir Comprando
                    </button>
                    <button 
                      onClick={irAPagar} 
                      disabled={carritoState.length === 0 || !nombreCliente || !fechaEntrega || errorFecha || fechaEntrega === new Date().toISOString().split('T')[0]}
                      className={`px-6 py-3 rounded-lg shadow-md font-medium transition duration-300 ${
                        carritoState.length === 0 || !nombreCliente || !fechaEntrega || errorFecha 
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                          : "bg-[#B1C41B] hover:bg-[#9A9D16] text-white"
                      }`}
                    >
                      Confirmar Pedido por WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal imagen ampliada con navegación */}
      {selectedImage && productoImagenModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4"
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
            {(productoImagenModal.imagenes?.length || 0) > 1 && (
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
                alt={`Imagen ${indiceImagenSeleccionada + 1} de ${productoImagenModal.imagenes?.length || 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>

            {/* Flecha derecha */}
            {(productoImagenModal.imagenes?.length || 0) > 1 && (
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
              {(productoImagenModal.imagenes || [{ imagen: productoImagenModal.imagen }]).map((img, idx) => (
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
