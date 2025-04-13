// components/PopupForm.jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useDisclosure } from "@chakra-ui/react";
import { State, City } from "country-state-city";
// import Select from "react-select";
const sportsList = [
  "Athletics",
  "Swimming",
  "Gymnastics",
  "Cricket",
  "Cycling",
  "Rowing",
  "Canoeing",
  "Shooting",
  "Wrestling",
  "Boxing",
  "Judo",
  "Taekwondo",
  "Fencing",
  "Archery",
  "Weightlifting",
  "Equestrian",
  "Sailing",
  "Triathlon",
  "Modern Pentathlon",
  "Badminton",
  "Table Tennis",
  "Tennis",
  "Golf",
  "Basketball",
  "Football (Soccer)",
  "Handball",
  "Volleyball",
  "Beach Volleyball",
  "Rugby Sevens",
  "Skateboarding",
  "Sport Climbing",
  "Surfing",
  "Breaking (Breakdancing)",
];

const levelOptions = [
  "School/Interschool Level",
  "College/Intercollege Level",
  "Club Level",
  "District Level",
  "State Level",
  "Nation Level",
  "International Level",
];

const PopupForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useRecoilState(userAtom);
  const showToast = useShowToast();

  const [formData, setFormData] = useState({
    lovedSport: "",
    currentLevel: "",
    district: "",
    state: "",
    participation: [],
  });

  const [currentYearData, setCurrentYearData] = useState({
    year: "",
    totalmatches: "",
    wins: "",
    loss: "",
  });

  useEffect(() => {
    if (
      user &&
      (!user.lovedSport || !user.currentLevel || !user.district || !user.state)
    ) {
      onOpen(); // Open popup if fields are incomplete
    }
  }, [user, onOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset district if State is changed
    if (name === "state") {
      setFormData({ ...formData, [name]: value, district: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleYearDataChange = (e) => {
    setCurrentYearData({ ...currentYearData, [e.target.name]: e.target.value });
  };

  const addParticipation = () => {
    if (
      !currentYearData.year ||
      !currentYearData.totalmatches ||
      !currentYearData.wins ||
      !currentYearData.loss
    ) {
      showToast("Error", "Please complete all participation fields.", "error");
      return;
    }
    setFormData({
      ...formData,
      participation: [...formData.participation, currentYearData],
    });
    setCurrentYearData({ year: "", totalmatches: "", wins: "", loss: "" });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        showToast("Success", "Profile info updated!", "success");
        setUser({ ...user, ...data });
        localStorage.setItem("userInfo", JSON.stringify({ ...user, ...data }));
        onClose();
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete Your Sports Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap={3}>
          <Select
            placeholder="Select Loved Sport"
            name="lovedSport"
            value={formData.lovedSport}
            onChange={handleChange}
          >
            {sportsList.map((sport, idx) => (
              <option key={idx} value={sport}>
                {sport}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Select Current Level"
            name="currentLevel"
            value={formData.currentLevel}
            onChange={handleChange}
          >
            {levelOptions.map((level, idx) => (
              <option key={idx} value={level}>
                {level}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Select State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            {State.getStatesOfCountry("IN").map((state) => (
              <option key={state.isoCode} value={state.name}>
                {state.name}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Select District"
            name="district"
            value={formData.district}
            onChange={handleChange}
            isDisabled={!formData.state}
          >
            {formData.state &&
              City.getCitiesOfState(
                "IN",
                State.getStatesOfCountry("IN").find(
                  (s) => s.name === formData.state
                )?.isoCode
              ).map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
          </Select>

          <Box mt={4} p={2} border="1px solid #ddd" borderRadius={6}>
            <Text fontWeight="bold" mb={2}>
              Add Participation Record
            </Text>
            <Flex gap={2} wrap="wrap">
              <Input
                type="number"
                placeholder="Year"
                name="year"
                value={currentYearData.year}
                onChange={handleYearDataChange}
              />
              <Input
                type="number"
                placeholder="Total Matches"
                name="totalmatches"
                value={currentYearData.totalmatches}
                onChange={handleYearDataChange}
              />
              <Input
                type="number"
                placeholder="Wins"
                name="wins"
                value={currentYearData.wins}
                onChange={handleYearDataChange}
              />
              <Input
                type="number"
                placeholder="Loss"
                name="loss"
                value={currentYearData.loss}
                onChange={handleYearDataChange}
              />
              <Button colorScheme="teal" onClick={addParticipation}>
                Add
              </Button>
            </Flex>

            {formData.participation.length > 0 && (
              <Box mt={3}>
                {formData.participation.map((item, index) => (
                  <Box key={index} mt={1} bg="gray.100" p={2} borderRadius={4}>
                    <Text fontSize="sm">
                      <b>{item.year}</b> — {item.totalmatches} matches,{" "}
                      {item.wins} wins, {item.loss} losses
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PopupForm;
