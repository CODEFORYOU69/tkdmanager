// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import MyCompetitionsContent  from '../components/MyCompetitionsContent'; // Assumed component

const MyCompetitions = () => {
  return (
    <ProtectedRoute>
      <MyCompetitionsContent />
    </ProtectedRoute>
  );
};

export default MyCompetitions;
