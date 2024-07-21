import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Flex,
  SimpleGrid,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

const ModalSalaryManagement = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:8000";
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/salary`);
        setUsers(response.data.users);
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const dataColor = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("gray.100", "gray.700");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader ml={2} color={"black"}>
          Employee Salary
        </ModalHeader>
        <ModalCloseButton color={"black"} />
        <ModalBody color={"black"}>
          {error ? (
            <div>{error}</div>
          ) : (
            <Flex direction="column" bg={dataColor} p={2}>
              <SimpleGrid
                columns={3}
                w="full"
                textTransform="uppercase"
                bg={bg2}
                color={"gray.500"}
                py={1}
                px={4}
                fontSize="md"
                fontWeight="hairline"
              >
                <span>Full Name</span>
                <span>Rate</span>
                <span>This Month Salary</span>
                {/* <span>This Month Salary</span> */}
              </SimpleGrid>
              {users.map((user) => (
                <SimpleGrid
                  columns={3}
                  w="full"
                  py={2}
                  px={4}
                  fontWeight="hairline"
                  key={user.user_id}
                >
                  <span>{user.fullname}</span>
                  <chakra.span>
                    {formatCurrency(user.Salary.monthly_salary)}
                  </chakra.span>
                  <chakra.span>
                    {formatCurrency(user.total_salary)}  
                  </chakra.span>
                </SimpleGrid>
              ))}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalSalaryManagement;
