import "@/styles/globals.css";
import { CarritoProvider } from "../context/CarritoContext";
export default function App({ Component, pageProps }) {
  return (
    <CarritoProvider>
    <Component {...pageProps} />;
    </CarritoProvider>
  )
}
