import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { Button, Modal, Spin } from 'antd';
import React, { useRef, useEffect, useState, useContext } from 'react';
import AdminRoute from '../../components/routes/AdminRoutes';
import Layout from '../../components/layout/Layout';
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
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context';

const { confirm } = Modal;

function ManageAllPurchaseProducts(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startdate, enddate] = dateRange;
  const [productsPurchase, setProductsPurchase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ok, setOk] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [actionTriggered, setActionTriggered] = useState('');
  const [currentProduct, setCurrentProduct] = useState([]);
  const [currentInvoiceID, setCurrentInvoiceID] = useState('');
  const [quantity, setQuantity] = useState(null);

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  const {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
  } = useSettings();

  /**
   *
   * @param id - The id of the product
   * @param addedQuantity - The current unit price of the product
   */
  const onEdit = ({ id, addedQuantity }) => {
    setInEditMode({
      status: true,
      rowKey: id,
    });
    setQuantity(addedQuantity);
  };

  const onCancel = () => {
    // reset the inEditMode state value
    setInEditMode({
      status: false,
      rowKey: null,
    });
    // reset the unit price state value
    setQuantity(null);
  };

  const showPrintData = (purchase) => {
    setCurrentInvoiceID(purchase.invoiceID);
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
  }, [auth?.token, success]);

  /**
   * @param id
   * @param newQuantity
   */
  const handleUpdateQuantity = async ({
    slug,
    newQuantity,
    previousQuantity,
    purchaseId,
  }) => {
    try {
      setOk(true);
      setSuccess(true);
      const { data } = await axios.put(
        `/api/admin/products/purchase/update/${slug}`,
        {
          purchaseId,
          previousQuantity,
          newQuantity,
          currentInvoiceID,
        },
      );
      toast.success('success');
      setOk(false);
      setSuccess(false);
    } catch (error) {
      console.log(error);
      setOk(false);
      setSuccess(false);
    }
  };

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

  const handleDelete = async (purchaseId) => {
    try {
      setSuccess(true);
      const { data } = axios.delete(
        `/api/admin/products/purchase/delete/${purchaseId}`,
      );
      setTempData((temp) => {
        const index = temp.findIndex((l) => l._id === purchaseId);
        temp.splice(index, 1);
        return [...temp];
      });
      // setTempData((temp) => {
      //   const index = temp.findIndex((l) => l._id === purchaseId);
      //   temp.splice(index, 1);
      //   return [...temp];
      // });
      toast.success('success');
      setSuccess(false);
    } catch (err) {
      console.log(err);
      setSuccess(false);
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

        // {
        //   label: 'Added Grand Total Quantity',
        //   field: 'grandTotalQuantity',
        //   sort: 'asc',
        // },

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
                  <h6 className="d-inline pl-4">Added Quantity: </h6>
                  {product.count}{' '}
                  <h6 className="d-inline pl-2">New Quantity: </h6>{' '}
                  {product.count + product.quantity}
                  <br />
                </span>
              ))}
            </span>
          ),

          date: moment(purchase.purchaseTime).format('ll'),
          grandTotalQuantity: purchase.grandQuantity,

          action: (
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      setActionTriggered('ACTION_2');
                      showPrintData(purchase);
                    }}
                  >
                    <PrinterOutlined style={{ fontSize: 25 }} />
                  </button>
                </div>
                {/* <div className="col-md-4">
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => handleDelete(purchase._id)}
                  >
                    <DeleteOutlined style={{ fontSize: 25 }} />
                  </button>
                </div> */}
                <div className="col-md-6">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setActionTriggered('ACTION_3');
                      showPrintData(purchase);
                      setCurrentProduct(purchase.products);
                    }}
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
    <Layout title="All Purchased Products">
      <AdminRoute>
        <div className="row my-3">
          <div className="col-md-10">
            <h1 className="lead text-uppercase">All Products Purchased</h1>
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
          </div>
        </div>
        <Modal
          title={
            actionTriggered == 'ACTION_1'
              ? 'Print invoice'
              : actionTriggered == 'ACTION_2'
              ? 'Print Invoice'
              : 'Edit Purchased Products'
          }
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
          ) : actionTriggered == 'ACTION_2' ? (
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
          ) : (
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  {/* <h1>Simple Inventory Table</h1> */}
                  {/* <pre>{JSON.stringify(currentProduct, null, 4)}</pre> */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Added Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProduct.map((item) => (
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>
                            {inEditMode.status &&
                            inEditMode.rowKey === item._id ? (
                              <input
                                value={quantity}
                                className="form-control"
                                onChange={(event) =>
                                  setQuantity(event.target.value)
                                }
                                style={{ width: '50%' }}
                              />
                            ) : (
                              item.count
                            )}
                          </td>
                          <td>
                            {inEditMode.status &&
                            inEditMode.rowKey === item._id ? (
                              <React.Fragment>
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    handleUpdateQuantity({
                                      slug: item.slug,
                                      id: item._id,
                                      previousQuantity: item.quantity,
                                      purchaseId: item.purchaseId,
                                      newQuantity: quantity,
                                    })
                                  }
                                >
                                  {ok ? <Spin /> : 'Save'}
                                  {/* Save */}
                                </button>

                                <button
                                  className="btn btn-secondary"
                                  style={{ marginLeft: 8 }}
                                  onClick={() => onCancel()}
                                >
                                  Cancel
                                </button>
                              </React.Fragment>
                            ) : (
                              <button
                                className={'btn btn-primary'}
                                onClick={() =>
                                  onEdit({
                                    id: item._id,
                                    addedQuantity: item.count,
                                  })
                                }
                              >
                                Edit
                              </button>
                            )}
                          </td>
                          <td />
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
