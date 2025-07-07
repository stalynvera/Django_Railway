import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  // Inicializamos el estado del carrito con los datos almacenados en localStorage (si existen)
  const [carrito, setCarrito] = useState(() => {
    if (typeof window !== "undefined") {
      const carritoGuardado = localStorage.getItem("carrito");
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }
    return [];
  });

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((p) => p.id === producto.id);
      if (existe) {
        return prevCarrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => {
      const carritoActualizado = prevCarrito.filter((p) => p.id !== id);
      // Limpiar el carrito en el localStorage si está vacío
      if (carritoActualizado.length === 0) {
        localStorage.removeItem("carrito");
      } else {
        localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
      }
      return carritoActualizado;
    });
  };

  // Guardamos el carrito en localStorage cada vez que se actualiza
  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      localStorage.removeItem("carrito");
    }
  }, [carrito]);

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
