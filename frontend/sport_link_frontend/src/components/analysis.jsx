import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analysis = ({ user }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await fetch(`/api/users/same-loved-sport`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`, // Pass the user's token for authentication
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const otherUsers = await response.json();
        console.log("Other Users Data: ", otherUsers);

        // Calculate total matches played by the logged-in user
        const currentUserTotalMatches = user.sportsParticipation.reduce(
          (sum, participation) => sum + participation.numberOfMatches,
          0
        );

        // Calculate average total matches played by other users
        const otherUsersTotalMatches = otherUsers.reduce((sum, otherUser) => {
          return (
            sum +
            otherUser.sportsParticipation.reduce(
              (userSum, participation) =>
                userSum + participation.numberOfMatches,
              0
            )
          );
        }, 0);
        const otherUsersAverageMatches =
          otherUsers.length > 0
            ? otherUsersTotalMatches / otherUsers.length
            : 0;

        // Prepare chart data
        setChartData([
          { name: "You", totalMatches: currentUserTotalMatches },
          { name: "Other Users (Avg)", totalMatches: otherUsersAverageMatches },
        ]);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalMatches" fill="#8884d8" name="Total Matches" />
      </BarChart>
    </ResponsiveContainer>
  );
};

Analysis.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired, // Ensure the user object has a token string
    sportsParticipation: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number.isRequired,
        numberOfMatches: PropTypes.number.isRequired,
      })
    ).isRequired, // Ensure sportsParticipation is an array of objects
  }).isRequired,
};

export default Analysis;
