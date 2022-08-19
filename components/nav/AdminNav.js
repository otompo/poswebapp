import { useState, useEffect } from 'react';
import Link from 'next/link';

const AdminNav = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/admin">
        <a className={`nav-link  ${current === '/admin' && 'active'}`}>
          Admin Dashboard
        </a>
      </Link>
      <Link href="/admin/manage-categories">
        <a
          className={`nav-link  ${
            current === '/admin/manage-categories' && 'active'
          }`}
        >
          Manage Categories
        </a>
      </Link>
      <Link href="/admin/products">
        <a className={`nav-link  ${current === '/admin/products' && 'active'}`}>
          Manage Products
        </a>
      </Link>
      {/* <Link href="/admin/prices">
        <a className={`nav-link  ${current === '/admin/prices' && 'active'}`}>
          Manage Prices
        </a>
      </Link> */}

      <Link href="/admin/daily-sales">
        <a
          className={`nav-link  ${
            current === '/admin/daily-sales' && 'active'
          }`}
        >
          Manage Daily Sales
        </a>
      </Link>

      <Link href="/admin/daily-sales/user">
        <a
          className={`nav-link  ${
            current === '/admin/daily-sales/user' && 'active'
          }`}
        >
          Manage User Daily Sales
        </a>
      </Link>

      <Link href="/admin/products/purchase">
        <a
          className={`nav-link  ${
            current === '/admin/products/purchase' && 'active'
          }`}
        >
          Manage Purchase
        </a>
      </Link>
      <Link href="/admin/expenses">
        <a className={`nav-link  ${current === '/admin/expenses' && 'active'}`}>
          Manage Expenses
        </a>
      </Link>
      <Link href="/admin/reports">
        <a className={`nav-link  ${current === '/admin/reports' && 'active'}`}>
          Manage Reports
        </a>
      </Link>
      <Link href="/admin/statistics">
        <a
          className={`nav-link  ${current === '/admin/statistics' && 'active'}`}
        >
          Manage Statistics
        </a>
      </Link>

      <Link href="/admin/users">
        <a className={`nav-link  ${current === '/admin/users' && 'active'}`}>
          Manage Staff
        </a>
      </Link>

      <Link href="/admin/settings">
        <a className={`nav-link  ${current === '/admin/settings' && 'active'}`}>
          Settings
        </a>
      </Link>
    </div>
  );
};

export default AdminNav;
