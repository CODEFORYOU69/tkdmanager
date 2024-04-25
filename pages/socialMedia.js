// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import SocialMedia  from '../components/SocialMediaContent'; // Assumed component

const MyFighters = () => {
  return (
    <ProtectedRoute>
      <SocialMedia />
    </ProtectedRoute>
  );
};

export default MyFighters;
