import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import { MDBDataTable } from 'mdbreact';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import FormatCurrency from '../FormatCurrency';
import { AuthContext } from '../../context';

const { confirm } = Modal;
const ManageProductsInstock = () => {
  const [auth, setAuth] = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    loadProductsInStock();
  }, [auth?.token, success]);

  const loadProductsInStock = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/instock`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const loadModalData = (name, slug, quantity) => {
    let tempData = [name, quantity, slug];
    setTempData((item) => [...tempData]);
    // console.log(tempData);
    return showModal();
  };

  let currentQty = tempData[1];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSuccess(true);
      const { data } = await axios.put(
        `/api/admin/products/outofstock/update/${tempData[2]}`,
        {
          quantity,
          currentQty,
        },
      );
      toast.success('Success');
      setQuantity('');
      setSuccess(false);
      setIsModalVisible(false);
    } catch (err) {
      toast.error(err.response.data);
      setSuccess(false);
      setQuantity('');
    }
  };

  const handleMakeProductInactive = async (e, slug) => {
    e.preventDefault();
    try {
      setSuccess(true);
      const { data } = await axios.patch(
        `/api/admin/products/available/${slug}`,
      );
      toast.success('Success');
      setSuccess(false);
    } catch (err) {
      toast.error(err);
      setSuccess(false);
    }
  };

  const handleMakeProductActive = async (e, slug) => {
    e.preventDefault();
    setSuccess(true);
    try {
      const { data } = await axios.put(`/api/admin/products/available/${slug}`);
      toast.success('Success');
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
          label: 'Category',
          field: 'category',
          sort: 'asc',
        },
        {
          label: 'Quantity',
          field: 'quantity',
          sort: 'asc',
        },
        {
          label: 'Cost Price',
          field: 'costPrice',
          sort: 'asc',
        },
        {
          label: 'Selling Price',
          field: 'sellingPrice',
          sort: 'asc',
        },
        {
          label: 'Expire Date',
          field: 'expireDate',
          sort: 'asc',
        },
        {
          label: 'Created At',
          field: 'createdat',
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

    products &&
      products.forEach((product, index) => {
        data.rows.push({
          name: `${product.name}`,
          category: `${
            product &&
            product.category &&
            product.category.map((c, i) => `${c && c.name}`)
          }`,
          quantity: `${product.quantity}`,
          costPrice: `${FormatCurrency(Number(product.costPrice))}`,
          sellingPrice: `${FormatCurrency(Number(product.sellingPrice))}`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
          createdat: `${moment(product.createdAt).fromNow()}`,
          action: (
            <>
              <div className="row">
                <div className="col-md-6">
                  {product && product.active ? (
                    <span
                      onClick={(e) => handleMakeProductActive(e, product.slug)}
                    >
                      <CheckOutlined
                        className="text-success d-flex justify-content-center "
                        style={{ cursor: 'pointer', fontSize: 25 }}
                      />
                    </span>
                  ) : (
                    <span
                      onClick={(e) =>
                        handleMakeProductInactive(e, product.slug)
                      }
                    >
                      <CloseCircleOutlined
                        className="text-danger d-flex justify-content-center "
                        style={{ cursor: 'pointer', fontSize: 25 }}
                      />
                    </span>
                  )}
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Products Instock">
      <AdminRoute>
        <h1 className="lead">Manage Products Instock</h1>

        <hr />
        {/* {loading ? (
          <Loader />
        ) : ( */}
        <MDBDataTable
          data={setData()}
          className="px-3"
          bordered
          striped
          hover
        />
        {/* )} */}
        <Modal
          title={`Update ${tempData[0]} Quantity`}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          // width={300}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="number"
                // name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control mb-4 p-2"
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="d-grid gap-2 my-2 ">
              <button
                className="btn btn-primary"
                // disabled={!values.name || loading}
                type="submit"
              >
                {/* {ok ? <SyncOutlined spin /> : 'Submit'} */}
                Update
              </button>
            </div>
          </form>
          {/* <pre>{JSON.stringify(tempData, null, 4)}</pre> */}
        </Modal>
        {/* <pre>{JSON.stringify(inStock, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageProductsInstock;
