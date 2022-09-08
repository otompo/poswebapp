import { useReducer, createContext, useEffect } from 'react';
import reducers from '../actions/Reducers';

// create context
const CartContext = createContext();

// context provider
const CartProvider = ({ children }) => {
  // initial state
  const initialState = {
    cart: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart } = state;

  useEffect(() => {
    const __next__cart01__devat = JSON.parse(
      localStorage.getItem('__next__cart01__devat'),
    );

    if (__next__cart01__devat)
      dispatch({ type: 'ADD_CART', payload: __next__cart01__devat });
  }, []);

  useEffect(() => {
    localStorage.setItem('__next__cart01__devat', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
