import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { Button, Modal } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import AdminRoute from '../../components/routes/AdminRoutes';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/layout/Loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  PrinterOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import useSettings from '../../hooks/useSettings';
import renderHTML from 'react-render-html';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
const { confirm } = Modal;

function ManageAllPurchaseProducts(props) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startdate, enddate] = dateRange;
  const [productsPurchase, setProductsPurchase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [actionTriggered, setActionTriggered] = useState('');

  const {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
  } = useSettings();

  const showPrintData = (purchase) => {
    let tempData = [purchase];
    setTempData((item) => [...tempData]);
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
    handlePurcahaseSubmit();
  }, []);

  const handlePurcahaseSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/products/purchase/productspurchasebydate?startdate=${moment(
          startdate,
        ).format('Y/MM/DD')}&enddate=${moment(enddate).format('Y/MM/DD')}`,
      );
      setProductsPurchase(data.docs);
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
          label: 'Products Name',
          field: 'productsname',
          sort: 'asc',
        },
        {
          label: 'Date',
          field: 'date',
          sort: 'asc',
        },

        {
          label: 'Added Grand Total Quantity',
          field: 'grandTotalQuantity',
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

    productsPurchase &&
      productsPurchase.forEach((purchase, index) => {
        data.rows.push({
          productsname: (
            <span>
              {purchase.products.map((product) => (
                <span key={product._id}>
                  <h6 style={{ color: '#e74c3c' }}>{product.name}</h6>
                  <h6 className="d-inline pl-4">Previous Quantity: </h6>
                  {product.quantity}{' '}
                  <h6 className="d-inline pl-2">Added Quantity: </h6>{' '}
                  {product.count}
                  <h6 className="d-inline pl-2">New Quantity: </h6>{' '}
                  {product.count + product.quantity}
                  <br />
                </span>
              ))}
            </span>
          ),

          date: moment(purchase.createdAt).format('ll'),
          grandTotalQuantity: purchase.grandQuantity,

          action: (
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-4">
                  <button
                    className="btn btn-info mx-2"
                    onClick={() => showPrintData(purchase)}
                  >
                    <PrinterOutlined style={{ fontSize: 25 }} />
                  </button>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => showPrintData(purchase)}
                  >
                    <DeleteOutlined style={{ fontSize: 25 }} />
                  </button>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-success mx-2"
                    onClick={() => showPrintData(purchase)}
                  >
                    <EditOutlined style={{ fontSize: 25 }} />
                  </button>
                </div>
              </div>
            </div>
          ),
        });
      });

    return data;
  };

  return (
    <Layout>
      <AdminRoute>
        <div className="row my-3">
          <div className="col-md-10">
            <h1 className="lead">Products Purchased</h1>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info mx-2"
              onClick={() => {
                setIsModalVisible(true);
                setActionTriggered('ACTION_1');
              }}
            >
              <PrinterOutlined style={{ fontSize: 25 }} />
            </button>
          </div>
        </div>

        <hr />
        <div className="row my-2">
          <div className="col-md-6  offset-md-2 text-center">
            <h4 className="lead mb-4">
              SELECT START AND END DATE FOR PRODUCTS PURCHASED
            </h4>
            <div className="row">
              <div className="col-md-8">
                <DatePicker
                  selectsRange={true}
                  className="w-100"
                  startDate={startdate}
                  endDate={enddate}
                  dateFormat="MMMM d, yyyy"
                  onChange={(update) => {
                    setDateRange(update);
                  }}
                  isClearable={true}
                  withPortal
                />
              </div>
              <div className="col-md-4">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handlePurcahaseSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
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
            </div>
          </div>
        </div>
        <Modal
          title="Print Invoice"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          {actionTriggered == 'ACTION_1' ? (
            <div className="invoice__preview bg-white  rounded">
              <div ref={componentRef} className="p-5" id="invoice__preview">
                <h5 className="text-uppercase">
                  LIST OF PRODUCTS PURCHASED FROM
                  <br />
                  <span className="text-primary">
                    {moment(startdate).format('LL')} TO{' '}
                    {moment(enddate).format('LL')}
                  </span>
                </h5>
                <table width="100%" className="mb-10 table table-striped">
                  <thead>
                    <tr className="bg-gray-100 p-1">
                      <td className="font-bold">Name</td>
                      <td className="font-bold">Previous Quantity</td>
                      <td className="font-bold">Added Quantity</td>
                      <td className="font-bold">New Quantity</td>
                    </tr>
                  </thead>
                  {productsPurchase &&
                    productsPurchase.map((purchase, i) => (
                      <>
                        {purchase.products.map((product) => (
                          <tbody key={product._id}>
                            <tr>
                              <td>{product.name}</td>
                              <td> {product.quantity}</td>
                              <td> {product.count}</td>
                              <td>{product.quantity + product.count}</td>
                            </tr>
                          </tbody>
                        ))}
                      </>
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
          ) : (
            <div className="invoice__preview bg-white  rounded">
              <div ref={componentRef} className="p-5" id="invoice__preview">
                {/* <p className="c_logo" key={item._id}>
                      {item.logo ? (
                        <Avatar size={90} src={item && item.logo} />
                      ) : (
                        <Avatar size={90} src={item && item.logoDefualt} />
                      )}
                    </p> */}
                <div className="container">
                  <div className="row">
                    <div className="col-md-8">
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
                  <h4 className="text-uppercase text-bold">
                    Purchased Products
                  </h4>
                  {tempData.map((temp) => (
                    <ul key={temp._id}>
                      <li className="p-1 ">
                        <h6 className="d-inline">Invoice Number:</h6>{' '}
                        <span className="text-uppercase text-bold">
                          {' '}
                          {temp.invoiceID}
                        </span>
                      </li>

                      <li className="p-1 bg-gray-100">
                        <h6 className="d-inline">Invoice Date:</h6>{' '}
                        {moment(temp.purchaseTime).format('ddd LL')}
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

                  {tempData &&
                    tempData.map((temp) =>
                      temp.products.map((product) => (
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
          )}
        </Modal>
      </AdminRoute>
    </Layout>
  );
}

export default ManageAllPurchaseProducts;
