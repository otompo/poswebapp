import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Modal } from 'antd';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
  EditFilled,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../layout/Loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FormatCurrency from '../FormatCurrency';

const { confirm } = Modal;

const ManageExpenses = () => {
  const [values, setValues] = useState({
    name: '',
    amount: '',
    loading: false,
  });

  const [success, setSuccess] = useState(false);
  const [ok, setOk] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [actionTriggered, setActionTriggered] = useState('');
  const [current, setCurrent] = useState({});

  var previousDate = moment(current.date).format('MMM Do, Y');

  // const [selectedDate, setSelectedDate] = useState(
  //   Date(previousDate).toDateString,
  // );

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    showExpenses();
  }, [success]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const showExpenses = async () => {
    try {
      setValues({ ...values, loading: true });
      setOk(true);
      const { data } = await axios.get(`/api/admin/expenses`);
      setExpenses(data);
      setValues({ ...values, loading: false });
      setOk(false);
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      setOk(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, loading: true });
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/expenses`, {
        ...values,
        expenseDate,
      });
      toast.success('Success');
      setValues({ ...values, name: '', amount: '', loading: false });
      setSuccess(false);
      setIsModalVisible(false);
    } catch (err) {
      console.log(err);
      setSuccess(false);
    }
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    try {
      setSuccess(true);
      const { data } = await axios.put(
        `/api/admin/expenses/${current && current.slug}`,
        current,
      );
      setSuccess(false);
      setIsModalVisible(false);
      toast.success('success');
    } catch (err) {
      console.log(err);
      setSuccess(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      confirm({
        title: `Are you sure delete this  expenses`,
        icon: <ExclamationCircleOutlined />,
        content: 'It will be deleted permanentily if you click Yes',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',

        onOk() {
          setValues({ ...values, loading: true });
          let allExpenses = expenses;
          const removed = allExpenses.splice(index, 1);
          setExpenses(allExpenses);
          // send request to server
          const { data } = axios.delete(
            `/api/admin/expenses/delete/${removed[0]._id}`,
          );
          toast.success('Deleted Successfully');
          setValues({ ...values, loading: false });
        },
        onCancel() {
          return;
        },
      });
    } catch (err) {
      toast.error(err);
      setValues({ ...values, loading: false });
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
          label: 'Amount',
          field: 'amount',
          sort: 'asc',
        },
        {
          label: 'Date',
          field: 'date',
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

    expenses &&
      expenses.forEach((expense, index) => {
        data.rows.push({
          name: `${expense && expense.name}`,
          amount: `${FormatCurrency(Number(expense.amount))}`,
          date: `${moment(expense.date).format('LL')}`,

          action: (
            <>
              <div className="row">
                <div className="col-md-6">
                  <span
                    onClick={() => {
                      setCurrent(expense);
                      setIsModalVisible(true);
                      setActionTriggered('ACTION_2');
                    }}
                  >
                    <EditFilled
                      className="text-success d-flex justify-content-center "
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                    />
                  </span>
                </div>
                <div className="col-md-6">
                  <span onClick={() => handleDelete(index)}>
                    <DeleteOutlined
                      className="text-danger d-flex justify-content-center "
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                    />
                  </span>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Expenses">
      <AdminRoute>
        <div className="container m-2">
          <div className="row">
            <div className="col-md-4">
              <h1 className="lead text-uppercase">Manage Expenses</h1>
            </div>
            <div className="col-md-4 offset-md-2">
              <p
                className="btn text-white float-right btn-success"
                onClick={() => {
                  setIsModalVisible(true);
                  setActionTriggered('ACTION_1');
                }}
              >
                {' '}
                Add New Expenses
              </p>
            </div>
          </div>
        </div>

        <hr />
        {ok ? (
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
          title={
            actionTriggered == 'ACTION_1' ? (
              <span>+ Add Expense</span>
            ) : (
              <span>Edit Expense</span>
            )
          }
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          {actionTriggered == 'ACTION_1' ? (
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
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  className="form-control mb-4 p-2"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="form-group">
                <DatePicker
                  className="w-100"
                  selected={expenseDate}
                  onChange={(date) => setExpenseDate(date)}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="d-grid gap-2 my-2 ">
                <button
                  className="btn btn-primary btn-block"
                  disabled={!values.name || !values.amount}
                  type="submit"
                >
                  {values.loading ? <SyncOutlined spin /> : 'Submit'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdateExpense}>
              <div className="form-group">
                <input
                  type="text"
                  value={current.name}
                  onChange={(e) =>
                    setCurrent({ ...current, name: e.target.value })
                  }
                  className="form-control mb-4 p-2"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={current.amount}
                  onChange={(e) =>
                    setCurrent({ ...current, amount: e.target.value })
                  }
                  className="form-control mb-4 p-2"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="form-group">
                <DatePicker
                  className="w-100"
                  // selected={selectedDate}
                  dateFormat="MMMM d, yyyy"
                  maxDate={new Date()}
                  onChange={(date) => setCurrent({ ...current, date })}
                  value={previousDate}
                  isClearable
                  placeholderText="Selecte Date"
                />
              </div>
              <div className="d-grid gap-2 my-2 ">
                <button
                  className="btn btn-primary btn-block"
                  // disabled={!current.name || !current.amount}
                  type="submit"
                >
                  {/* {values.loading ? <SyncOutlined spin /> : "Save"} */}
                  Save
                </button>
              </div>
            </form>
          )}
        </Modal>
        {/* <pre>{JSON.stringify(categories, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageExpenses;
