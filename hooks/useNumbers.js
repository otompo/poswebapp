import { useState, useEffect } from 'react';
import axios from 'axios';

const useNumbers = () => {
  // state
  const [users, setUsers] = useState('');
  const [categories, setCategories] = useState('');
  const [products, setProducts] = useState('');
  const [usersInactive, setUsersInactive] = useState('');

  useEffect(() => {
    getNumbers();
  }, []);

  const getNumbers = async () => {
    try {
      const { data } = await axios.get('/api/admin/getNumbers');
      setUsers(data.users);
      setCategories(data.categories);
      setProducts(data.products);
      setUsersInactive(data.usersInactive);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    users,
    categories,
    products,
    usersInactive,
  };
};

export default useNumbers;
