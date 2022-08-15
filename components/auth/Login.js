import React, { useState, Fragment, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context';
import { Spin } from 'antd';
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const [auth, setAuth] = useContext(AuthContext);
  const [email, setEmail] = useState('sasco@gmail.com');
  const [password, setPassword] = useState('otompo123@');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/auth/signin`, {
        email,
        password,
      });
      setAuth(data);
      // save in local storage
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Success');
      router.push('/user');
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 offset-md-4 mt-5">
            <div className="card ">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="form-control mb-4 p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                  <input
                    type="password"
                    className="form-control mb-4 p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <div className="d-grid gap-2">
                    <button
                      disabled={!email || !password || loading}
                      className="btn btn-primary btn-block"
                      type="submit"
                    >
                      {loading ? <Spin /> : 'Login'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
