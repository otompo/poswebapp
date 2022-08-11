import AdminRoute from '../../components/routes/AdminRoutes';
import Dashboard from '../../components/admin/Dashboard';
import Layout from '../../components/layout/Layout';

const AdminIndex = () => {
  return (
    <Layout title="Admin Dashboard">
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    </Layout>
  );
};

export default AdminIndex;
