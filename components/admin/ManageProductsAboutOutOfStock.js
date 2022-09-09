import React, { useRef, useEffect, useState, useContext } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Badge, Button, Modal, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import AdminRouter from '../routes/AdminRoutes';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../layout/Loader';
import Layout from '../layout/Layout';
import ReactToPrint from 'react-to-print';
import { CartContext } from '../../context/cartContext';
import PurchaseCart from '../PurchaseCart';
import { addToPurchase } from '../../actions/Actions';
import Link from 'next/link';
import { PrinterOutlined } from '@ant-design/icons';
import useSettings from '../../hooks/useSettings';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { AuthContext } from '../../context';

const { confirm } = Modal;

function ManageProductsAboutOutOfStock(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const { state, dispatch } = useContext(CartContext);
  const { cart } = state;
  const [products, setProducts] = useState([]);
  const [grandQuantity, setGrandQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [purchase, setProductsPurchase] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [count, setCount] = useState(false);

  const {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
  } = useSettings();

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const getgrandQuantity = () => {
      const res = cart.reduce((prev, item) => {
        setCount(item.count);
        return prev + item.count;
      }, 0);

      setGrandQuantity(res);
    };
    getgrandQuantity();
  }, [cart]);

  useEffect(() => {
    loadProductsAboutOutOfStock();
    showPurchaseProducts();
  }, [auth?.token, success]);

  const componentRef = useRef();

  const showPurchaseProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/purchase/limit`);
      setProductsPurchase(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const loadProductsAboutOutOfStock = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/aboutoutstock`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/products/purchase`, {
        cart,
        grandQuantity,
      });
      dispatch({ type: 'ADD_CART', payload: [] });
      toast.success('Success');
      setLoading(false);
      setSuccess(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
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
          label: 'Quantity',
          field: 'quantity',
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
          quantity: `${product.quantity}`,

          action: (
            <>
              <div className="container">
                <div className="row">
                  <div className="col-md-2">
                    <Button
                      type="primary"
                      shape="round"
                      size={20}
                      disabled={product.quantity < 0}
                      onClick={() => dispatch(addToPurchase(product, cart))}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Products About To Go OutOf Stock">
      <AdminRouter>
        <div className="container-fluid">
          <div className="row my-3">
            <div className="col-md-5">
              <h1 className="lead text-uppercase">
                Products About To Go OutOf Stock
              </h1>
            </div>
            <div className="col-md-2">
              <Badge count={cart && cart.length ? cart.length : 0} showZero>
                <ShoppingCartOutlined style={{ fontSize: '40px' }} />
              </Badge>
            </div>

            <div className="col-md-3">
              <Link
                href={`/admin/products/purchase/view`}
                className="bg-primary"
              >
                <a>
                  <Button shape="round" type="primary">
                    VIEW ALL PURCHASED PRODUCTS{' '}
                  </Button>
                </a>
              </Link>
            </div>

            <div className="col-md-2">
              {/* <button
                className="btn btn-dark mx-5"
                onClick={handleSubmit}
                disabled={cart.length === 0}
              >
                
                {loading ? <Spin /> : 'Submit'}
              </button> */}
              <button
                className="btn btn-info mx-2"
                onClick={() => {
                  setIsModalVisible(true);
                }}
              >
                <PrinterOutlined style={{ fontSize: 25 }} />
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-7">
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
            </div>
            <div className="col-md-4 mr-2">
              {cart.map((item) => (
                <PurchaseCart
                  key={item._id}
                  item={item}
                  dispatch={dispatch}
                  cart={cart}
                />
              ))}

              {cart.length ? (
                <button
                  className="btn btn-dark mx-4 btn-block"
                  onClick={handleSubmit}
                  disabled={count <= 0}
                >
                  {loading ? <Spin /> : 'Submit'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </AdminRouter>
      <Modal
        title="Print Invoice"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <div className="invoice__preview bg-white  rounded">
          <div ref={componentRef} className="p-5" id="invoice__preview">
            {/* {company &&
                company.map((item) => (
                  <p className="c_logo" key={item._id}>
                    {item.logo ? (
                      <Avatar size={90} src={item && item.logo} />
                    ) : (
                      <Avatar size={90} src={item && item.logoDefualt} />
                    )}
                  </p>
                ))} */}

            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <ul>
                    <li>
                      <h2 className="text-uppercase text-bold">{name}</h2>
                    </li>
                    <li>
                      <h6 className="d-inline">Email:</h6> {email}
                    </li>
                    <li>
                      <h6 className="d-inline">Contact:</h6> {contactNumber}
                    </li>
                    <li>
                      <h6 className="d-inline">Address:</h6> {address}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <hr />

            <article className="mt-10 mb-14 flex items-end justify-end">
              <h4 className="text-uppercase text-bold">Purchased Products</h4>
              {purchase.map((item, i) => (
                <ul key={i}>
                  <li className="p-1 ">
                    <h6 className="d-inline">Invoice Number:</h6>{' '}
                    <span className="text-uppercase text-bold">
                      {' '}
                      {item.invoiceID}
                    </span>
                  </li>

                  <li className="p-1 bg-gray-100">
                    <h6 className="d-inline">Invoice Date:</h6>{' '}
                    {moment(item.createdAt).format('ddd LL')}
                  </li>
                </ul>
              ))}
            </article>

            <table width="100%" className="mb-10 table table-striped">
              <thead>
                <tr className="bg-gray-100 p-1">
                  <td className="font-bold">Name</td>
                  <td className="font-bold">Previous Quantity</td>
                  <td className="font-bold">Added Quantity</td>
                  <td className="font-bold">New Quantity</td>
                </tr>
              </thead>

              {purchase &&
                purchase.map((item) =>
                  item.products.map((product) => (
                    <tbody key={product._id}>
                      <tr className="h-10">
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>{product.count}</td>
                        <td>{product.count + product.quantity}</td>
                      </tr>
                    </tbody>
                  )),
                )}
            </table>

            <div className="container">
              <div className="row mt-3">
                <div className="col-md-12 text-center">
                  Remarks:<h6>All amounts only keep two decimal places</h6>
                </div>
              </div>
            </div>
            <p className="descreption">
              <span className="lead" style={{ fontSize: '15px' }}>
                {renderHTML(description)}
              </span>
            </p>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-4 offset-md-4">
                <ReactToPrint
                  trigger={() => (
                    <button className="btn btn-primary float-right">
                      Print / Download
                    </button>
                  )}
                  content={() => componentRef.current}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default ManageProductsAboutOutOfStock;
