import React, { useState, useEffect, useContext } from 'react';
import UserRouter from '../../components/routes/UserRoutes';
import ManageProductsForSale from '../../components/ManageProductsForSale';

const UserIndex = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return <ManageProductsForSale />;
};

export default UserIndex;
