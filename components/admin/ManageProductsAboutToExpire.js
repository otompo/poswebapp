import React, { useRef, useEffect, useState } from 'react';
import { Modal } from 'antd';
import {
  PrinterOutlined,
  CheckOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import { MDBDataTable } from 'mdbreact';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import Loader from '../layout/Loader';
import FormatCurrency from '../FormatCurrency';
import ReactToPrint from 'react-to-print';

const { confirm } = Modal;

const ManageProductsAboutToExpire = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProductsAboutToExpire();
  }, []);

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

  const handlePrint = () => {
    window.print();
  };

  const loadProductsAboutToExpire = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/products/productsabouttoexpired`,
      );
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
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

        // {
        //   label: 'Action',
        //   field: 'action',
        //   sort: 'asc',
        // },
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
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Products About To Expire">
      <AdminRoute>
        <div className="row my-3">
          <div className="col-md-10">
            <h1 className="lead">Manage Products About To Expire</h1>
          </div>
          <div className="col-md-2">
            <button className="btn btn-info mx-2" onClick={showPrintData}>
              <PrinterOutlined style={{ fontSize: 25 }} />
            </button>
          </div>
        </div>

        <hr />
        {loading ? (
          <Loader />
        ) : (
          <MDBDataTable
            data={setData()}
            className="px-3"
            bordered
            striped
            hover
          />
        )}
        <Modal
          title="ABOUT EXPIRE PRODUCTS"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          <div className="invoice__preview bg-white  rounded">
            <div ref={componentRef} className="p-5" id="invoice__preview">
              <h5>LIST OF ABOUT TO EXPIRE PRODUCTS</h5>

              <table width="100%" className="mb-10 table table-striped">
                <thead>
                  <tr className="bg-gray-100 p-1">
                    <td className="font-bold">Name</td>
                    <td className="font-bold">Quantity</td>
                    <td className="font-bold">Expire</td>
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

export default ManageProductsAboutToExpire;
