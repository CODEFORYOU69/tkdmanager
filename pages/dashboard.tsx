// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardContent from '../components/DashboardContent'; // Assumed component

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default Dashboard;
