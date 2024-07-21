import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  Text,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ModalPayroll = ({ isOpen, onClose }) => {
  const [payrollData, setPayrollData] = useState({});
  const [time, setTime] = useState("month");
  const API_URL = "http://localhost:8000";
  const userToken = localStorage.getItem("token");
  const decoded = jwt_decode(userToken);
  const userId = decoded.user_id;
  const role = decoded.role;
  const name = decoded.name;
  const email = decoded.email;

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/salary/${time}/${userId}`
        );
        setPayrollData(response.data);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };

    fetchPayrollData();
  }, [userId, time]);

  const handleRangeChange = (event) => {
    setTime(event.target.value);
  };

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={"black"}>Revenue</ModalHeader>
        <ModalCloseButton />
        <ModalBody color={"black"}>
          <Box mb="4">
            <Select value={time} onChange={handleRangeChange}>
              <option value="today">Today</option>
              <option value="month">This Month</option>
              <option value="lastmonth">Last Month</option>
              <option value="year">This Year</option>
              <option value="lastyear">Last Year</option>
            </Select>
          </Box>
          <Text>ID: {userId}</Text>
          <Text>Name: {name}</Text>
          <Text>Email: {email}</Text>
          <Text>Role: {role}</Text>

          {/* <Text>
            Start Date:{" "}
            {new Date(payrollData.startDate).toLocaleDateString("id")}
          </Text> */}
          {/* <Text>
            End Date: {new Date(payrollData.endDate).toLocaleDateString("id")}
          </Text> */}
          <Divider mt={2} mb={2} />
          <Text color={"blue"} mb={6}>
            My Revenue: {rupiah(parseInt(payrollData.revenue))}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalPayroll;
