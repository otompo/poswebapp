import React, { useRef, useEffect, useState } from 'react';

import {
  PrinterOutlined,
  CheckOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Modal, Avatar } from 'antd';
import AdminRoute from '../routes/AdminRoutes';
import { MDBDataTable } from 'mdbreact';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../layout/Loader';
import ReactToPrint from 'react-to-print';
import FormatCurrency from '../FormatCurrency';

const { confirm } = Modal;

const ManageProductsExpired = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const showPrintData = () => {
    return showModal();
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

  const componentRef = useRef();

  useEffect(() => {
    loadProductsExpired();
  }, [success]);

  const loadProductsExpired = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/expired`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
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
      toast.error(err.response.data.message);
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
          costPrice: `${FormatCurrency(product.costPrice)}`,
          sellingPrice: `${FormatCurrency(product.sellingPrice)}`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
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
    <Layout title="Manage Products Expired">
      <AdminRoute>
        <div className="row my-3">
          <div className="col-md-10">
            <h1 className="lead">Manage Products Expired</h1>
          </div>
          <div className="col-md-2">
            <button className="btn btn-info mx-2" onClick={showPrintData}>
              <PrinterOutlined style={{ fontSize: 25 }} />
            </button>
          </div>
        </div>
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
          title="EXPIRED PRODUCTS"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          <div className="invoice__preview bg-white  rounded">
            <div ref={componentRef} className="p-5" id="invoice__preview">
              <h5>LIST OF EXPIRED PRODUCTS</h5>

              <table width="100%" className="mb-10 table table-striped">
                <thead>
                  <tr className="bg-gray-100 p-1">
                    <td className="font-bold">Name</td>
                    <td className="font-bold">Quantity</td>
                    <td className="font-bold">Expired Date</td>
                    <td className="font-bold">Category</td>
                  </tr>
                </thead>
                {products.map((product) => (
                  <tbody key={product._id}>
                    <tr className="h-10">
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{moment(product.expireDate).fromNow()}</td>
                      <td>
                        {product.category &&
                          product.category.map((c, i) => (
                            <span key={i}>{c.name}</span>
                          ))}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
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
        {/* <pre>{JSON.stringify(products, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageProductsExpired;
