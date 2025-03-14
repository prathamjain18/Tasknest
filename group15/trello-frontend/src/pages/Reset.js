import React from "react";
import * as Yup from "yup";
import { Container, MenuItem, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reset = () => {
    const securityQuestions = [
        { value: "", label: "Select Type" },
        { value: "What is your favorite movie?", label: "What is your favorite movie?" },
        { value: "What is your first pet?", label: "What is your first pet?" },
    ];

    const ResetSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        newPassword: Yup.string()
            .required("New password is required")
            .min(8, "New password must be at least 8 characters long")
            .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
            .matches(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
            .matches(/^(?=.*\d)/, "Password must contain at least one number")
            .matches(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm password is required"),
        securityQuestion: Yup.string()
            .required("Must select a security question"),
        securityAnswer: Yup.string()
            .required("Answer is required")
    });

    const [resetSuccess, setResetSuccess] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            newPassword: "",
            confirmPassword: "",
            securityQuestion: "",
            securityAnswer: ""
        },
        validationSchema: ResetSchema,
        onSubmit: async (values) => {
            const { email, newPassword, securityQuestion, securityAnswer } = values;

            try {
                // Make the API request to reset the password
                await axios.post("http://localhost:8080/api/user/reset-password", {
                    email,
                    newPassword,
                    securityQuestion,
                    securityAnswer,
                });
                navigate('/login');

                setResetSuccess(true);
            } catch (error) {
                console.log("An error occurred:", error.message);
            }
        },
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <Container style={{ backgroundColor: "white", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h1" style={{ fontSize: "40px", background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Reset Password</Typography>

            {resetSuccess ? (
                <Typography variant="body1">
                    Your password has been reset successfully.
                </Typography>
            ) : (
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ width: "300px" }}>
                        <TextField
                            fullWidth
                            label="Email"
                            {...getFieldProps("email")}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            {...getFieldProps("newPassword")}
                            error={Boolean(touched.newPassword && errors.newPassword)}
                            helperText={touched.newPassword && errors.newPassword}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            {...getFieldProps("confirmPassword")}
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                        />

                        <TextField
                            fullWidth
                            select
                            label="Security Question"
                            {...getFieldProps("securityQuestion")}
                            error={Boolean(touched.securityQuestion && errors.securityQuestion)}
                            helperText={touched.securityQuestion && errors.securityQuestion}
                        >
                            {securityQuestions.map((question) => (
                                <MenuItem key={question.value} value={question.value}>
                                    {question.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Security Answer"
                            {...getFieldProps("securityAnswer")}
                            error={Boolean(touched.securityAnswer && errors.securityAnswer)}
                            helperText={touched.securityAnswer && errors.securityAnswer}
                        />

                        <LoadingButton
                            loading={isSubmitting}
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            Confirm
                        </LoadingButton>
                    </Form>
                </FormikProvider>
            )}
        </Container>
    );
};

export default Reset;