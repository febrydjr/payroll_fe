import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";
import {
  Box,
  Input,
  Button,
  Link,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address format"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const Login = () => {
  const API_URL = "http://localhost:8000";
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const role = decoded.role;
        if (role === "admin") {
          return navigate("/admin");
        } else {
          return navigate("/employee");
        }
      } catch (error) {
        return navigate("/not-found");
      }
    } else {
      return navigate("/");
    }
  }, []);

  const handleLogin = async (values) => {
    try {
      const { email, password } = values;
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        const token = res.data.token;
        const decoded = jwt_decode(token);
        const isAdmin = decoded.role;
        toast({
          title: "Success",
          description: "Login Success",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        if (isAdmin == "admin") {
          document.location.href = "/admin";
        } else {
          document.location.href = "/employee";
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Login Failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <Box
      fontFamily={"Victor Mono"}
      bg={"#2a2b2e"}
      backgroundSize={"cover"}
      h={"100vh"}
    >
      <Box display="flex" alignItems="center" justifyContent="center" h="100vh">
        <Box
          bgColor={"white"}
          w="450px"
          p={5}
          border={"1px solid #2D2D2D"}
          borderWidth={1}
          borderRadius={8}
          color={"black"}
          boxShadow={"dark-lg"}
        >
          <Text fontSize={"4xl"}>App Login!</Text>
          <Text fontSize="12px" mb={8}>
            Enter Admin or Employee Credentials
          </Text>
          <Text color={"red"} fontSize="12px">
            Admin Login: admin@gmail.com - Password: Admin123@
          </Text>
          <Text color={"red"} fontSize="12px" mb={8}>
            Employee Login: fahrur@gmail.com - Password: User1234@
          </Text>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {() => (
              <Form>
                <>
                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        mb={2}
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...field} id="email" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                        mb={2}
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input {...field} id="password" type="password" />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button type="submit" colorScheme="gray" mt={1} mb={4}>
                    Login
                  </Button>
                </>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
