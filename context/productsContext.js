import { useState, createContext } from 'react';

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState({
    products: [],
  });

  return (
    <ProductContext.Provider value={[product, setProduct]}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
