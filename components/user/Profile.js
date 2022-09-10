import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Divider, Input, Row } from 'antd';
import { toast } from 'react-hot-toast';
import UserRoute from '../routes/UserRoutes';
import Layout from '../layout/Layout';
import axios from 'axios';
import { AuthContext } from '../../context';

const UserProfilePage = () => {
  const [auth, setAuth] = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNum, setContactNum] = useState('');

  useEffect(() => {
    loadUser();
  }, [auth?.token]);

  const loadUser = async () => {
    try {
      const { data } = await axios.get(`/api/user`);
      setName(data.name);
      setEmail(data.email);
      setContactNum(data.contactNum);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/user`, {
        name,
        email,
        contactNum,
        password,
      });
      if (auth?.user?._id === data._id) {
        setAuth({ ...auth, user: data });
        let fromLocalStorage = JSON.parse(localStorage.getItem('auth'));
        fromLocalStorage.user = data;
        localStorage.setItem('auth', JSON.stringify(fromLocalStorage));
      }
      toast.success('Success');
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Layout title="">
      <UserRoute>
        <Row>
          <Col span={14} offset={10}>
            <h4 className="text-uppercase">Profile Update</h4>
          </Col>
          <Divider />
          <Col span={12} offset={6}>
            <Input
              style={{ margin: '20px 0px 10px 0px' }}
              size="large"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              style={{ margin: '10px 0px 10px 0px' }}
              size="large"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              style={{ margin: '10px 0px 10px 0px' }}
              size="large"
              placeholder="contact Number"
              value={contactNum}
              onChange={(e) => setContactNum(e.target.value)}
            />

            <Input.Password
              style={{ margin: '10px 0px 10px 0px' }}
              size="large"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              onClick={handleSubmit}
              type="primary"
              style={{ margin: '10px 0px 10px 0px' }}
              loading={loading}
              block
            >
              Submit
            </Button>
          </Col>
        </Row>
      </UserRoute>
    </Layout>
  );
};

export default UserProfilePage;
