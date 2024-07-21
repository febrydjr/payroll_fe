import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  useToast,
  FormControl,
} from "@chakra-ui/react";
import axios from "axios";

const ModalAddEmployee = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const API_URL = "https://payroll-be.vercel.app";

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await axios.post(`${API_URL}/api/auth/send-link`, {
        email,
      });
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: "Email sent!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setSubmitError("Error submitting data");
      setIsSubmitting(false);
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="black">Add Employee</ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody color="black">
          <FormControl>
            <Input
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
          </FormControl>
          {submitError && <div>{submitError}</div>}
          <Button
            mt={3}
            mb={3}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            colorScheme="blue"
          >
            Send Link
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalAddEmployee;
