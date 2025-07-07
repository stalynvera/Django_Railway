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
  const [selectedImage, setSelectedImage] = useState(null); 
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
    return carritoState.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
  };

  const generarMensajeWhatsApp = () => {
    let mensaje = `*🛍️ Pedido de ${nombreCliente}*\n\n`; 
    mensaje += `📝 *Detalle de tu pedido:*\n\n`; 

    carritoState.forEach((item) => {
      mensaje += `🔸 *${item.nombre}* x${item.cantidad} - *$${(item.precio * item.cantidad).toFixed(2)}*\n`; 
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

  const aumentarCantidad = (id) => {
    setCarritoState(prevState =>
      prevState.map(item => 
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const disminuirCantidad = (id) => {
    setCarritoState(prevState =>
      prevState.map(item => 
        item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
      )
    );
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-gray-900" 
      style={{ backgroundImage: backgroundImage }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header con efecto especial */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#B1C41B] mb-4 drop-shadow-lg">
            Carrito de Compras
          </h1>
          <div className="w-24 h-1 bg-[#B1C41B] mx-auto rounded-full"></div>
        </div>

        {/* Contenido principal */}
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
              {/* Grid de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {carritoState.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                        onClick={() => setSelectedImage(item.imagen)} 
                      />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-gray-800">{item.nombre}</h2>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.descripcion}</p>
                      <p className="text-lg font-bold text-[#B1C41B]">${Number(item.precio).toFixed(2)}</p>
                      
                      <div className="flex justify-between items-center pt-3">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => disminuirCantidad(item.id)} 
                            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.cantidad}</span>
                          <button 
                            onClick={() => aumentarCantidad(item.id)} 
                            className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                          >
                            +
                          </button>
                        </div>
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

              {/* Formulario de datos del cliente */}
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

              {/* Resumen y botones */}
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

      {/* Modal de imagen */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <img 
              src={selectedImage} 
              alt="Imagen ampliada" 
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg" 
            />
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute -top-12 right-0 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}