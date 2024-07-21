import React, { useState } from "react";
import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Text,
  extendTheme,
  Icon,
} from "@chakra-ui/react";
import {
  FaUser,
  FaMoneyBill,
  FaHistory,
  FaHourglass,
  FaSignOutAlt,
} from "react-icons/fa";
import { TbUserDollar } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import ModalUserManagement from "../components/ModalUserManagement";
import ModalSalaryManagement from "../components/ModalSalaryManagement";
import ModalSetSalary from "../components/ModalSetSalary";
import ModalGetAttendance from "../components/ModalGetAttendance";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "black",
        color: "white",
        fontFamily: "Victor Mono",
      },
    },
  },
});

const Admin = () => {
  const navigate = useNavigate();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isSetSalaryModalOpen, setIsSetSalaryModalOpen] = useState(false);
  const [isGetAttendanceModalOpen, setIsGetAttendanceModalOpen] =
    useState(false);

  const tiles = [
    { title: "Employee Management", icon: FaUser, color: "blue.500" },
    { title: "Salary Management", icon: FaMoneyBill, color: "green.500" },
    { title: "Attendance History", icon: FaHistory, color: "purple.500" },
    { title: "Set Salary", icon: TbUserDollar, color: "orange.500" },
    { title: "Logout", icon: FaSignOutAlt, color: "red.500" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const openUserModal = () => {
    setIsUserModalOpen(true);
  };

  const openSalaryModal = () => {
    setIsSalaryModalOpen(true);
  };

  const openSetSalaryModal = () => {
    setIsSetSalaryModalOpen(true);
  };

  const openGetAttendanceModal = () => {
    setIsGetAttendanceModalOpen(true);
  };

  const closeModal = () => {
    setIsUserModalOpen(false);
    setIsSalaryModalOpen(false);
    setIsSetSalaryModalOpen(false);
    setIsGetAttendanceModalOpen(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" mb="4">
            -- ADMIN DASHBOARD --
          </Text>
          <Flex justifyContent="center" flexWrap="wrap">
            {tiles.map((tile, index) => (
              <Center
                key={index}
                w="200px"
                h="200px"
                borderRadius="md"
                bg={tile.color}
                m="2"
                position="relative"
                onClick={
                  tile.title === "Logout"
                    ? handleLogout
                    : tile.title === "Employee Management"
                    ? openUserModal
                    : tile.title === "Salary Management"
                    ? openSalaryModal
                    : tile.title === "Set Salary"
                    ? openSetSalaryModal
                    : tile.title === "Attendance History"
                    ? openGetAttendanceModal
                    : null
                }
                cursor={tile.title === "Logout" ? "pointer" : "pointer"}
              >
                <Icon as={tile.icon} boxSize={14} color="white" />
                <Text
                  position="absolute"
                  bottom="0"
                  w="100%"
                  textAlign="center"
                  bg="rgba(0, 0, 0, 0.5)"
                  p="2"
                >
                  {tile.title}
                </Text>
              </Center>
            ))}
          </Flex>
          <ModalUserManagement isOpen={isUserModalOpen} onClose={closeModal} />
          <ModalSalaryManagement
            isOpen={isSalaryModalOpen}
            onClose={closeModal}
          />
          <ModalSetSalary isOpen={isSetSalaryModalOpen} onClose={closeModal} />
          <ModalGetAttendance
            isOpen={isGetAttendanceModalOpen}
            onClose={closeModal}
          />
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Admin;
