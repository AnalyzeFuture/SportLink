import {
  Box,
  Text,
  VStack,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { SlBadge } from "react-icons/sl";
import PropTypes from "prop-types";
const ParticipationData = ({ user, handleDelete }) => {
  if (!user.sportsParticipation) {
    return (
      <Box 
      maxH="100vh"
      overflowY="scroll"
      pr={10}
      position="fixed"
      left={10}
      top={20}
      zIndex={10}
      >
        <Text color="white">Loading...</Text>
        
      </Box>
    );
  }

  if (user.sportsParticipation.length === 0) {
    return (
      <Box 
      maxH="100vh"
      overflowY="scroll"
      pr={10}
      position="fixed"
      left={10}
      top={20}
      zIndex={10}
      >
        <Text fontWeight="bold" color="white">
          No Participation Data Available
        </Text>
       
      </Box>
    );
  }

  return (
    <Box
      maxH="100vh"
      overflowY="scroll"
      pr={10}
      position="fixed"
      left={10}
      top={20}
      zIndex={10}
    >
      <VStack spacing={5}>
        {user.sportsParticipation.map((record ) => (
          <Box
            key={record._id}
            position="relative"
            bg="#1E201E"
            w="330px"
            minH="100px"
            borderRadius="12px"
            p={4}
            boxShadow="lg"
            overflow="hidden"
          >
            
            {/* Content */}
            <Flex zIndex={1} position="relative" justify="space-between" align="center">
              <Flex gap={3} align="center">
              <SlBadge color="white" />
                <Box textColor={"white"}>
                  <Text fontWeight="bold" fontSize="md" >
                  Year: <Text as="span" color="#E8C999">{record.year}</Text>
                  </Text>
                  <Text fontSize="sm" >
                    Level: {record.level}
                  </Text>
                </Box>
              </Flex>

              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => handleDelete(record._id)}
                aria-label="Delete"
              />
            </Flex>

            {/* Match Info */}
            <Flex mt={4} justify="space-around" fontSize="sm" textColor={"white"}>
              <Text><b>Matches:</b> <Text as={"span"} color="blue.300">{record.numberOfMatches}</Text></Text>
              <Text><b>Wins:</b> <Text as={"span"} color="teal.300">{record.numberOfGamesWon}</Text></Text>
              <Text><b>Losses:</b>  <Text as={"span"} color="red.300">{record.numberOfGamesLost}</Text></Text>
            </Flex>
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
