import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Flex,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "../index.css";

const ModalGetAttendance = ({ isOpen, onClose }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const API_URL = "https://payroll-be.vercel.app";

  const sortedAttendanceData = [...filteredAttendanceData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    filterData();
  }, [attendanceData, searchName, startDate, endDate]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/salary/attendance`);
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const filterData = () => {
    let filteredData = attendanceData;

    if (searchName) {
      filteredData = filteredData.filter((item) =>
        item.fullname.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredAttendanceData(filteredData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAttendanceData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sortedAttendanceData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={"black"}>Attendance Employee History</ModalHeader>
        <ModalCloseButton color={"black"} />
        <ModalBody color={"black"}>
          <Box mb="4">
            <Flex>
              <Input
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                mr="4"
              />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="  Start Date"
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
              />
              <Text>&nbsp;_&nbsp;</Text>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="  End Date"
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
            </Flex>
          </Box>
          <Table variant="striped" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Full Name</Th>
                <Th>Schedule In</Th>
                <Th>Schedule Out</Th>
                <Th>Clock In</Th>
                <Th>Clock Out</Th>
                {/* <Th>Total Salary</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((item) => (
                <Tr key={item.date}>
                  <Td>{new Date(item.date).toLocaleDateString("id")}</Td>
                  <Td>{item.fullname}</Td>
                  <Td>{item.schedule_in}</Td>
                  <Td>{item.schedule_out}</Td>
                  <Td>{item.clockIn}</Td>
                  <Td>{item.clockOut}</Td>
                  {/* <Td>{formatCurrency(item.total_salary)}</Td> */}
                </Tr>
              ))}
            </Tbody>
          </Table>
          {sortedAttendanceData.length === 0 && (
            <Text mt="4" textAlign="center">
              No matching records found.
            </Text>
          )}
          <Flex justifyContent="center" padding={4}>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              mx={1}
            >
              Prev
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              mx={1}
            >
              Next
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalGetAttendance;
