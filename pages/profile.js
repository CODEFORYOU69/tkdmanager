// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import ProfileContent  from '../components/ProfileContent'; // Assumed component

const MyCompetitions = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default MyCompetitions;
