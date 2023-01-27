import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { Line } from 'react-chartjs-2';
import Loader from '../layout/Loader';
import moment from 'moment';
import useNumbers from '../../hooks/useNumbers';
import FormatCurrency from '../../helpers/FormatCurrency';
import { AuthContext } from '../../context';

const Dashboard = ({ children }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState('');
  const [dailySales, setDailySales] = useState([]);
  const { users, categories, products } = useNumbers();

  useEffect(() => {
    getTotalSales();
    showDailySales();
  }, [auth?.token]);

  const showDailySales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/statistics/monthlyplan`);
      setDailySales(data.dailySales);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getTotalSales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/getNumbers/sales`);

      setTotalSales(data.totalSales);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: dailySales.map((x) => [moment(x._id).format('LL')]),
    datasets: [
      {
        data: dailySales.map((x) => x.totalSales),
        label: 'Total Sales',
        borderColor: '#3333ff',
        backgroundColor: '#F2CC59',
        fill: true,
        lineTension: 0.5,
      },
      {
        data: dailySales.map((x) => x.quantitySold),
        label: 'Quantity Sold',
        borderColor: '#ff3333',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        fill: true,
        lineTension: 0.5,
      },
      {
        data: dailySales.map((x) => x.numOfSales),
        label: 'Number Of Sales',
        borderColor: '#F2CC59',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        fill: true,
        lineTension: 0.5,
      },
    ],
  };

  return (
    <>
      <div className="container-fluid" id="admin">
        <div className="row mt-5">
          <Card
            backgroundColor="#33195a"
            cade_title="Total Staff"
            cade_total={users}
          />
          <Card
            backgroundColor="#33195a"
            cade_title="Total Products"
            cade_total={products}
          />

          <Card
            backgroundColor="#33195a"
            cade_title="Total Categories"
            cade_total={categories}
          />
          <Card
            backgroundColor="#33195a"
            cade_title="Total Sales"
            cade_total={FormatCurrency(Number(totalSales))}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              {/* <pre>{JSON.stringify(dailySales, null, 4)}</pre> */}
              <div className="card-title ">
                <h5 className="font-weight-bold text-center">
                  Daily Sales Chart
                </h5>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <Line
                  height={90}
                  options={{
                    legend: {
                      display: true,
                      position: 'right',
                    },
                  }}
                  data={lineChartData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
