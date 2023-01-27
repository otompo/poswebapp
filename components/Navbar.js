import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router, { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';
import Fade from 'react-reveal/Fade';
import { AuthContext } from '../context';
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });
NProgress.configure({ trickleSpeed: 200 });

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [current, setCurrent] = useState('');
  const handleClick = () => setClick(!click);
  // const closeMenu = () => setClick(false);
  const [auth, setAuth] = useContext(AuthContext);
  const { user } = auth;

  useEffect(() => {
    window.addEventListener('scroll', changebackground);
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const changebackground = () => {
    if (window.scrollY >= 100) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  return (
    <>
      <div className={navbar ? 'header herderactive' : 'header'}>
        <nav className="navbar">
          <Fade right>
            <Link href="/" className="logo">
              <img
                src="/img/logo2.png"
                alt="POS"
                className="pb-1 ant-menu-item"
              />
            </Link>
          </Fade>
          <div className="hamburger" onClick={handleClick}>
            {click ? (
              <FaTimes size={30} style={{ color: '#ffffff' }} />
            ) : (
              <FaBars size={30} style={{ color: '#ffffff' }} />
            )}
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li>
              <Link href="/user/manage-profile/update">
                <h5 className="text-white text-uppercase">
                  {user && user.name}
                </h5>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
