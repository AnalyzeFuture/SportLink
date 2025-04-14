import { Box, Text, VStack, Button, Spinner } from "@chakra-ui/react";
import PropTypes from "prop-types"; // Import PropTypes

const ParticipationData = ({ user, handleDelete }) => {
  // const user = useRecoilState(userAtom); // Access the user state directly
  // console.log("user in participationdata.jsx ", user);

  if (user.sportsParticipation === undefined) {
    return (
      <Box
        bg="#1E201E"
        p={4}
        borderRadius="lg"
        boxShadow="md"
        w="full"
        textAlign="center"
        position={"fixed"}
        left={20}
        top={50}
        maxW={"350px"}
      >
        <Spinner size="lg" color="white" />
      </Box>
    );
  }

  if (user.sportsParticipation.length === 0) {
    return (
      <Box
        bg="#1E201E"
        p={4}
        borderRadius="lg"
        boxShadow="md"
        w="full"
        textAlign="center"
        position={"fixed"}
        left={20}
        top={50}
        maxW={"350px"}
      >
        <Text fontWeight="bold" color="white">
          No Participation Data Available
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="#1E201E"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      w="full"
      position={"fixed"}
      left={10}
      top={50}
      maxW={"350px"} // Set a max width for the box
      textAlign="center"
    >
      <Text fontWeight="bold" mb={2} color="white">
        Participation Records
      </Text>
      <VStack align="start" spacing={4}>
        {user.sportsParticipation?.map((record) => (
          <Box
            key={record._id}
            p={3}
            bg="gray.700"
            borderRadius="md"
            w="full"
            position="relative"
          >
            <Text fontSize="sm" color="white">
              <b>Year:</b> {record.year}
            </Text>
            <Text fontSize="sm" color="white">
              <b>Total Matches:</b> {record.numberOfMatches}
            </Text>
            <Text fontSize="sm" color="white">
              <b>Wins:</b> {record.numberOfGamesWon}
            </Text>
            <Text fontSize="sm" color="white">
              <b>Losses:</b> {record.numberOfGamesLost}
            </Text>
            <Text fontSize="sm" color="white">
              <b>Level:</b> {record.level}
            </Text>
            <Button
              size="sm"
              colorScheme="red"
              position="absolute"
              top="10px"
              right="10px"
              onClick={() => handleDelete(record._id)} // Call handleDelete with the record ID
            >
              Delete
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

ParticipationData.propTypes = {
  user: PropTypes.shape({
    sportsParticipation: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        numberOfMatches: PropTypes.number.isRequired,
        numberOfGamesWon: PropTypes.number.isRequired,
        numberOfGamesLost: PropTypes.number.isRequired,
        level: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ParticipationData;
