import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import AdminNav from './AdminNav';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';

const UserNav = () => {
  const router = useRouter();
  const [auth, setAuth] = useContext(AuthContext);
  const { user } = auth;
  const [current, setCurrent] = useState('');

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const handleLogout = () => {
    // remove from local storage
    localStorage.removeItem('auth');
    // remove from context
    setAuth({
      user: null,
      token: '',
    });
    router.push('/');
  };

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/user">
        <a className={`nav-link  ${current === '/user' && 'active'}`}>POS</a>
      </Link>

      {/* <Link href={`/user/manage-profile/update`}>
        <a
          className={`nav-link  ${
            current === `/user/manage-profile/update` && 'active'
          }`}
        >
          {user && user.profileImage ? (
            <Avatar
              size={32}
              src={
                user && user.profileImage && user.profileImage.Location
                // <Image
                //   src={user && user.profileImage.Location}
                //   alt={user && user.picture}
                // />
              }
            />
          ) : (
            <Avatar size={30} src={user && user.picture} />
          )}{' '}
          {user && user.name}
        </a>
      </Link> */}

      <Link href="/user/mydailysales">
        <a
          className={`nav-link  ${
            current === '/user/mydailysales' && 'active'
          }`}
        >
          My Dialy Sales
        </a>
      </Link>

      {user && user.role && !user.role.includes('admin') ? '' : <AdminNav />}

      <p
        onClick={handleLogout}
        className="logout"
        style={{ color: '#ff0000', cursor: 'pointer', marginLeft: 11 }}
      >
        Log Out
      </p>
    </div>
  );
};

export default UserNav;
