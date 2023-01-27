import { useState, useEffect } from 'react';
import Link from 'next/link';

const AdminNav = () => {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/admin" legacyBehavior>
        <a className={`nav-link  ${current === '/admin' && 'active'}`}>
          Admin Dashboard
        </a>
      </Link>
      <Link href="/admin/manage-categories" legacyBehavior>
        <a
          className={`nav-link  ${
            current === '/admin/manage-categories' && 'active'
          }`}
        >
          Manage Categories
        </a>
      </Link>
      <Link href="/admin/products" legacyBehavior>
        <a className={`nav-link  ${current === '/admin/products' && 'active'}`}>
          Manage Products
        </a>
      </Link>
      {/* <Link href="/admin/prices">
        <a className={`nav-link  ${current === '/admin/prices' && 'active'}`}>
          Manage Prices
        </a>
      </Link> */}

      <Link href="/admin/daily-sales" legacyBehavior>
        <a
          className={`nav-link  ${
            current === '/admin/daily-sales' && 'active'
          }`}
        >
          Manage Daily Sales
        </a>
      </Link>

      <Link href="/admin/daily-sales/user" legacyBehavior>
        <a
          className={`nav-link  ${
            current === '/admin/daily-sales/user' && 'active'
          }`}
        >
          Manage User Daily Sales
        </a>
      </Link>

      <Link href="/admin/products/supply" legacyBehavior>
        <a
          className={`nav-link  ${
            current === '/admin/products/supply' && 'active'
          }`}
        >
          Manage Supply
        </a>
      </Link>
      <Link href="/admin/expenses" legacyBehavior>
        <a className={`nav-link  ${current === '/admin/expenses' && 'active'}`}>
          Manage Expenses
        </a>
      </Link>
      <Link href="/admin/reports" legacyBehavior>
        <a className={`nav-link  ${current === '/admin/reports' && 'active'}`}>
          Manage Reports
        </a>
      </Link>
      <Link href="/admin/statistics" legacyBehavior>
        <a
          className={`nav-link  ${current === '/admin/statistics' && 'active'}`}
        >
          Manage Statistics
        </a>
      </Link>

      <Link href="/admin/users" legacyBehavior>
        <a className={`nav-link  ${current === '/admin/users' && 'active'}`}>
          Manage Staff
        </a>
      </Link>

      <Link href="/admin/settings" legacyBehavior>
        <a className={`nav-link  ${current === '/admin/settings' && 'active'}`}>
          Settings
        </a>
      </Link>
    </div>
  );
};

export default AdminNav;
