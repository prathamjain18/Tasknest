import * as Yup from "yup";
import { Container, TextField, Typography, Link, Card, CardContent, Box, Avatar, Paper } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAuthenticate, setUser } from "../store/slices/user/UserSlice";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import "./Login.css";
import Reset from "./Reset"; // Import the CSS file
import { authenticateUser } from "../store/slices/user/UserThunk";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import storage from "../lib/localStorage";


export default function Login() {
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            const { email, password } = values;

            dispatch(authenticateUser({
                email,
                password,
            })).then((response) => {
                const { payload } = response;

                console.log(payload);

                if (!payload) {
                    toast.error("Something went wrong! Try again later");
                    return;
                }

                if (payload["status"] !== "SUCCESS") {
                    toast.error(payload["message"]);
                    return;
                }

                const data = payload["data"]
                
                storage.put("token", data)

                dispatch(setAuthenticate(data))

                navigate("/home");
            }).catch((error) => {
                console.log(error);
            });

            /*try {
                setLoading(true);

                // Make the API request to log in the user
                const response = await axios.post("http://localhost:8080/api/user/login", {
                    email,
                    password,
                });

                // Dispatch the user data to the store
                dispatch(setUser(response.data));

                // Redirect to a different page upon successful login
                navigate("/home");
                console.log(response.data);
            } catch (error) {
                // Handle error response
                if (error.response && error.response.data) {
                    console.log(error.response.data);
                    if (error.response.data.message === "Password incorrect") {
                        setPasswordIncorrect(true);
                    }
                } else {
                    console.log("An error occurred:", error.message);
                }
            } finally {
                setLoading(false);
            }*/
        },
    });

    const { errors, touched, handleSubmit, getFieldProps } = formik;

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f7fafc 0%, #e3f0ff 100%)' }}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 4, boxShadow: 3, minWidth: 370, maxWidth: 400, width: '100%', boxShadow: '0 4px 32px rgba(25, 118, 210, 0.10)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Avatar src={process.env.PUBLIC_URL + '/logo192.png'} sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }} />
                    <Typography variant="h4" component="h1" fontWeight={700} color="primary" gutterBottom>
                        Tasknest
                    </Typography>
                </Box>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            margin="normal"
                            {...getFieldProps("email")}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ mb: 2, borderRadius: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            {...getFieldProps("password")}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ mb: 2, borderRadius: 2 }}
                        />
                        {passwordIncorrect && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                Password incorrect. Please try again or{' '}
                                <Link component={RouterLink} to="/reset-password" color="primary">
                                    reset your password
                                </Link>.
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ borderRadius: 3, fontWeight: 700, py: 1, px: 3, mt: 2, mb: 1 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                        </Button>
                    </Form>
                </FormikProvider>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/Reset" color="primary" underline="hover">
                        Reset Password
                    </Link>
                </Box>
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/Register" color="primary" underline="hover">
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

