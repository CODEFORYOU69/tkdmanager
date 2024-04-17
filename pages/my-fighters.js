// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import MyFightersContent  from '../components/MyFightersContent'; // Assumed component

const MyFighters = () => {
  return (
    <ProtectedRoute>
      <MyFightersContent />
    </ProtectedRoute>
  );
};

export default MyFighters;
