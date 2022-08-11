import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';
import 'antd/dist/antd.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context';
import { CartProvider } from '../context/cartContext';
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
