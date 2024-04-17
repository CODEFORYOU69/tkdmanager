// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import MyCoachesContent  from '../components/MyCoachesContent'; // Assumed component

const MyCoaches = () => {
  return (
    <ProtectedRoute>
      <MyCoachesContent />
    </ProtectedRoute>
  );
};

export default MyCoaches;
