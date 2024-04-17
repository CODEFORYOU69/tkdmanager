// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import MyCompetitionDayContent  from '../components/MyCompetitionsDayContent'; // Assumed component

const CompetitionDay = () => {
  return (
    <ProtectedRoute>
      <MyCompetitionDayContent />
    </ProtectedRoute>
  );
};

export default CompetitionDay;
