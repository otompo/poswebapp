import React, { useContext, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Tooltip, Badge, Button } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminRoute from '../routes/AdminRoutes';
import { AuthContext } from '../../context';

function ManageTrashUsers(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const router = useRouter();
  const [users, setUsers] = useState('');
  const [trash, setTrash] = useState('');
  const [success, setSuccess] = useState(false);
  const [totalInactive, setTotalInactive] = useState('');

  useEffect(() => {
    getAllUsersInTrash();
    getTotalUsersInTrash();
  }, [auth?.token, success]);

  const getAllUsersInTrash = async () => {
    try {
      const { data } = await axios.get(`/api/admin/users/trash`);
      setUsers(data);
    } catch (err) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
    }
  };

  const getTotalUsersInTrash = async () => {
    try {
      const { data } = await axios.get(`/api/admin/users/inactive`);
      setTotalInactive(data);
    } catch (err) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
    }
  };
  const moveUserFromTrash = async (e, username) => {
    try {
      setSuccess(true);
      const { data } = await axios.patch(`/api/admin/users/trash/${username}`);
      setSuccess(false);
      toast.success('User move to trash');
    } catch (err) {
      // console.log(err);
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
          label: 'contact Number',
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
                  <Tooltip title="Move user from trash">
                    <span
                      onClick={(e) =>
                        moveUserFromTrash(e, user && user.username)
                      }
                      // className="pt-1 pl-3"
                    >
                      <CoffeeOutlined
                        className="text-success d-flex justify-content-center "
                        style={{ cursor: 'pointer', fontSize: 25 }}
                      />
                    </span>
                  </Tooltip>
                </div>
                <div className="col-md-6"></div>
              </div>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Trash Staff">
      <AdminRoute>
        <div className="container m-2">
          <div className="row my-4">
            <div className="col-md-3">
              <h1 className="lead">Manage staff in trash</h1>
            </div>
            <div className="col-md-3">
              <Link href={`/admin/users`} className="bg-primary">
                <Button shape="round" success>
                  TOTAL INACTIVE STAFF:{' '}
                </Button>
                <Badge
                  count={totalInactive}
                  style={{ backgroundColor: '#E7267A' }}
                  className="pb-2 mr-2 my-2 m-1"
                  showZero
                />
              </Link>
            </div>
            <div className="col-md-6">
              {/* <p className="btn text-white float-right btn-success">
                {" "}
                Add Staff
              </p> */}
            </div>
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
}

export default ManageTrashUsers;
