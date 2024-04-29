// pages/dashboard.tsx
import ProtectedRoute from '../components/ProtectedRoute';
import MyCompetitionDayContent  from '../components/MyCompetitionsDayContent'; // Assumed component


export async function getServerSideProps(context) {
  const token = context.req.cookies.token;
    const baseUrl = process.env.FRONTEND_URL;
    
    const competitionsRes = await fetch(`${baseUrl}/api/competitions`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const competitions = await competitionsRes.json();

    return {
        props: { competitions }, // will be passed to the page component as props
    }
}

const CompetitionDay = ({competitions}) => {
  return (
    <ProtectedRoute>
      <MyCompetitionDayContent competitions={competitions} />
    </ProtectedRoute>
  );
};

export default CompetitionDay;
