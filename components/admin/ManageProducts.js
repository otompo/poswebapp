import React, { useEffect, useState, useContext } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Spin, Modal, Select, Button, Tooltip } from 'antd';
import download from 'downloadjs';
import Link from 'next/link';
import {
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import Layout from '../layout/Layout';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import AdminRoute from '../routes/AdminRoutes';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import FormatCurrency from '../FormatCurrency';
import qrcode from 'qrcode';
import DataCard from '../DataCard';
import { AuthContext } from '../../context';
const { confirm } = Modal;
const { Option } = Select;

const ManageProducts = () => {
  const [values, setValues] = useState({
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    loading: false,
  });
  const [products, setProducts] = useState([]);
  const [auth, setAuth] = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ok, setOk] = useState(false);
  const [expireDate, setExpireDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');

  const [loadedCategories, setLoadedCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]); // categories
  const [csvFile, setCsvFile] = useState([]);
  const [totalInStock, setTotalInStock] = useState('');
  const [totalAboutOutStock, setTotalAboutOutStock] = useState('');
  const [totalOutOfStock, setTotalOutOfStock] = useState('');
  const [totalAboutToExpire, setTotalAboutToExpire] = useState('');
  const [totalExpire, setTotalExpire] = useState('');
  const [tempData, setTempData] = useState([]);
  const [qrCodeData, setqrCodeData] = useState('');
  const [actionTriggered, setActionTriggered] = useState('');
  // const [quantity, setQuantity] = useState('');
  const [file, setFile] = useState('');

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    showProducts();
    loadCategories();
    loadTotalInStock();
    loadTotalAboutOutOfStock();
    loadTotalOutOfStock();
    loadTotalAboutToExpire();
    loadTotalExpired();
  }, [auth?.token, success]);

  const genarateQrCode = (product) => {
    let stringdata = JSON.stringify(product);
    qrcode.toDataURL(stringdata).then((data) => {
      setqrCodeData(data);
    });
  };

  const loadTotalInStock = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/instock`);
      setTotalInStock(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalAboutOutOfStock = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/aboutoutstock`);
      setTotalAboutOutStock(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalOutOfStock = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/outofstock`);
      setTotalOutOfStock(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalAboutToExpire = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/products/productsabouttoexpired`,
      );
      setTotalAboutToExpire(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalExpired = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/expired`);
      setTotalExpire(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`/api/admin/category`);
      setLoadedCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const showProducts = async () => {
    try {
      setValues({ ...values, loading: true });
      const { data } = await axios.get(`/api/admin/products`);
      setProducts(data.products);
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err.response.data.message);
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, loading: true });
      setOk(true);
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/products`, {
        ...values,
        selectedCategory,
        expireDate,
      });
      toast.success('Success');
      setValues({
        ...values,
        name: '',
        sellingPrice: '',
        costPrice: '',
        quantity: '',
        loading: false,
      });
      setSuccess(false);
      setOk(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      setSuccess(false);
      setOk(false);
    }
  };

  const handleDelete = (index) => {
    confirm({
      title: `Are you sure delete`,
      icon: <ExclamationCircleOutlined />,
      content: 'It will be deleted permanentily if you click Yes',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk: async () => {
        try {
          //   const answer = window.confirm('Are you sure you want to delete?');
          //   if (!answer) return;
          setLoading(true);
          let allProducts = products;
          const removed = allProducts.splice(index, 1);
          // console.log('removed', removed[0]._id);
          setProducts(allProducts);
          // send request to server
          const { data } = await axios.delete(
            `/api/admin/products/${removed[0]._id}`,
          );
          // console.log('LESSON DELETED =>', data);
          toast.success('Success');
          setLoading(false);
        } catch (err) {
          toast.error(err.response.data.message);
          setLoading(false);
        }
      },
      onCancel() {
        return;
      },
    });
  };

  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    // console.log(all);
    setChecked(all);
    setSelectedCategory(all);
    // formData.set('categories', all);
  };

  const handleDataExport = async () => {
    try {
      const res = (
        await axios.get(`/api/admin/exportdata`, {
          responseType: 'blob',
        })
      ).data;
      if (res) {
        download(res, new Date().toLocaleDateString() + '-data.csv');
      } else {
        alert('Data not found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProductImport = async (e) => {
    e.preventDefault();

    const processCSV = (string, delim = ',') => {
      const csvHeader = string.slice(0, string.indexOf('\r\n')).split(delim);
      const csvRows = string.slice(string.indexOf('\n') + 1).split('\r\n');
      // console.log(csvHeader);
      // console.log(csvRows);
      const array = csvRows.map((i) => {
        const values = i.split(',');
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return obj;
      });

      setCsvFile(array.slice(0, array.length - 1));
    };
    try {
      // setValues({ ...values, loading: true });
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/products/importdata`, {
        csvFile,
      });
      toast.success('Success');
      setSuccess(false);
      // setFile("");
    } catch (err) {
      console.log(err.response);
      setSuccess(false);
    }
    var fileReader = new FileReader();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        processCSV(text);
      };
      fileReader.readAsText(file);
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
          field: 'costprice',
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
          costprice: `${FormatCurrency(Number(product.costPrice))}`,
          sellingPrice: `${FormatCurrency(product.sellingPrice)}`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
          createdat: `${moment(product.createdAt).fromNow()}`,
          action: (
            <>
              <div className="container">
                <div className="row">
                  <Tooltip title={`Edit ${product.name}`} color="green">
                    <div className="col-md-4">
                      <Link href={`/admin/products/${product.slug}`}>
                        <EditOutlined
                          className="text-success d-flex justify-content-center"
                          style={{ cursor: 'pointer', fontSize: 25 }}
                        />
                      </Link>
                    </div>
                  </Tooltip>
                  <div className="col-md-4">
                    <Tooltip title={`Delete ${product.name}`} color="red">
                      <span
                        onClick={() => handleDelete(index)}
                        // className="pt-1 pl-3"
                      >
                        <DeleteOutlined
                          className="text-danger d-flex justify-content-center"
                          style={{ cursor: 'pointer', fontSize: 25 }}
                        />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="col-md-4">
                    <Button
                      type="primary"
                      shape="round"
                      // icon={<UploadOutlined size={35} />}
                      size={35}
                      onClick={() => {
                        setIsModalVisible(true);
                        genarateQrCode(product);
                        setTempData(product);
                      }}
                    >
                      QRCODE
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

  const handleDownload = (e) => {
    e.preventDefault();
    saveAs(qrCodeData, 'image.jpg');
  };

  return (
    <Layout title="Manage Products">
      <AdminRoute>
        <div className="container ourWorks">
          <div className="row  mt-3">
            <div className="col-md-2">
              <Link href="/admin/products/instock">
                <DataCard
                  title="Instock"
                  SubTitle={totalInStock && totalInStock}
                />
              </Link>
            </div>
            <div className="col-md-2">
              <Link href="/admin/products/outofstock">
                <DataCard
                  title="Out Of Stock"
                  SubTitle={totalOutOfStock && totalOutOfStock}
                />
              </Link>
            </div>
            <div className="col-md-2">
              <Link href="/admin/products/aboutofstock">
                <DataCard
                  title="About to go outof Stock"
                  SubTitle={totalAboutOutStock && totalAboutOutStock}
                />
              </Link>
            </div>

            <div className="col-md-2">
              <Link href="/admin/products/abouttoexpire">
                <DataCard
                  title="About to Expire"
                  SubTitle={totalAboutToExpire && totalAboutToExpire}
                />
              </Link>
            </div>
            <div className="col-md-2">
              <Link href="/admin/products/expired">
                <DataCard
                  title="Expired"
                  SubTitle={totalExpire && totalExpire}
                />
              </Link>
            </div>
          </div>
          <hr />
          <div className="row mt-4">
            <div className="col-md-3">
              <p
                className="btn text-white  btn-success block"
                onClick={() => {
                  setIsModalVisible(true);
                  setActionTriggered('ACTION_1');
                }}
              >
                {' '}
                ADD PRODUCT
              </p>
            </div>
            <div className="col-md-4">
              <form>
                <label className="btn btn-primary text-center ">
                  {file && file ? file.name : '  SELECT CSV FILE'}

                  <input
                    type="file"
                    id="csvFile"
                    accept=".csv"
                    onChange={handleOnChange}
                    hidden
                  />
                </label>
                <button
                  className="btn btn-info mb-2"
                  type="primary"
                  onClick={(e) => {
                    handleProductImport(e);
                  }}
                  style={{ marginLeft: 10 }}
                >
                  CLICK TO IMPORT
                </button>
              </form>
            </div>

            <div className="col-md-3">
              <Button
                type="primary"
                shape="round"
                icon={<UploadOutlined size={35} />}
                size={35}
                onClick={() => {
                  handleDataExport();
                }}
              >
                EXPORT CSV DATA
              </Button>
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
        <Modal
          title={
            actionTriggered == 'ACTION_1' ? (
              <span>Add Product</span>
            ) : (
              <>
                <span className="lead text-uppercase">
                  Genarate QRCode for{' '}
                  <span className="text-primary">{tempData.name}</span>
                </span>
              </>
            )
          }
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={actionTriggered == 'ACTION_1' ? 900 : 500}
        >
          {actionTriggered == 'ACTION_1' ? (
            <div className="row">
              <div className="col-md-6">
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
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      className="form-control mb-4 p-2"
                      placeholder="Enter quantity"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="costPrice"
                      value={values.costPrice}
                      onChange={handleChange}
                      className="form-control mb-4 p-2"
                      placeholder="Enter cost price"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="sellingPrice"
                      value={values.sellingPrice}
                      onChange={handleChange}
                      className="form-control mb-4 p-2"
                      placeholder="Enter selling price"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label for="expireDate">Expire Date</label>
                    <DatePicker
                      id="expireDate"
                      className="w-100"
                      selected={expireDate}
                      onChange={(date) => setExpireDate(date)}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      isClearable
                      placeholderText="I have been cleared!"
                    />
                  </div>
                  <div className="d-grid gap-2 my-2 ">
                    <button
                      className="btn btn-primary btn-block"
                      disabled={
                        !values.name ||
                        !values.costPrice ||
                        !values.sellingPrice ||
                        !expireDate ||
                        loading
                      }
                      type="submit"
                    >
                      {ok ? <SyncOutlined spin /> : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <h1 className="lead  ml-2">Categories</h1>
                <hr />
                <div className="row">
                  <div className="col-md-12">
                    {/* <ul>{showCategories()}</ul> */}
                    <Select
                      allowClear={true}
                      placeholder="Select Category"
                      style={{ width: '100%' }}
                      onChange={(v) => setSelectedCategory(v)}
                      mode="multiple"
                    >
                      {loadedCategories &&
                        loadedCategories.map((item) => (
                          <Option key={item._id}>{item.name}</Option>
                        ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <img src={qrCodeData} width="100%" height="100%" />
                </div>

                <div className="d-grid gap-2 my-2 text-center">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={handleDownload}
                  >
                    DOWNLOAD QRCODE
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </AdminRoute>
    </Layout>
  );
};

export default ManageProducts;
