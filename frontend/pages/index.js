import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({});
  const [storeStatus, setStoreStatus] = useState("Cerrado");

  useEffect(() => {
    const targetDate = new Date("2025-08-22T00:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hour = now.getHours();
  
      if (
        (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 8 && hour < 18) ||
        (dayOfWeek === 6 && hour >= 9 && hour < 17)
      ) {
        setStoreStatus("Abierto");
      } else {
        setStoreStatus("Cerrado");
      }
    };
  
    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center text-gray-900 relative" style={{ backgroundImage: 'url(/images/fondo.png)' }}>
      {/* Logo con mejor posición y sombra */}
      <div className="absolute top-20 left-6 z-10">
        <img 
          src="/images/logo.png" 
          alt="Logo de InArtPoint" 
          className="w-40 h-auto drop-shadow-lg hover:scale-105 transition-transform duration-300" 
        />
      </div>

      {/* Navbar mejorado */}
      <nav className="bg-[#B1C41B]/90 backdrop-blur-md text-white py-4 shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
          <h1 className="text-3xl font-bold tracking-tight">InArtPoint</h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-lg">
            <Link href="/productos" className="hover:text-gray-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10">Productos</Link>
            <Link href="/categorias" className="hover:text-gray-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10">Categorías</Link>
            <Link href="#sobre-nosotros" className="hover:text-gray-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10">Sobre Nosotros</Link>
            <Link href="#redes-sociales" className="hover:text-gray-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10">Redes Sociales</Link>
          </div>
        </div>
      </nav>

{/* Hero Section mejorada */}
<section className="relative pt-32 pb-24 px-4">
  <div className="bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl mx-auto text-gray-800 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] text-center"> {/* Agregado text-center aquí */}
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#B1C41B] drop-shadow-sm">Bienvenido a InArtPoint</h2>
    <p className="text-lg md:text-xl mt-4 mb-8 leading-relaxed">
      Descubre una colección exclusiva de productos de arte y diseño que transformarán tus espacios. 
      Calidad, creatividad y personalización en cada pieza.
    </p>
    <div className="flex justify-center"> {/* Contenedor flex para centrar */}
      <Link 
        href="/productos" 
        className="mt-6 py-3 px-8 bg-[#B1C41B] text-white font-semibold rounded-full shadow-lg hover:bg-[#9a9e12] transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        Explorar Catálogo
      </Link>
    </div>
  </div>
</section>
      {/* Estado de la tienda con mejor diseño */}
      <div className="fixed top-32 right-4 md:right-10 z-10">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border-l-4 border-[#B1C41B]">
          <h3 className="text-xl font-semibold text-gray-700">Estado de la tienda</h3>
          <div className="mt-2 text-2xl font-bold">
            {storeStatus === "Abierto" ? (
              <span className="text-green-600 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Abierto
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Cerrado
              </span>
            )}
          </div>
        </div>
      </div>

{/* Sobre Nosotros con mejor estructura */}
<section id="sobre-nosotros" className="py-16 md:py-24 px-4">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#B1C41B] relative">
      <span className="relative inline-block">
        Sobre Nosotros
        <span className="absolute bottom-0 left-0 w-full h-1 bg-[#B1C41B]/50 transform -translate-y-1"></span>
      </span>
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <div className="bg-white/90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#B1C41B] text-center"> {/* Añadido text-center */}
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Nuestra Filosofía</h3>
        <p className="text-lg leading-relaxed">
          En InArtPoint, creemos que cada detalle importa. Transformamos objetos cotidianos en piezas únicas que cuentan historias. 
          Nuestros productos no solo decoran espacios, sino que también inspiran emociones y crean conexiones.
        </p>
      </div>
      <div className="bg-white/90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#B1C41B] text-center"> {/* Añadido text-center */}
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Nuestros Productos</h3>
        <p className="text-lg leading-relaxed">
          Desde glass cans y termos hasta camisetas y cuadros personalizados, cada artículo es diseñado con pasión y fabricado 
          con materiales premium. Ofrecemos durabilidad, estilo y ese toque personal que hace la diferencia.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Redes Sociales mejor organizadas */}
      <section id="redes-sociales" className="py-16 md:py-24 px-4 bg-[#B1C41B]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#B1C41B]">
            Conéctate Con Nosotros
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[ 
              { 
                href: "https://www.facebook.com/share/19z2BQYsUe/", 
                src: "/images/facebook.png", 
                alt: "Facebook", 
                name: "InArtPoint",
                desc: "Síguenos para novedades"
              },
              { 
                href: "https://www.instagram.com/inartpoint?igsh=MTJ3cWR4cmg0ZnZ0bw==", 
                src: "/images/instagram.png", 
                alt: "Instagram", 
                name: "@inartpoint",
                desc: "Descubre nuestro trabajo"
              },
              { 
                href: "mailto:inartpoint@gmail.com?subject=Consulta&body=Hola, quisiera más información.", 
                src: "/images/gmail.png", 
                alt: "Gmail", 
                name: "inartpoint@gmail.com",
                desc: "Contáctanos directamente"
              },
              { 
                href: "https://www.tiktok.com/@inartpoint?_t=ZM-8u8jpMRErtV&_r=1", 
                src: "/images/tik-tok.png", 
                alt: "TikTok", 
                name: "@inartpoint",
                desc: "Mira nuestros videos"
              },
            ].map(({ href, src, alt, name, desc }) => (
              <div key={alt} className="flex flex-col items-center bg-white/90 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <a href={href} target="_blank" rel="noopener noreferrer" className="mb-4 transition duration-300 hover:scale-110">
                  <img src={src} alt={alt} className="w-14 h-14 object-contain mx-auto" />
                </a>
                <h4 className="text-xl font-bold text-gray-800 mb-1">{name}</h4>
                <p className="text-gray-600 text-sm text-center">{desc}</p>
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 text-[#B1C41B] font-medium hover:underline text-sm"
                >
                  Visitar ahora
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuenta Regresiva con mejor diseño */}
      <div className="fixed bottom-6 left-6 z-10">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-xl border-2 border-[#B1C41B] transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-[#B1C41B] mb-2">Lanzamiento Especial</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-100/80 p-2 rounded">
              <div className="text-2xl font-bold text-gray-800">{timeLeft.days}</div>
              <div className="text-xs text-gray-600">Días</div>
            </div>
            <div className="bg-gray-100/80 p-2 rounded">
              <div className="text-2xl font-bold text-gray-800">{timeLeft.hours}</div>
              <div className="text-xs text-gray-600">Horas</div>
            </div>
            <div className="bg-gray-100/80 p-2 rounded">
              <div className="text-2xl font-bold text-gray-800">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-600">Min</div>
            </div>
            <div className="bg-gray-100/80 p-2 rounded">
              <div className="text-2xl font-bold text-gray-800">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-600">Seg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer mejorado */}
      <footer className="bg-[#B1C41B]/90 backdrop-blur-md text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold">InArtPoint</div>
            <div className="flex gap-6">
              <Link href="/politica-privacidad" className="hover:text-gray-300 transition-colors">Política de Privacidad</Link>
              <Link href="/terminos" className="hover:text-gray-300 transition-colors">Términos de Servicio</Link>
              <Link href="/contacto" className="hover:text-gray-300 transition-colors">Contacto</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} InArtPoint. Todos los derechos reservados.</p>
            <p className="mt-1">Diseñado con pasión en Ecuador</p>
          </div>
        </div>
      </footer>
    </div>
  );
}