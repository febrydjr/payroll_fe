import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css";

const Register = () => {
  const toast = useToast();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = "http://localhost:8000";
  useEffect(() => {
    const url = window.location.href.split("/");
    const extractedToken = url[url.length - 1];
    setToken(extractedToken);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const initialValues = {
    token,
    username: "",
    email: "",
    password: "",
    fullname: "",
    birthdate: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address format"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/,
        "Password must contain at least one number and one special character"
      ),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, values);
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: "Registration successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      backgroundColor="black"
      color="black"
      fontFamily={"Victor Mono"}
    >
      <Box width="400px" bg={"white"} borderRadius={4} p={4}>
        <Text fontSize="4xl" mb={4}>
          Register
        </Text>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Field name="token" type="hidden" />
            <Field name="username">
              {({ field }) => (
                <FormControl mb={4}>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
            <Field name="email">
              {({ field }) => (
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <ErrorMessage name="email" component="div" />
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field }) => (
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" />
                  <ErrorMessage name="password" component="div" />
                </FormControl>
              )}
            </Field>
            <Field name="fullname">
              {({ field }) => (
                <FormControl mb={4}>
                  <FormLabel>Full Name</FormLabel>
                  <Input {...field} />
                </FormControl>
              )}
            </Field>
            <Field name="birthdate">
              {({ field, form }) => (
                <FormControl mb={4}>
                  <FormLabel>Birthdate</FormLabel>
                  <DatePicker
                    {...field}
                    selected={form.values.birthdate}
                    onChange={(date) => form.setFieldValue("birthdate", date)}
                    dateFormat="yyyy-MM-dd"
                    className="custom-datepicker"
                    placeholderText="Select a date..."
                  />
                </FormControl>
              )}
            </Field>
            <Button type="submit" colorScheme="blue" width="100%">
              Register
            </Button>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
};

export default Register;
