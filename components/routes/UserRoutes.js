import { useContext, useEffect, useState } from 'react';
import LoadingToRedirect from '../layout/LoadingToRedirect';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';
import UserNav from '../nav/UserNav';
import Navbar from '../Navbar';
import axios from 'axios';

const UserRoutes = ({ children, showNav = true }) => {
  const router = useRouter();
  const [auth, setAuth] = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.token) getCurrentAdmin();
  }, [auth?.token]);

  const getCurrentAdmin = async () => {
    try {
      const { data } = await axios.get('/api/user/current');

      setLoading(false);
    } catch (err) {
      console.log(err);
      router.push('/');
    }
  };

  if (loading) {
    return <LoadingToRedirect />;
  }

  return (
    <>
      <div className="container-fluid user_dashboard">
        <div className="row">
          <div className="col-md-2">
            <div id="sidebar">
              <div className="sidebar__menu">{showNav && <UserNav />}</div>
            </div>
          </div>

          <div className="col-md-10">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoutes;
