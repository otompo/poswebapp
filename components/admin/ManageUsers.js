import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Tooltip, Modal, Badge, Button } from 'antd';
import {
  DeleteOutlined,
  CoffeeOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import AdminRoute from '../routes/AdminRoutes';

const ManageUsers = () => {
  const { confirm } = Modal;
  const [values, setValues] = useState({
    name: '',
    email: '',
    contactNum: '',
    loading: false,
  });
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalInactive, setTotalInactive] = useState('');

  useEffect(() => {
    loadUsers();
    getAllUsersInTrash();
  }, [success]);

  // const router = useRouter();
  // const { id } = router.query;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/users`);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data);
      setLoading(false);
    }
  };

  const getAllUsersInTrash = async () => {
    try {
      const { data } = await axios.get(`/api/admin/user/inactive`);
      setTotalInactive(data);
    } catch (err) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
    }
  };

  const moveUserToTrash = async (e, username) => {
    try {
      setSuccess(true);
      const { data } = await axios.put(`/api/admin/user/trash/${username}`);
      setSuccess(false);
      toast.success('User move to trash');
    } catch (err) {
      // console.log(err);
      toast.error(err.response.data.message);
      setSuccess(false);
    }
  };

  const makeUserAnAdmin = async (e, username) => {
    // console.log(username);
    try {
      setSuccess(true);
      const { data } = await axios.put(`/api/admin/users/makeuser/${username}`);
      setSuccess(false);
      toast.success('success');
    } catch (err) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
      setSuccess(false);
    }
  };

  const removeUserAsAdmin = async (e, username) => {
    console.log(username);
    try {
      setSuccess(true);
      const { data } = await axios.patch(
        `/api/admin/users/makeuser/${username}`,
      );
      setSuccess(false);
      toast.success('success');
    } catch (err) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({
        ...values,
        name: '',
        email: '',
        contactNum: '',
        loading: true,
      });
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/users`, {
        ...values,
      });
      toast.success('Success');
      setValues({
        ...values,
        name: '',
        email: '',
        contactNum: '',
        loading: false,
      });
      setSuccess(false);
    } catch (err) {
      toast.error(err.response.data.message);
      setSuccess(false);
    }
  };

  const setData = () => {
    const data = {
      columns: [
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Contact Number',
          field: 'contactNum',
          sort: 'asc',
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
        },
        {
          label: 'Joined Date',
          field: 'join',
          sort: 'asc',
        },
        {
          label: 'Role',
          field: 'role',
          sort: 'asc',
        },

        {
          label: 'Generated Password',
          field: 'genearatedpassword',
          sort: 'asc',
        },

        {
          label: 'Action',
          field: 'action',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    users &&
      users.forEach((user, index) => {
        data.rows.push({
          name: `${user && user.name}`,
          contactNum: `${user && user.contactNum}`,
          email: `${user && user.email}`,
          join: `${moment(user.createdAt).fromNow()}`,
          role: `${user && user.role}`,
          genearatedpassword: `${
            user && user.generatedPasword ? user.generatedPasword : ''
          }`,
          action: (
            <>
              <div className="row">
                <div className="col-md-6">
                  {user && user.role.includes('admin') ? (
                    <Tooltip title="Remove User as Admin">
                      <span
                        onClick={(e) =>
                          removeUserAsAdmin(e, user && user.username)
                        }
                      >
                        <CoffeeOutlined
                          className="text-danger d-flex justify-content-center "
                          style={{ cursor: 'pointer', fontSize: 25 }}
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Make User as Admin">
                      <span
                        onClick={(e) =>
                          makeUserAnAdmin(e, user && user.username)
                        }
                        // className="pt-1 pl-3"
                      >
                        <CoffeeOutlined
                          className="text-success d-flex justify-content-center "
                          style={{ cursor: 'pointer', fontSize: 25 }}
                        />
                      </span>
                    </Tooltip>
                  )}
                </div>
                <div className="col-md-6">
                  <Tooltip title="Trash User">
                    <span
                      onClick={(e) => moveUserToTrash(e, user && user.username)}
                      // className="pt-1 pl-3"
                    >
                      <DeleteOutlined
                        className="text-danger d-flex justify-content-center "
                        style={{ cursor: 'pointer', fontSize: 25 }}
                      />
                    </span>
                  </Tooltip>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };
  return (
    <Layout title="Manage Staff">
      <AdminRoute>
        <div className="container m-2">
          <div className="row my-4">
            <div className="col-md-3">
              <h1 className="lead">Manage Staff</h1>
            </div>
            <div className="col-md-3">
              <Tooltip title="View Users in Trash">
                <Link href={`/admin/users/trash`}>
                  <a>
                    <Button shape="round" success>
                      Total Users In Active:{' '}
                    </Button>
                    <Badge
                      count={totalInactive}
                      style={{ backgroundColor: '#E7267A' }}
                      className="pb-2 mr-2 my-2 m-1"
                      showZero
                    />
                  </a>
                </Link>
              </Tooltip>
            </div>
            <div className="col-md-6">
              <p
                className="btn text-white float-right btn-success"
                onClick={showModal}
              >
                {' '}
                Add Staff
              </p>
            </div>

            <Modal
              title="Add Staff"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="contactNum"
                    value={values.contactNum}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter contact number"
                    required
                  />
                </div>

                <div className="d-grid gap-2 my-2 ">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={!values.name || !values.email}
                    type="submit"
                  >
                    {values.loading ? <SyncOutlined spin /> : 'Submit'}
                  </button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
        <hr />

        <MDBDataTable
          data={setData()}
          className="px-3"
          bordered
          striped
          hover
        />
      </AdminRoute>
    </Layout>
  );
};

export default ManageUsers;
