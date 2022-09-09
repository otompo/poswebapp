import { useEffect, useState } from 'react';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';
import 'antd/dist/antd.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context';
import { CartProvider } from '../context/cartContext';
import { ProductProvider } from '../context/productsContext';

function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Toaster />
          <Component {...pageProps} />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default MyApp;
