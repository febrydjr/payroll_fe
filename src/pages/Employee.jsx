import React, { useState, useEffect } from "react";
import Clock from "react-clock";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ModalPayroll from "../components/ModalPayroll";
import {
  Box,
  ChakraProvider,
  extendTheme,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Flex,
  Td,
  Button,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { FiLogOut } from "react-icons/fi";
import { MdLockClock } from "react-icons/md";
import { PiClockClockwiseDuotone } from "react-icons/pi";
import { BsCashStack } from "react-icons/bs";

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

const Employee = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [userData, setUserData] = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(31); // Set items per page to 20
  const toast = useToast();
  const navigate = useNavigate();
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const API_URL = "https://payroll-be.vercel.app";

  const openPayrollModal = () => {
    setIsPayrollModalOpen(true);
  };

  const closePayrollModal = () => {
    setIsPayrollModalOpen(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = format(new Date(), "HH:mm:ss");
      setCurrentTime(currentTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchAttendanceLog = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    try {
      const response = await axios.get(
        `${API_URL}/api/salary/attendance/${decoded.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceLog(response.data);
    } catch (error) {
      console.error("Error fetching attendance log:", error);
    }
  };
  useEffect(() => {
    fetchAttendanceLog();
  }, []);

  const handleClockIn = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);

    try {
      await axios.post(
        `${API_URL}/api/clock/in`,
        { username: decodedToken.username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Success!",
        description: "Successfully clocked in!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setClockedIn(true);
      // window.location.reload();
      fetchAttendanceLog();
    } catch (error) {
      toast({
        title: "Error!",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error("Error clocking in:", error);
    }
  };

  const handleClockOut = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);

    try {
      const response = await axios.post(
        `${API_URL}/api/clock/out`,
        { username: decodedToken.username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Success!",
        description: "Successfully clocked out!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setClockedOut(true);
      setUserData((prevUserData) => ({
        ...prevUserData,
        total_salary: response.data.totalSalary,
        today_revenue: response.data.TodayRevenue,
      }));

      fetchAttendanceLog();
      // window.location.reload();
    } catch (error) {
      toast({
        title: "Error!",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error("Error clocking out:", error);
    }
  };

  async function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  // Calculate pagination details
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendanceLog.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(attendanceLog.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box h="100vh" display="flex" flexDirection="column" alignItems="center">
        <Flex justifyContent={"right"}>
          <Box mb={4}>
            <Box w="100%" display={"flex"} justifyContent={"center"}>
              <Text fontSize="6xl" mt="4">
                {currentTime}
              </Text>
            </Box>
            <Button
              mt="4"
              colorScheme="green"
              onClick={handleClockIn}
              disabled={clockedIn}
            >
              ClockIn&nbsp;
              <PiClockClockwiseDuotone />
            </Button>
            <Button
              mt="4"
              ml={2}
              colorScheme="blue"
              onClick={handleClockOut}
              disabled={clockedOut}
            >
              ClockOut&nbsp;
              <MdLockClock />
            </Button>
            <Button
              ml={2}
              mt={4}
              colorScheme="whiteAlpha"
              onClick={openPayrollModal}
            >
              Payroll &nbsp;
              <BsCashStack />
            </Button>

            <Button ml={2} mt="4" colorScheme="red" onClick={handleLogout}>
              Log Out&nbsp;
              <FiLogOut />
            </Button>
          </Box>
        </Flex>

        <Text fontSize="xl" fontWeight="bold" mt="4">
          My Attendance Log
        </Text>
        <Table mt="4" variant="striped" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Full Name</Th>
              <Th>Schedule In</Th>
              <Th>Schedule Out</Th>
              <Th>Clock In</Th>
              <Th>Clock Out</Th>
              {/* <Th>Today Revenue</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((log) => (
              <Tr key={log.date}>
                <Td>{format(new Date(log.date), "dd-MM-yyyy")}</Td>
                <Td>{log.fullname}</Td>
                <Td>{log.schedule_in}</Td>
                <Td>{log.schedule_out}</Td>
                <Td>{log.clockIn || "-"}</Td>
                <Td>{log.clockOut || "-"}</Td>
                {/* <Td>{log.total_salary}</Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination controls */}
        <Flex justifyContent="center" alignItems="center" padding={10}>
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            mr={2}
          >
            <GrFormPrevious></GrFormPrevious>
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              mx={1}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            ml={2}
          >
            <GrFormNext></GrFormNext>
          </Button>
        </Flex>

        <ModalPayroll isOpen={isPayrollModalOpen} onClose={closePayrollModal} />
      </Box>
    </ChakraProvider>
  );
};

export default Employee;
