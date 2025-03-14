import * as Yup from "yup";
import { Container, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/user/UserSlice";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must have a minimum length of 8 characters")
            .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
            .matches(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
            .matches(/^(?=.*\d)/, "Password must contain at least one number")
            .matches(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character")
            .required("Password is required"),
        userType: Yup.string()
            .required("Must select a user type"),
        securityQuestion: Yup.string()
            .required("Must select a security question"),
        securityAnswer: Yup.string()
            .required("Answer is required")
    });

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            userType: "",
            securityQuestion: "",
            securityAnswer: ""
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values) => {
            const { email, password, userType, securityQuestion, securityAnswer } = values;
            //console.log(values);

            //dispatch(setUser({
            //    email, password, userType, securityQuestion, securityAnswer
            //}));
            try {
                // Make the API request to register the user
                const response = await axios.post("http://localhost:8080/api/user/register", {
                    email,
                    password,
                    userType,
                    securityQuestion,
                    securityAnswer
                });

                navigate("/login");
                console.log(response.data);
            } catch (error) {
                // Handle error response
                if (error.response && error.response.data) {
                    console.log(error.response.data);
                } else {
                    console.log("An error occurred:", error.message);
                }
            }
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <Container style={{ backgroundColor: "white", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h1" style={{ fontSize: "40px", background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Welcome!</Typography>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ width: "50%" }}>
                    <TextField
                        fullWidth
                        label="Email"
                        {...getFieldProps("email")}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        {...getFieldProps("password")}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                    />

                    <Select
                        fullWidth
                        label="Type"
                        defaultValue=""
                        id="type-select"
                        {...getFieldProps("userType")}
                        error={Boolean(touched.userType && errors.userType)}
                        helperText={touched.userType && errors.userType}
                    >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Teacher">Teacher</MenuItem>
                    </Select>

                    <Select
                        fullWidth
                        label="Security Question"
                        defaultValue=""
                        id="question-select"
                        {...getFieldProps("securityQuestion")}
                        error={Boolean(touched.securityQuestion && errors.securityQuestion)}
                        helperText={touched.securityQuestion && errors.securityQuestion}
                    >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="What is your favorite movie?">What is your favorite movie?</MenuItem>
                        <MenuItem value="What is your first pet?">What is your first pet?</MenuItem>
                    </Select>

                    <TextField
                        fullWidth
                        label="Security Answer"
                        {...getFieldProps("securityAnswer")}
                        error={Boolean(touched.securityAnswer && errors.securityAnswer)}
                        helperText={touched.securityAnswer && errors.securityAnswer}
                    />

                    <LoadingButton loading={isSubmitting} type="submit" fullWidth variant="contained">
                        Register
                    </LoadingButton>
                </Form>
            </FormikProvider>
        </Container>
    );
}




