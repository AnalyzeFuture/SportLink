/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Text, Spinner } from "@chakra-ui/react";

const SportsParticipationChart = ({ user }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipationData = async () => {
      try {
        const response = await fetch(`/api/users/sports-participation`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Sports Participation Data: ", data);

        const transformedData = data.map((entry) => ({
          year: entry.year,
          Matches: entry.numberOfMatches,
          Won: entry.numberOfGamesWon,
          Lost: entry.numberOfGamesLost,
        }));

        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchParticipationData();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      position="fixed"
      right="5px"
      top="140px"
      maxW="440px"
      w="100%"
      h="420px"
      bg="#101010"
      boxShadow="lg"
      borderRadius="xl"
      p={4}
    >
      <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4} color="white">
        Performance Analysis
      </Text>

      {loading ? (
        <Spinner size="lg" thickness="4px" color="blue.500" mx="auto" display="block" />
      ) : error ? (
        <Text color="red.500" textAlign="center">
          Error: {error}
        </Text>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6f61" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff6f61" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="year" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Matches" stroke="#8884d8" fillOpacity={1} fill="url(#colorMatches)" />
            <Area type="monotone" dataKey="Won" stroke="#82ca9d" fillOpacity={1} fill="url(#colorWon)" />
            <Area type="monotone" dataKey="Lost" stroke="#ff6f61" fillOpacity={1} fill="url(#colorLost)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <Text color="red.500" textAlign="center">
          No data available to display.
        </Text>
      )}
    </Box>
  );
};

export default SportsParticipationChart;
